from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduleEventViewSet, RequestViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"events", ScheduleEventViewSet, basename="scheduleEvent")
router.register(r"requests", RequestViewSet, basename="request")
# The API URLs are now determined automatically by the router.
urlpatterns = [
    path("", include(router.urls)),
]
