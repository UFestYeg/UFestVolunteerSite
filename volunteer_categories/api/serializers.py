from rest_framework import serializers
from volunteer_categories.models import VolunteerCategory, Request, Role, CategoryType
from django.db.utils import IntegrityError
from django.contrib.auth.models import User
from backend import settings
from post_office import mail


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ("id", "tag")


class RoleSerializer(serializers.ModelSerializer):
    number_of_open_positions = serializers.ReadOnlyField()

    class Meta:
        model = Role
        fields = (
            "id",
            "title",
            "description",
            "number_of_positions",
            "number_of_open_positions",
            "category",
        )
        depth = 1


class RequestSerializer(serializers.ModelSerializer):
    role = RoleSerializer()

    class Meta:
        model = Request
        fields = ("id", "user", "status", "role")

    def overlappingRequests(self, request1, request2):
        event1 = request1.role.category
        event2 = request2.role.category
        return (
            event2.start_time >= event1.start_time
            and event2.start_time < event1.end_time
        ) or (
            event2.end_time > event1.start_time and event2.end_time <= event1.end_time
        )

    def create(self, validated_data):
        def send_create_mail(instance):
            from django.db.models import Q

            updated_user = User.objects.get(pk=instance.user.pk)
            category_type = CategoryType.types.get(
                pk=instance.role.category.category_type.id
            )

            email_from = settings.EMAIL_HOST_USER

            admins = User.objects.filter(Q(is_staff=True))
            recipient_list = list(
                i for i in admins.values_list("email", flat=True) if bool(i)
            )

            email_context = {
                "id": instance.id,
                "first_name": updated_user.first_name,
                "last_name": updated_user.last_name,
                "category_type": category_type.tag,
                "title": instance.role.title,
                "start_time": instance.role.category.start_time,
                "status": instance.status,
                "end_time": instance.role.category.end_time,
            }

            mail.send(
                updated_user.email,
                email_from,
                template="request_create_email",
                context=email_context,
            )

        try:
            role_validated_data = validated_data.pop("role")
            role = Role.roles.get(
                title=role_validated_data.get("title"),
                description=role_validated_data.get("description"),
            )
            validated_data["role"] = role
            request = Request.requests.create(**validated_data)

            requests = request.user.requests.all().exclude(pk=request.id)
            for req in requests:
                if req.status == Request.ACCEPTED and self.overlappingRequests(
                    request, req
                ):
                    request.status = Request.UNAVAILABLE
                    request.save()
                    break
            send_create_mail(request)
            return request
        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "Duplicate requests not allowed."}
            )
        except:
            print("unexpected error")

    def update(self, instance, validated_data):
        def send_update_mail(instance):
            from django.db.models import Q

            updated_user = User.objects.get(pk=instance.user.pk)
            category_type = CategoryType.types.get(
                pk=instance.role.category.category_type.id
            )

            email_from = settings.EMAIL_HOST_USER

            admins = User.objects.filter(Q(is_staff=True))
            recipient_list = list(
                i for i in admins.values_list("email", flat=True) if bool(i)
            )

            email_context = {
                "id": instance.id,
                "first_name": updated_user.first_name,
                "last_name": updated_user.last_name,
                "category_type": category_type.tag,
                "title": instance.role.title,
                "start_time": instance.role.category.start_time,
                "status": instance.status,
                "end_time": instance.role.category.end_time,
            }

            mail.send(
                updated_user.email,
                email_from,
                template="request_update_email",
                context=email_context,
            )

        role_validated_data = validated_data.pop("role")

        old_status = instance.status
        instance.status = validated_data.get("status", instance.status)

        role = Role.roles.get(
            title=role_validated_data.get("title"),
            description=role_validated_data.get("description"),
            number_of_positions=role_validated_data.get("number_of_positions"),
        )
        instance.role = role

        if old_status != Request.ACCEPTED and instance.status == Request.ACCEPTED:
            accepted_requests = instance.role.requests.filter(status=Request.ACCEPTED)
            if instance.role.number_of_positions == len(accepted_requests):
                raise serializers.ValidationError(
                    {"detail": "Cannot accept any more requests."}
                )
            requests = instance.user.requests.all().exclude(pk=instance.id)
            for req in requests:
                if self.overlappingRequests(instance, req):
                    req.status = Request.UNAVAILABLE
                    req.save()
        elif old_status == Request.ACCEPTED and instance.status != Request.ACCEPTED:
            requests = instance.user.requests.all().exclude(pk=instance.id)
            for req in requests:
                if self.overlappingRequests(instance, req):
                    req.status = Request.PENDING
                    req.save()

        instance.save()

        send_update_mail(instance)

        return instance


class VolunteerCategorySerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    category_type = CategoryTypeSerializer()
    number_of_positions = serializers.ReadOnlyField()
    number_of_open_positions = serializers.ReadOnlyField()

    class Meta:
        model = VolunteerCategory
        fields = (
            "id",
            "title",
            "description",
            "start_time",
            "end_time",
            "category_type",
            "roles",
            "number_of_positions",
            "number_of_open_positions",
        )

    def create(self, validated_data):
        category_type_validated_data = validated_data.pop("category_type")
        volunteer_category = VolunteerCategory.categories.create(**validated_data)
        category_type = CategoryType.types.get(
            tag=category_type_validated_data.get("tag")
        )

        volunteer_category.category_type = category_type

        volunteer_category.save()
        return volunteer_category

    def update(self, instance, validated_data):
        category_type_validated_data = validated_data.pop("category_type")

        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.start_time = validated_data.get("start_time", instance.start_time)
        instance.end_time = validated_data.get("end_time", instance.end_time)

        category_type = CategoryType.types.get(
            tag=category_type_validated_data.get("tag")
        )

        instance.category_type = category_type

        instance.save()

        return instance
