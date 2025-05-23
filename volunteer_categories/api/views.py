from ..models import VolunteerCategory, Request, CategoryType, Role, EventDate
from .serializers import (
    VolunteerCategorySerializer,
    RequestSerializer,
    CategoryTypeSerializer,
    RoleSerializer,
    EventDateSerializer,
)
from .permissions import IsAdminOrAuthenticatedReadOnly

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from backend import settings
from post_office import mail

from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION

class VolunteerCategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    permission_classes = [IsAdminOrAuthenticatedReadOnly]

    serializer_class = VolunteerCategorySerializer

    def get_queryset(self):
        """
        Optionally restricts the returned categories to a given user,
        by filtering against a `date` query parameter in the URL.
        """
        queryset = VolunteerCategory.categories.all()
        use_event_dates = self.request.query_params.get("use_event_dates")
        try:
            if (
                use_event_dates
                and use_event_dates.lower() == "true"
                and EventDate.dates.exists()
            ):
                start_date = EventDate.dates.earliest("event_date").event_date.strftime(
                    "%Y-%m-%d"
                )
                end_date = EventDate.dates.latest("event_date").event_date.strftime(
                    "%Y-%m-%d"
                )
                queryset = queryset.filter(start_time__range=[start_date, end_date])
        except Exception as e:
            print(f"Issue {e}")
        return queryset


class RequestViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    def overlappingRequests(self, request1, request2):
        event1 = request1.role.category
        event2 = request2.role.category
        return (
            event2.start_time >= event1.start_time
            and event2.start_time < event1.end_time
        ) or (
            event2.end_time > event1.start_time and event2.end_time <= event1.end_time
        )

    def perform_destroy(self, instance):
        from django.db.models import Q
        from django.contrib.auth.models import User

        print("perform destroy")

        deleting_user = User.objects.get(pk=instance.user.pk)
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
            "first_name": deleting_user.first_name,
            "last_name": deleting_user.last_name,
            "category_type": category_type.tag,
            "title": instance.role.title,
            "start_time": instance.role.category.start_time,
            "end_time": instance.role.category.end_time,
        }

        mail.send(
            deleting_user.email,
            email_from,
            template="request_delete_email",
            context=email_context,
            bcc=recipient_list,
        )

        if instance.status == Request.ACCEPTED:
            requests = instance.user.requests.all().exclude(pk=instance.id)
            for req in requests:
                if self.overlappingRequests(instance, req):
                    req.status = Request.PENDING
                    req.save()

        instance.delete()
        self._log_on_destroy(instance)

    permission_classes = [IsAuthenticatedOrReadOnly]

    serializer_class = RequestSerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned requests to a given user,
        by filtering against a `date` query parameter in the URL.
        """
        queryset = Request.requests.all()
        use_event_dates = self.request.query_params.get("use_event_dates")
        try:
            if (
                use_event_dates
                and use_event_dates.lower() == "true"
                and EventDate.dates.exists()
            ):
                start_date = EventDate.dates.earliest("event_date").event_date.strftime(
                    "%Y-%m-%d"
                )
                end_date = EventDate.dates.latest("event_date").event_date.strftime(
                    "%Y-%m-%d"
                )
                queryset = queryset.filter(role__category__start_time__range=[start_date, end_date])
        except Exception as e:
            print(f"Issue {e}")
        return queryset
    
    def perform_create(self, serializer):
        super().perform_create(serializer)
        self._log_on_create(serializer)

    def perform_update(self, serializer):
        old_data = self.serializer_class(self.get_object()).data
        super().perform_update(serializer)
        self._log_on_update(serializer, old_data)

    def _log_on_create(self, serializer):
        # Log the creation of the object
        LogEntry.objects.log_action(
            user_id=self.request.user.pk,
            content_type_id=serializer.instance._meta.pk,
            object_id=serializer.instance.pk,
            object_repr=str(serializer.instance),
            action_flag=ADDITION,  # 1 for add
            change_message=f"Created object: {serializer.data}",
        )

    def _log_on_update(self, serializer, old_data):
        # Log the update of the object
        LogEntry.objects.log_action(
            user_id=self.request.user.pk,
            content_type_id=serializer.instance._meta.pk,
            object_id=serializer.instance.pk,
            object_repr=str(serializer.instance),
            action_flag=CHANGE,  # 2 for change
            change_message=f"Updated object. Old data: {old_data}, new data: {serializer.data}",
        )

    def _log_on_destroy(self, instance):
        # Log the deletion of the object
        LogEntry.objects.log_action(
            user_id=self.request.user.pk,
            content_type_id=instance._meta.pk,
            object_id=instance.pk,
            object_repr=str(instance),
            action_flag=DELETION,  # 3 for delete
            change_message=f"Deleted object: {instance}",
        )


class CategoryTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `detail` actions.
    """

    queryset = CategoryType.types.all()
    serializer_class = CategoryTypeSerializer


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    permission_classes = [IsAdminOrAuthenticatedReadOnly]

    queryset = Role.roles.all()
    serializer_class = RoleSerializer


class CategoryOfTypeViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving all categories of a specific type
    """

    permission_classes = [IsAdminOrAuthenticatedReadOnly]

    def retrieve(self, request, pk=None):
        use_event_dates = request.query_params.get("use_event_dates")

        if (
            use_event_dates
            and use_event_dates.lower() == "true"
            and EventDate.dates.exists()
        ):
            start_date = EventDate.dates.earliest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            end_date = EventDate.dates.latest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            queryset = VolunteerCategory.categories.filter(
                category_type__pk__iexact=pk
            ).filter(start_time__range=[start_date, end_date])
        else:
            queryset = VolunteerCategory.categories.filter(category_type__pk__iexact=pk)

        serializer = VolunteerCategorySerializer(queryset, many=True)
        return Response(serializer.data)


class CategoriesWithRolesViewSet(viewsets.ViewSet):
    """
    Custom viewset for getting all categories with roles that have the same name as the role with that role id
    """

    permission_classes = [IsAdminOrAuthenticatedReadOnly]

    @action(
        methods=["get"],
        detail=False,
        url_path="(?P<rid>\d+)",
        url_name="categoriesWithRoles",
    )
    def get_with_roleid(self, request, pk=None, rid=None):
        role = Role.roles.get(pk=rid)
        use_event_dates = request.query_params.get("use_event_dates")

        if (
            use_event_dates
            and use_event_dates.lower() == "true"
            and EventDate.dates.exists()
        ):
            start_date = EventDate.dates.earliest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            end_date = EventDate.dates.latest("event_date").event_date.strftime(
                "%Y-%m-%d"
            )
            queryset = VolunteerCategory.categories.filter(
                roles__title__iexact=role.title
            ).filter(start_time__range=[start_date, end_date])
        else:
            queryset = VolunteerCategory.categories.filter(
                roles__title__iexact=role.title
            )

        serializer = VolunteerCategorySerializer(queryset, many=True)
        role_dict = serializer.data
        # print(role_dict)
        role_dict.append({"role_title": role.title})
        return Response(role_dict)


class EventDateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `detail` actions.
    """

    queryset = EventDate.dates.all()
    serializer_class = EventDateSerializer
