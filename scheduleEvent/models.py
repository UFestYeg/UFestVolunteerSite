from django.db import models

# Create your models here.


class ScheduleEvent(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    number_of_slots = models.IntegerField()

    events = models.Manager()

    def __str__(self):
        return f"{self.title} {self.start_time}-{self.end_time}"
