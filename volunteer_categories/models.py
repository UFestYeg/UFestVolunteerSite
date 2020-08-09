from django.db import models
from django.db.models import F, Sum
from django.contrib.auth.models import User

# Create your models here.

# VOLUNTEER_CATEGORIES = (
#     (MARKETING, "Marketing"),
#     (VENDORS, "Vendors"),
#     (WORKSHOPS, "Workshops"),
#     (FINANCE, "Finance"),
#     (ENTERTAINMENT, "Entertainment"),
#     (SITE_TRAFFIC, "Site and Traffic"),
#     (VOLUNTEERS, "Volunteers"),
#     (KIDS, "Kids"),
#     (BEER_GARDENS, "Beer Gardens"),
#     (CAFE, "Cafe"),
# )
class CategoryType(models.Model):
    tag = models.CharField(verbose_name="Category tag", max_length=50)

    types = models.Manager()

    def __str__(self):
        return f"Category: {self.tag}"


class VolunteerCategory(models.Model):
    class Meta:
        verbose_name_plural = "volunteer categories"

    title = models.CharField(max_length=120)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    category_type = models.ForeignKey(
        CategoryType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="category_types",
    )

    categories = models.Manager()

    def __str__(self):
        return f"{self.title} {self.start_time}-{self.end_time}"


class Role(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    number_of_positions= models.IntegerField(default=1)

    category = models.ForeignKey(
        VolunteerCategory, on_delete=models.CASCADE, related_name="roles",
    )

    roles = models.Manager()

    def __str__(self):
        return f"Role {self.title}: {self.number_of_positions}"


class Request(models.Model):
    # category = models.ManyToManyField(VolunteerCategory, through="Role")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="requests")

    ACCEPTED = "ACCEPTED"
    DENIED = "DENIED"
    PENDING = "PENDING"
    UNAVAILABLE = "UNAVAILABLE"
    STATUS_VALUES = (
        (ACCEPTED, "Accepted"),
        (DENIED, "Denied"),
        (PENDING, "Pending"),
        (UNAVAILABLE, "Unavailable"),
    )
    status = models.CharField(max_length=11, choices=STATUS_VALUES, default=PENDING,)
    requests = models.Manager()

    def __str__(self):
        return f"{self.role.category.title}-{self.role.title}: {self.status}"
