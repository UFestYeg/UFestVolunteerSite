from ..models import ScheduleEvent
from .serializers import ScheduleEventSerializer

from rest_framework import viewsets


class ScheduleEventViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `detail`, `create`, `update` and `delete` actions.
    """

    queryset = ScheduleEvent.events.all()
    serializer_class = ScheduleEventSerializer
