from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VolunteerCategoryViewSet,
    RequestViewSet,
    CategoryTypeViewSet,
    CategoryOfTypeViewSet,
    CategoriesWithRolesViewSet,
    RoleViewSet,
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"positions", VolunteerCategoryViewSet, basename="volunteerCategory")
router.register(r"roles", RoleViewSet, basename="request")
router.register(r"requests", RequestViewSet, basename="request")
router.register(r"categories", CategoryTypeViewSet, basename="category")
router.register(
    r"positions/category", CategoryOfTypeViewSet, basename="positionCategory"
)
# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
    path(
        r"positions/category/<int:pk>/roles/<int:rid>/",
        CategoriesWithRolesViewSet.as_view({"get": "get_with_roleid"}),
        name="categoriesWithRole",
    ),
]
