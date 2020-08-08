from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VolunteerCategoryViewSet, RequestViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"positions", VolunteerCategoryViewSet, basename="volunteerCategory")
router.register(r"requests", RequestViewSet, basename="request")
# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
