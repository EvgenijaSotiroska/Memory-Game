from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.score}"

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)  
    date = models.DateField()
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    attendees = models.ManyToManyField(User, related_name='attending_events', blank=True)

    def __str__(self):
        return f"{self.date} - {self.title}"


class Score(models.Model):
    LEVEL_CHOICES = [
        (1, "Level 1"),
        (2, "Level 2"),
        (3, "Level 3"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.IntegerField(choices=LEVEL_CHOICES)
    points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.user.username} - Level {self.level} - {self.points} pts"
