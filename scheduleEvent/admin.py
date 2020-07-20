from django.contrib import admin
from .models import ScheduleEvent

# Register your models here.


class ScheduleEventAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "start_time", "end_time", "number_of_slots")

    list_filter = ["start_time"]

    search_fields = ["title"]


admin.site.register(ScheduleEvent, ScheduleEventAdmin)
