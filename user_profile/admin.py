from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
import csv
from django.http import HttpResponse
from django.contrib.admin.models import LogEntry, CHANGE
from user_profile.models import UserProfile
from volunteer_categories.models import Request
from django.contrib.contenttypes.models import ContentType

# Register your models here.

# Define an inline admin descriptor for UserProfile model
# which acts a bit like a singleton
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "user profiles"


class RequestInline(admin.StackedInline):
    model = Request


# Define a new User admin
class UserAdmin(BaseUserAdmin):
    actions = ["export_emails_as_csv", "export_user_profiles_as_csv"]

    def get_export_row(self, obj, field_names):
        return [getattr(obj, field) for field in field_names]

    def export_emails_as_csv(self, request, queryset):
        meta = self.model._meta

        print(meta.fields)
        field_names = ["first_name", "last_name", "email"]

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename={}.csv".format(
            "user_emails"
        )
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset.order_by("last_name"):
            writer.writerow(self.get_export_row(obj, field_names))
        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(User).pk,
            object_id=request.user.pk,
            object_repr="User emails exported",
            action_flag=CHANGE,
            change_message="User emails exported",
        )
        return response

    export_emails_as_csv.short_description = "Export Selected Emails"

    def export_user_profiles_as_csv(self, request, queryset):
        meta = self.model._meta

        # queryset is users so get the profiles instead
        profile_queryset = UserProfile.profiles.filter(user__in=queryset)

        print(meta.fields)
        print(queryset)
        user_field_names = [
            "first_name",
            "last_name",
            "email",
        ]
        profile_field_names = [
            "over_eighteen",
            "age",
            "previous_volunteer",
            "dietary_restrictions",
            "medical_restrictions",
            "special_interests",
            "student_volunteer_hours",
            "emergency_contact",
            "comments",
            "t_shirt_size",
        ]

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename={}.csv".format(
            "user_profiles"
        )
        writer = csv.writer(response)

        writer.writerow([*user_field_names, *profile_field_names])
        for user_obj in queryset.order_by("last_name"):
            user_profile_obj = profile_queryset.get(pk=user_obj.id)
            writer.writerow(
                [
                    *self.get_export_row(user_obj, user_field_names),
                    *self.get_export_row(user_profile_obj, profile_field_names),
                ]
            )
        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(User).pk,
            object_id=request.user.pk,
            object_repr="User profiles exported",
            action_flag=CHANGE,
            change_message="User profiles exported",
        )
        return response

    export_user_profiles_as_csv.short_description = "Export Selected Profiles"

    inlines = (
        UserProfileInline,
        RequestInline,
    )


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
