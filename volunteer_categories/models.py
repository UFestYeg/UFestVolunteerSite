from django.db import models
from django.db.models import F, Sum, Count
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

    def __str__(self):
        return f"{self.title} {self.start_time} - {self.end_time}"

    title = models.CharField(max_length=120)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    category_type = models.ForeignKey(
        CategoryType,
        on_delete=models.PROTECT,
        null=True,
        blank=False,
        related_name="category_types",
    )
    categories = models.Manager()

    @property
    def number_of_positions(self):
        aggregate = self.roles.aggregate(number_of_positions=Sum("number_of_positions"))
        return aggregate["number_of_positions"]

    @property
    def number_of_open_positions(self):
        aggregate = self.roles.filter(requests__status=Request.ACCEPTED).aggregate(
            filled_positions=Count("requests")
        )

        if (
            self.number_of_positions is not None
            and aggregate["filled_positions"] is not None
        ):
            res = self.number_of_positions - aggregate["filled_positions"]
        else:
            res = None
        return res


class Role(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    number_of_positions = models.IntegerField(default=1)

    category = models.ForeignKey(
        VolunteerCategory, on_delete=models.CASCADE, related_name="roles",
    )

    roles = models.Manager()

    def __str__(self):
        return f"Role {self.title}: {self.category.start_time} - {self.category.end_time} #{self.number_of_positions}"

    @property
    def number_of_open_positions(self):
        return (
            self.number_of_positions
            - self.requests.filter(status=Request.ACCEPTED).count()
        )


class Request(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "role"], name="unique appversion")
        ]

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


class EventDate(models.Model):
    event_date = models.DateTimeField()

    dates = models.Manager()

    @property
    def label(self):
        return self.event_date.strftime("%A")

    def __str__(self):
        return f"Event Date: {self.event_date} - {self.label}"
