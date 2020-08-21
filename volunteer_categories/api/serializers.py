from rest_framework import serializers
from volunteer_categories.models import VolunteerCategory, Request, Role, CategoryType
from django.db.utils import IntegrityError


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ("id", "tag")


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "title", "description", "number_of_positions", "category")
        depth = 1


class RequestSerializer(serializers.ModelSerializer):
    role = RoleSerializer()

    class Meta:
        model = Request
        fields = ("id", "user", "status", "role")

    def shouldBeMadeUnavailable(self, request1, request2):
        event1 = request1.role.category
        event2 = request2.role.category
        return (
            event2.start_time >= event1.start_time
            and event2.start_time < event1.end_time
        ) or (
            event2.end_time > event1.start_time and event2.end_time <= event1.end_time
        )

    def create(self, validated_data):
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
                if self.shouldBeMadeUnavailable(request, req):
                    request.status = Request.UNAVAILABLE
                    request.save()
                    break
            return request
        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "Duplicate requests not allowed."}
            )
        except:
            print("unexpected error")

    def update(self, instance, validated_data):
        role_validated_data = validated_data.pop("role")

        old_status = instance.status
        instance.status = validated_data.get("status", instance.status)
        print(role_validated_data)
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
                if self.shouldBeMadeUnavailable(instance, req):
                    req.status = Request.UNAVAILABLE
                    req.save()

        instance.save()

        return instance


class NumberOfPositionsField(serializers.ReadOnlyField):
    def to_representation(self, value):
        return f"{value}"


class VolunteerCategorySerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    category_type = CategoryTypeSerializer()
    number_of_positions = NumberOfPositionsField()

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
