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

    actions = ["export_daily_checkin_as_csv"]

    def export_daily_checkin_as_csv(self, request, queryset):
        meta = self.model._meta

        print(meta)
        field_names = ["first_name", "last_name", "email"]

        # response = HttpResponse(content_type="text/csv")
        # response["Content-Disposition"] = "attachment; filename={}.csv".format(
        #     "user_emails"
        # )
        # writer = csv.writer(response)

        # writer.writerow(field_names)
        # for obj in queryset.order_by("last_name"):
        #     row = writer.writerow([getattr(obj, field) for field in field_names])

        # return response

    export_daily_checkin_as_csv.short_description = "Export Daily Checkin"


class RoleInline(admin.TabularInline):
    model = Role


@admin.register(VolunteerCategory)
class VolunteerCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "start_time", "end_time", "category_type")

    list_filter = ["start_time", "category_type"]

    search_fields = ["title"]

    inlines = [RoleInline]

