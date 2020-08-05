from django.contrib import admin
from .models import ScheduleEvent, Request

# Register your models here.


class ScheduleEventAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "start_time",
                    "end_time", "number_of_slots")

    list_filter = ["start_time"]

    search_fields = ["title"]


class RequestAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "status")

    list_filter = ["status", "event", "user"]


admin.site.register(ScheduleEvent, ScheduleEventAdmin)
admin.site.register(Request, RequestAdmin)
