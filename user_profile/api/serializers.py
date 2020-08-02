from rest_framework import serializers
from user_profile.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("user",
                  "over_eighteen",
                  "age",
                  "previous_volunteer",
                  "dietary_restrictions",
                  "medical_restrictions",
                  "special_interests",
                  "student_volunteer_hours",
                  "emergency_contact",
                  "comments")
