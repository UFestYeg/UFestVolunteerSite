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
    actions = ["export_emails_as_csv"]

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
            row = writer.writerow([getattr(obj, field) for field in field_names])
        LogEntry.objects.log_action(
            user_id=request.user.pk,
            content_type_id=ContentType.objects.get_for_model(User).pk,
            object_id=request.user.pk,
            object_repr="User emails exported",
            action_flag=CHANGE,
            change_message="User emails exported",
        )
        return response

    export_emails_as_csv.short_description = "Export Selected"
    inlines = (
        UserProfileInline,
        RequestInline,
    )


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
