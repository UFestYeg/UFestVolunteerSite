from django.contrib import admin
from .models import VolunteerCategory, Request, CategoryType, Role

# Register your models here.
@admin.register(CategoryType)
class CategoryTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    pass


@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ["status", "user", "role"]

    list_filter = [
        "status",
    ]


class RoleInline(admin.TabularInline):
    model = Role


@admin.register(VolunteerCategory)
class VolunteerCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "start_time", "end_time", "category_type")

    list_filter = ["start_time", "category_type"]

    search_fields = ["title"]

    inlines = [RoleInline]
