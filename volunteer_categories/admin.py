from django import forms
from django.contrib import admin, messages
from django.urls import path
from .models import VolunteerCategory, Request, CategoryType, Role
from django.shortcuts import render, redirect
import datetime
from django.http import HttpResponse
import csv
from backend.settings import TIME_ZONE
from pytz import timezone
import time

DATE_CHOICES = [
    (datetime.date(2021, 5, 19), "Wednesday"),
    (datetime.date(2021, 5, 20), "Thursday"),
    (datetime.date(2021, 5, 21), "Friday"),
    (datetime.date(2021, 5, 22), "Saturday"),
    (datetime.date(2021, 5, 23), "Sunday"),
]


class DailyCheckinForm(forms.Form):
    selected_date = forms.ChoiceField(choices=DATE_CHOICES)


# Register your models here.
@admin.register(CategoryType)
class CategoryTypeAdmin(admin.ModelAdmin):
    list_display = ["tag"]


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "number_of_positions", "category"]


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ["status", "user", "role"]

    list_filter = [
        "status",
    ]

    change_list_template = "admin/request_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path("export-checkin/", self.export_checkin),
        ]
        return my_urls + urls

    def export_checkin(self, request):
        if request.method == "POST":
            form = DailyCheckinForm(request.POST)
            # check whether it's valid:
            if form.is_valid():
                selected_date = form.cleaned_data["selected_date"]
                accepted_requests = Request.requests.select_related(
                    "user", "role__category"
                ).filter(
                    role__category__start_time__date=selected_date, status="ACCEPTED"
                )
                if len(accepted_requests) != 0:

                    field_names = [
                        "last_name",
                        "first_name",
                        "start_time",
                        "end_time",
                        "role",
                        "signature",
                    ]

                    response = HttpResponse(content_type="text/csv")
                    response[
                        "Content-Disposition"
                    ] = "attachment; filename=daily-checkin-{}.csv".format(
                        selected_date
                    )
                    writer = csv.writer(response)

                    writer.writerow(field_names)
                    for r in accepted_requests.order_by("user__last_name"):
                        user = r.user
                        role = r.role.category
                        row = writer.writerow(
                            [
                                user.last_name,
                                user.first_name,
                                role.start_time.astimezone(timezone(TIME_ZONE)).time(),
                                role.end_time.astimezone(timezone(TIME_ZONE)).time(),
                                role.title,
                                "   ",
                            ]
                        )

                    return response
                else:
                    messages.error(request, "No shifts for selected date")
                    storage = messages.get_messages(request)
                    storage.used = True
                    return redirect("..")

        form = DailyCheckinForm()
        payload = {"form": form}
        return render(request, "admin/export_daily_checkin_form.html", payload)


class RoleInline(admin.TabularInline):
    model = Role


@admin.register(VolunteerCategory)
class VolunteerCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "start_time", "end_time", "category_type")

    list_filter = ["start_time", "category_type"]

    search_fields = ["title"]

    inlines = [RoleInline]

