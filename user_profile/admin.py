from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
import csv
from django.http import HttpResponse

from user_profile.models import UserProfile

# Register your models here.

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = "user profiles"


# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
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

        return response

    export_emails_as_csv.short_description = "Export Selected"


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
