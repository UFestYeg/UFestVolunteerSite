from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from user_profile.models import UserProfile
from volunteer_categories.models import Request

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
    inlines = (
        UserProfileInline,
        RequestInline,
    )


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
