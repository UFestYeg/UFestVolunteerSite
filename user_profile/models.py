from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from allauth.account.models import EmailAddress

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    over_eighteen = models.BooleanField(default=False)
    age = models.IntegerField(blank=True, null=True)
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

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    profiles = models.Manager()


@receiver(post_save, sender=User, dispatch_uid="create_new_user_profile")
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.profiles.create(user=instance)
        if instance.is_superuser:
            EmailAddress.objects.create(
                user=instance, email=instance.email, primary=True, verified=True
            )


@receiver(post_save, sender=User, dispatch_uid="update_user_profile")
def save_user_profile(sender, instance, **kwargs):
    post_save.disconnect(save_user_profile, sender=User)
    instance.userprofile.save()
    post_save.connect(save_user_profile, sender=User)
