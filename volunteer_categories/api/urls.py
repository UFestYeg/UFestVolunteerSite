from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerCategoryViewSet, RequestViewSet, CategoryTypeViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"positions", VolunteerCategoryViewSet, basename="volunteerCategory")
router.register(r"requests", RequestViewSet, basename="request")
router.register(r"categories", CategoryTypeViewSet, basename="category")
# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
