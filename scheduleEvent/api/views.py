from ..models import ScheduleEvent, Request
from .serializers import ScheduleEventSerializer, RequestSerializer

from rest_framework import viewsets


class ScheduleEventViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = ScheduleEvent.events.all()
    serializer_class = ScheduleEventSerializer


class RequestViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = Request.requests.all()
    serializer_class = RequestSerializer
