from rest_framework import serializers
from scheduleEvent.models import ScheduleEvent, Request


class ScheduleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleEvent
        fields = ("id", "title", "start_time", "end_time",
                  "number_of_slots", "category")


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ("id", "event", "user", "status")
