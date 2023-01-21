import copy
from django import forms
from django.contrib import admin, messages
from django.urls import path
from .models import EventDate, VolunteerCategory, Request, CategoryType, Role
from django.shortcuts import render, redirect
import datetime
from django.http import HttpResponse
import csv
from backend.settings import TIME_ZONE
from pytz import timezone
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType

_today = datetime.datetime.now()
datetime_one = datetime.datetime(_today.year, 5, 25, 8)
datetime_two = datetime.datetime(_today.year, 5, 26, 8)
datetime_three = datetime.datetime(_today.year, 5, 27, 8)
datetime_four = datetime.datetime(_today.year, 5, 28, 7, 30)
datetime_five = datetime.datetime(_today.year, 5, 29, 7, 30)


def tuple_to_date_and_name(date_tup: tuple):
    return (
        date_tup[1].astimezone(timezone(TIME_ZONE)),
        date_tup[1].strftime("%Y-%m-%d %A"),
    )


def date_and_name(date: datetime):
    return (date.astimezone(timezone(TIME_ZONE)), date.strftime("%Y-%m-%d %A"))


DEFAULT_DATES = [
    date_and_name(datetime_one),
    date_and_name(datetime_two),
    date_and_name(datetime_three),
    date_and_name(datetime_four),
    date_and_name(datetime_five),
]
# not eorking
def date_choies():
    return (
        list(map(tuple_to_date_and_name, EventDate.dates.values_list()))
        if EventDate.dates.exists()
        else DEFAULT_DATES
    )


def datetime_range(start, end, delta):
    current = start
    while current < end:
        yield current
        current += delta


class DailyCheckinForm(forms.Form):
    selected_date = forms.ChoiceField(choices=date_choies())


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
                    role__category__start_time__date=selected_date.split(" ")[0],
                    status="ACCEPTED",
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

    def copy_to_next_year_action(modeladmin, request, queryset):
        # do something with the queryset
        for volunteer_category in queryset:
            volunteer_category_copy = copy.copy(
                volunteer_category
            )  # (2) django copy object
            volunteer_category_copy.id = (
                None  # (3) set 'id' to None to create new object
            )
            volunteer_category_copy.start_time += datetime.timedelta(days=365)
            volunteer_category_copy.end_time += datetime.timedelta(days=365)
            volunteer_category_copy.save()  # initial save
            for role in volunteer_category.roles.all():
                role_copy = copy.copy(role)
                role_copy.id = None  # (3) set 'id' to None to create new object
                role_copy.save()
                volunteer_category_copy.roles.add(role_copy)
            volunteer_category_copy.save()  # initial save

    copy_to_next_year_action.short_description = "Copy selected to next year"

    actions = [
        copy_to_next_year_action,
    ]  # <--

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
                    row.extend([""] * (len(day_heading) - 2))
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
                            if dt in day_heading:
                                row[day_heading.index(dt)] = volunteers[i]
                            else:
                                print(f"Event not within event range {dt}")
                        except:
                            print(f"invalid date {day_heading.index(dt)}")
                    csv_writer.writerow(row)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=master-schedule.csv"
        writer = csv.writer(response)

        for event_tuple in date_choies():
            date, label = event_tuple
            date_roles = filter_roles_for_day(date.year, date.month, date.day)

            date_times = time_range_for_day(
                start_year=date.year,
                start_month=date.month,
                start_day=date.day,
                start_hour=date.hour,
                start_minute=date.minute,
                end_year=date.year,
                end_month=date.month,
                end_day=(date + datetime.timedelta(days=1)).day,
                end_hour=0,
                end_minute=0,
            )

            new_heading = ["", "time"]
            new_heading.extend(date_times)

            writer.writerow([label])
            writer.writerow(new_heading)
            write_day_schedule_to_csv(writer, date_roles, new_heading)

        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(Role).pk,
            object_id=request.user.pk,
            object_repr="Master schedule exported",
            action_flag=CHANGE,
            change_message="Master schedule exported",
        )
        return response


@admin.register(EventDate)
class EventDateAdmin(admin.ModelAdmin):
    list_display = ("event_date",)
