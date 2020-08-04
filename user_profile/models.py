from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    over_eighteen = models.BooleanField(default=False)
    age = models.IntegerField()
    previous_volunteer = models.BooleanField(default=False)
    dietary_restrictions = models.TextField()
    medical_restrictions = models.TextField()
    special_interests = models.TextField()
    student_volunteer_hours = models.BooleanField(default=False)
    emergency_contact = models.TextField()
    comments = models.TextField()

    S = "S"
    M = "M"
    L = "L"
    XL = "XL"
    XXL = "XXL"
    XXXL = "XXXL"
    T_SHIRT_SIZES_CHOICES = (
        (S, "Small"),
        (M, "Medium"),
        (L, "Large"),
        (XL, "Extra Large"),
        (XXL, "Extra Extra Large"),
        (XXXL, "Extra Extra Extra Large"),
    )
    t_shirt_size = models.CharField(
        max_length=4, choices=T_SHIRT_SIZES_CHOICES, default=M,
    )
    users = models.Manager()
