from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ScheduleEvent(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    number_of_slots = models.IntegerField()
    MARKETING = "MARKETING"
    VENDORS = "VENDORS"
    VOLUNTEERS = "VOLUNTEERS"
    WORKSHOPS = "WORKSHOPS"
    FINANCE = "FINANCE"
    ENTERTAINMENT = "ENTERTAINMENT"
    SITE_TRAFFIC = "SITE AND TRAFFIC"
    KIDS = "KIDS"
    BEER_GARDENS = "BEER GARDENS"
    CAFE = "CAFE"
    VOLUNTEER_CATEGORIES = (
        (MARKETING, "Marketing"),
        (VENDORS, "Vendors"),
        (WORKSHOPS, "Workshops"),
        (FINANCE, "Finance"),
        (ENTERTAINMENT, "Entertainment"),
        (SITE_TRAFFIC, "Site and Traffic"),
        (VOLUNTEERS, "Volunteers"),
        (KIDS, "Kids"),
        (BEER_GARDENS, "Beer Gardens"),
        (CAFE, "Cafe"),
    )
    category = models.CharField(
        max_length=16, choices=VOLUNTEER_CATEGORIES, default=MARKETING,
    )
    events = models.Manager()

    def __str__(self):
        return f"{self.title} {self.start_time}-{self.end_time}"


class Request(models.Model):
    event = models.ForeignKey(ScheduleEvent, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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
    status = models.CharField(
        max_length=11, choices=STATUS_VALUES, default=PENDING,
    )
    requests = models.Manager()
