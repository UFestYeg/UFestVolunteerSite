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
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType

DATE_CHOICES = [
    (datetime.date(2021, 5, 19), "Wednesday"),
    (datetime.date(2021, 5, 20), "Thursday"),
    (datetime.date(2021, 5, 21), "Friday"),
    (datetime.date(2021, 5, 22), "Saturday"),
    (datetime.date(2021, 5, 23), "Sunday"),
]


def datetime_range(start, end, delta):
    current = start
    while current < end:
        yield current
        current += delta


class DailyCheckinForm(forms.Form):
    selected_date = forms.ChoiceField(choices=DATE_CHOICES)


# Register your models here.
@admin.register(CategoryType)
class CategoryTypeAdmin(admin.ModelAdmin):
    list_display = ["tag"]


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "description",
        "number_of_open_positions",
        "number_of_positions",
        "category",
    ]


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
                        "category",
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
                                r.role.title,
                                "   ",
                            ]
                        )
                    LogEntry.objects.log_action(
                        user_id=request.user.pk,
                        content_type_id=ContentType.objects.get_for_model(Request).pk,
                        object_id=request.user.pk,
                        object_repr="Daily Checkin for {} exported".format(
                            selected_date
                        ),
                        action_flag=CHANGE,
                        change_message="Daily Checkin for {} exported".format(
                            selected_date
                        ),
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
    list_display = (
        "title",
        "description",
        "start_time",
        "end_time",
        "category_type",
        "number_of_open_positions",
        "number_of_positions",
    )

    list_filter = ["start_time", "category_type"]

    search_fields = ["title"]

    inlines = [RoleInline]

    change_list_template = "admin/volunteer_category_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path("export-schedule/", self.export_schedule),
        ]
        return my_urls + urls

    def export_schedule(self, request):
        friday_requests = (
            Request.requests.select_related("user", "role__category")
            .filter(
                status="ACCEPTED",
                role__category__start_time__date=datetime.date(2021, 5, 21),
            )
            .order_by(
                "role__category__start_time",
                "role__title",
                "role__category__category_type",
            )
        )
        saturday_requests = (
            Request.requests.select_related("user", "role__category")
            .filter(
                status="ACCEPTED",
                role__category__start_time__date=datetime.date(2021, 5, 22),
            )
            .order_by(
                "role__category__start_time",
                "role__title",
                "role__category__category_type",
            )
        )

        headings = ["Friday", "Saturday"]
        friday_times = [
            dt
            for dt in datetime_range(
                datetime.datetime(year=2021, month=5, day=21, hour=8).astimezone(
                    timezone(TIME_ZONE)
                ),
                datetime.datetime(year=2021, month=5, day=22, hour=0).astimezone(
                    timezone(TIME_ZONE)
                ),
                datetime.timedelta(minutes=30),
            )
        ]
        saturday_times = [
            dt
            for dt in datetime_range(
                datetime.datetime(
                    year=2021, month=5, day=22, hour=7, minute=30
                ).astimezone(timezone(TIME_ZONE)),
                datetime.datetime(year=2021, month=5, day=23, hour=0).astimezone(
                    timezone(TIME_ZONE)
                ),
                datetime.timedelta(minutes=30),
            )
        ]
        columns1 = ["", "time"]
        columns1.extend(friday_times)
        columns2 = ["", "time"]
        columns2.extend(saturday_times)
        print(columns1)
        print(columns2)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=master-schedule.csv"
        writer = csv.writer(response)

        writer.writerow(["Friday"])
        writer.writerow(columns1)
        for r in friday_requests:

            user = r.user
            role = r.role
            row = [role.category.category_type.tag, role.title]
            row.extend([""] * len(friday_times))
            dts = [
                dt
                for dt in datetime_range(
                    role.category.start_time.astimezone(timezone(TIME_ZONE)),
                    role.category.end_time.astimezone(timezone(TIME_ZONE)),
                    datetime.timedelta(minutes=30),
                )
            ]
            for dt in dts:
                row[columns2.index(dt)] = "{} {}".format(
                    user.first_name, user.last_name
                )
            writer.writerow(row)

        writer.writerow(["Saturday"])
        writer.writerow(columns2)
        for r in saturday_requests:

            user = r.user
            role = r.role
            row = [role.category.category_type.tag, role.title]
            row.extend([""] * len(saturday_times))
            dts = [
                dt
                for dt in datetime_range(
                    role.category.start_time.astimezone(timezone(TIME_ZONE)),
                    role.category.end_time.astimezone(timezone(TIME_ZONE)),
                    datetime.timedelta(minutes=30),
                )
            ]
            for dt in dts:
                row[columns2.index(dt)] = "{} {}".format(
                    user.first_name, user.last_name
                )
            writer.writerow(row)

        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(Role).pk,
            object_id=request.user.pk,
            object_repr="Master schedule exported",
            action_flag=CHANGE,
            change_message="Master schedule exported",
        )
        return response

