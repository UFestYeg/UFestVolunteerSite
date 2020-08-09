from rest_framework import serializers
from volunteer_categories.models import VolunteerCategory, Request, Role, CategoryType


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ("id", "tag")


class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = ("id", "title", "description", "number_of_slots", "category")
        depth = 1


class RequestSerializer(serializers.ModelSerializer):
    role = RoleSerializer(many=False, read_only=True)

    class Meta:
        model = Request
        fields = ("id", "user", "status", "role")


class VolunteerCategorySerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    category_type = CategoryTypeSerializer(read_only=True)

    class Meta:
        model = VolunteerCategory
        fields = ("id", "title", "start_time",
                  "end_time", "category_type", "roles")
