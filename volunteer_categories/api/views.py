from ..models import VolunteerCategory, Request, CategoryType, Role
from .serializers import (
    VolunteerCategorySerializer,
    RequestSerializer,
    CategoryTypeSerializer,
    RoleSerializer,
)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from django.core.mail import send_mail
from django.conf import settings


class VolunteerCategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = VolunteerCategory.categories.all()
    serializer_class = VolunteerCategorySerializer


class RequestViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    def perform_destroy(self, instance):
        from django.db.models import Q
        from django.contrib.auth.models import User

        print("perform destroy")

        deleting_user = User.objects.get(pk=instance.user.pk)
        category_type = CategoryType.types.get(
            pk=instance.role.category.category_type.id
        )

        subject = f"Deleted request #{instance.id}"
        message = (
            f"Volunteer {deleting_user.first_name} {deleting_user.last_name} deleted a request on role "
            f"{category_type.tag}:{instance.role.title} at {instance.role.start_time} - {instance.role.end_time}"
        )
        email_from = settings.EMAIL_HOST_USER

        admins = User.objects.filter(Q(is_staff=True))
        recipient_list = list(
            i for i in admins.values_list("email", flat=True) if bool(i)
        )
        send_mail(subject, message, email_from, recipient_list)

        instance.delete()

    queryset = Request.requests.all()
    serializer_class = RequestSerializer


class CategoryTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `detail` actions.
    """

    queryset = CategoryType.types.all()
    serializer_class = CategoryTypeSerializer


class RoleTypeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = Role.roles.all()
    serializer_class = RoleSerializer


class CategoryOfTypeViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving all categories of a specific type
    """

    def retrieve(self, request, pk=None):
        queryset = VolunteerCategory.categories.filter(category_type__pk__iexact=pk)
        serializer = VolunteerCategorySerializer(queryset, many=True)
        return Response(serializer.data)


class CategoriesWithRolesViewSet(viewsets.ViewSet):
    """
    Custom viewset for getting all categories with roles that have the same name as the role with that role id
    """

    @action(
        methods=["get"],
        detail=False,
        url_path="(?P<rid>\d+)",
        url_name="categoriesWithRoles",
    )
    def get_with_roleid(self, request, pk=None, rid=None):
        print(pk, rid)
        role = Role.roles.get(pk=rid)
        queryset = VolunteerCategory.categories.filter(roles__title__iexact=role.title)
        serializer = VolunteerCategorySerializer(queryset, many=True)
        role_dict = serializer.data
        # print(role_dict)
        role_dict.append({"role_title": role.title})
        return Response(role_dict)
