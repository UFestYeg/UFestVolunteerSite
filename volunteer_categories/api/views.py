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

    queryset = Request.requests.all()
    serializer_class = RequestSerializer


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
        role = Role.roles.get(pk=rid)
        queryset = VolunteerCategory.categories.filter(roles__title__iexact=role.title)
        serializer = VolunteerCategorySerializer(queryset, many=True)
        role_dict = serializer.data
        # print(role_dict)
        role_dict.append({"role_title": role.title})
        return Response(role_dict)
