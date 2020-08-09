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
        fields = ("id", "title", "description", "number_of_positions", "category")


class VolunteerCategorySerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    category_type = CategoryTypeSerializer()

    class Meta:
        model = VolunteerCategory
        fields = "__all__"

    def create(self, validated_data):
        category_type_validated_data = validated_data.pop("category_type")
        volunteer_category = VolunteerCategory.categories.create(**validated_data)

        category_type = CategoryType.types.get(
            tag=category_type_validated_data.get("tag")
        )

        volunteer_category.category_type = category_type

        volunteer_category.save()

        return volunteer_category

    def update(self, instance, validated_data):
        category_type_validated_data = validated_data.pop("category_type")

        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.start_time = validated_data.get("start_time", instance.start_time)
        instance.end_time = validated_data.get("end_time", instance.end_time)

        category_type = CategoryType.types.get(
            tag=category_type_validated_data.get("tag")
        )

        instance.category_type = category_type

        instance.save()

        return instance
