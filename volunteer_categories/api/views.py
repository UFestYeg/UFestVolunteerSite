from ..models import VolunteerCategory, Request, CategoryType, Role
from .serializers import (
    VolunteerCategorySerializer,
    RequestSerializer,
    CategoryTypeSerializer,
    RoleSerializer,
)

from rest_framework import viewsets


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


class RoleTypeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = Role.roles.all()
    serializer_class = RoleSerializer
