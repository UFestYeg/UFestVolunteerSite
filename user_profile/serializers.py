from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer
from .models import UserProfile
from volunteer_categories.api.serializers import RequestSerializer


class UserSerializer(UserDetailsSerializer):
    requests = RequestSerializer(many=True, read_only=True)

    over_eighteen = serializers.BooleanField(source="userprofile.over_eighteen")
    age = serializers.IntegerField(
        source="userprofile.age", allow_null=True, required=False
    )
    previous_volunteer = serializers.BooleanField(
        source="userprofile.previous_volunteer"
    )
    dietary_restrictions = serializers.CharField(
        source="userprofile.dietary_restrictions", allow_blank=True, required=False
    )
    medical_restrictions = serializers.CharField(
        source="userprofile.medical_restrictions", allow_blank=True, required=False
    )
    special_interests = serializers.CharField(
        source="userprofile.special_interests", allow_blank=True, required=False
    )
    dietary_restrictions = serializers.CharField(
        source="userprofile.dietary_restrictions", allow_blank=True, required=False
    )
    student_volunteer_hours = serializers.BooleanField(
        source="userprofile.student_volunteer_hours"
    )
    emergency_contact = serializers.CharField(
        source="userprofile.emergency_contact", allow_blank=True, required=False
    )
    comments = serializers.CharField(
        source="userprofile.comments", allow_blank=True, required=False
    )
    t_shirt_size = serializers.ChoiceField(
        choices=UserProfile.T_SHIRT_SIZES_CHOICES, source="userprofile.t_shirt_size"
    )

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + (
            "over_eighteen",
            "age",
            "previous_volunteer",
            "medical_restrictions",
            "special_interests",
            "dietary_restrictions",
            "student_volunteer_hours",
            "emergency_contact",
            "comments",
            "t_shirt_size",
            "requests",
        )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})
        over_eighteen = profile_data.get("over_eighteen")
        age = profile_data.get("age")
        previous_volunteer = profile_data.get("previous_volunteer")
        dietary_restrictions = profile_data.get("dietary_restrictions")
        medical_restrictions = profile_data.get("medical_restrictions")
        special_interests = profile_data.get("special_interests")
        student_volunteer_hours = profile_data.get("student_volunteer_hours")
        emergency_contact = profile_data.get("emergency_contact")
        comments = profile_data.get("comments")
        t_shirt_size = profile_data.get("t_shirt_size")

        instance = super(UserSerializer, self).update(instance, validated_data)

        # get and update user profile
        profile = instance.userprofile
        if profile_data:
            if over_eighteen is not None:
                profile.over_eighteen = over_eighteen
            if age:
                profile.age = age
            if previous_volunteer is not None:
                profile.previous_volunteer = previous_volunteer
            if dietary_restrictions is not None:
                profile.dietary_restrictions = dietary_restrictions
            if medical_restrictions is not None:
                profile.medical_restrictions = medical_restrictions
            if special_interests is not None:
                profile.special_interests = special_interests
            if student_volunteer_hours is not None:
                profile.student_volunteer_hours = student_volunteer_hours
            if emergency_contact is not None:
                profile.emergency_contact = emergency_contact
            if t_shirt_size:
                profile.t_shirt_size = t_shirt_size
            if comments is not None:
                profile.comments = comments
            profile.save()
        return instance
