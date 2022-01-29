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
    (datetime.date(2022, 5, 25), "Wednesday"),
    (datetime.date(2022, 5, 26), "Thursday"),
    (datetime.date(2022, 5, 27), "Friday"),
    (datetime.date(2022, 5, 28), "Saturday"),
    (datetime.date(2022, 5, 29), "Sunday"),
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
        def filter_roles_for_day(year, month, day):
            return Role.roles.filter(
                category__start_time__date=datetime.date(year, month, day),
            ).order_by("category__category_type", "title")

        def time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=25,
            start_hour=8,
            start_minute=0,
            end_year=2022,
            end_month=5,
            end_day=26,
            end_hour=0,
            end_minute=0,
        ):
            return [
                dt.time()
                for dt in datetime_range(
                    datetime.datetime(
                        year=start_year,
                        month=start_month,
                        day=start_day,
                        hour=start_hour,
                        minute=start_minute,
                    ).astimezone(timezone(TIME_ZONE)),
                    datetime.datetime(
                        year=end_year,
                        month=end_month,
                        day=end_day,
                        hour=end_hour,
                        minute=end_minute,
                    ).astimezone(timezone(TIME_ZONE)),
                    datetime.timedelta(minutes=30),
                )
            ]

        def round_time_to_nearest(t, nearest):
            return t - datetime.timedelta(minutes=t.minute % nearest, seconds=t.second,)

        def write_day_schedule_to_csv(csv_writer, day_roles, day_heading):
            for r in day_roles:
                number_of_positions = r.number_of_positions
                accepted_requests = r.requests.filter(status=Request.ACCEPTED)
                volunteers = [
                    "{} {}".format(ar.user.first_name, ar.user.last_name)
                    for ar in accepted_requests
                ]
                volunteers.extend(["X"] * r.number_of_open_positions)
                for i in range(number_of_positions):
                    row = [r.category.category_type.tag, r.title]
                    row.extend([""] * len(wednesday_times))
                    start = r.category.start_time.astimezone(timezone(TIME_ZONE))
                    end = r.category.end_time.astimezone(timezone(TIME_ZONE))
                    start = round_time_to_nearest(start, 30)
                    end = round_time_to_nearest(end, 30)
                    dts = [
                        dt.time()
                        for dt in datetime_range(
                            start, end, datetime.timedelta(minutes=30),
                        )
                    ]
                    for dt in dts:
                        try:
                            row[day_heading.index(dt)] = volunteers[i]
                        except:
                            print("invalid date")
                    csv_writer.writerow(row)

        wednesday_roles = filter_roles_for_day(2022, 5, 25)
        thursday_roles = filter_roles_for_day(2022, 5, 26)
        friday_roles = filter_roles_for_day(2022, 5, 27)
        saturday_roles = filter_roles_for_day(2022, 5, 28)
        sunday_roles = filter_roles_for_day(2022, 5, 29)

        wednesday_times = time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=25,
            start_hour=8,
            start_minute=0,
            end_year=2022,
            end_month=5,
            end_day=26,
            end_hour=0,
            end_minute=0,
        )
        thursday_times = time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=26,
            start_hour=8,
            start_minute=0,
            end_year=2022,
            end_month=5,
            end_day=27,
            end_hour=0,
            end_minute=0,
        )
        friday_times = time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=27,
            start_hour=8,
            start_minute=0,
            end_year=2022,
            end_month=5,
            end_day=28,
            end_hour=0,
            end_minute=0,
        )
        saturday_times = time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=28,
            start_hour=7,
            start_minute=30,
            end_year=2022,
            end_month=5,
            end_day=29,
            end_hour=0,
            end_minute=0,
        )
        sunday_times = time_range_for_day(
            start_year=2022,
            start_month=5,
            start_day=29,
            start_hour=7,
            start_minute=30,
            end_year=2022,
            end_month=5,
            end_day=30,
            end_hour=0,
            end_minute=0,
        )

        wednesday_heading = ["", "time"]
        wednesday_heading.extend(wednesday_times)
        thursday_heading = ["", "time"]
        thursday_heading.extend(thursday_times)
        friday_heading = ["", "time"]
        friday_heading.extend(friday_times)
        saturday_heading = ["", "time"]
        saturday_heading.extend(saturday_times)
        sunday_heading = ["", "time"]
        sunday_heading.extend(sunday_times)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=master-schedule.csv"
        writer = csv.writer(response)

        writer.writerow(["Wednesday"])
        writer.writerow(wednesday_heading)
        write_day_schedule_to_csv(writer, wednesday_roles, wednesday_heading)

        writer.writerow(["Thursday"])
        writer.writerow(thursday_heading)
        write_day_schedule_to_csv(writer, thursday_roles, thursday_heading)

        writer.writerow(["Friday"])
        writer.writerow(friday_heading)
        write_day_schedule_to_csv(writer, friday_roles, friday_heading)

        writer.writerow(["Saturday"])
        writer.writerow(saturday_heading)
        write_day_schedule_to_csv(writer, saturday_roles, saturday_heading)

        writer.writerow(["Sunday"])
        writer.writerow(sunday_heading)
        write_day_schedule_to_csv(writer, sunday_roles, sunday_heading)

        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(Role).pk,
            object_id=request.user.pk,
            object_repr="Master schedule exported",
            action_flag=CHANGE,
            change_message="Master schedule exported",
        )
        return response
