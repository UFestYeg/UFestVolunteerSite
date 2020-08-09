from rest_framework import serializers
from volunteer_categories.models import VolunteerCategory, Request, Role, CategoryType


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = ("id", "user", "status")


class CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ("id", "tag")


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ("id", "title", "description", "number_of_slots", "category")


class VolunteerCategorySerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    category_type = CategoryTypeSerializer(read_only=True)

    class Meta:
        model = VolunteerCategory
        fields = ("id", "title", "start_time", "end_time", "category_type", "roles")
