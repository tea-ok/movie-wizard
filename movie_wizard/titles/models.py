from django.db import models
from django.db.models.signals import post_save, post_delete
from django.core.signals import request_finished
from django.dispatch import receiver
from django.db.models import Avg
from django.apps import apps

class Title(models.Model):
    title_type = models.CharField(max_length=50)
    primary_title = models.CharField(max_length=512)
    original_title = models.CharField(max_length=512)
    is_adult = models.BooleanField(default=False)
    start_year = models.IntegerField(null=True, blank=True)
    runtime_minutes = models.IntegerField(null=True, blank=True)
    genres = models.CharField(max_length=255, null=True, blank=True)
    average_review = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.primary_title

"""
The 'ready' function is connected to Django's 'request_finished' signal. This function is called after Django has finished
setting up the app registry and handling a request. Inside the 'ready' function, the 'Review' model is imported and
the 'update_average_review' function is connected to the 'post_save' and 'post_delete' signals for the 'Review' model. 
This ensures that the 'Review' model is imported and the signal handlers are connected after Django has finished setting up the app registry.

The 'update_average_review' function is a signal receiver that gets called after a Review object is saved or deleted. 
It calculates the average rating of all reviews for the title associated with the saved or deleted review. 
Then, it updates the 'average_review' field of the title with the calculated average rating.
"""

def ready(sender, **kwargs):
    from reviews.models import Review

    @receiver(post_save, sender=Review)
    @receiver(post_delete, sender=Review)
    def update_average_review(sender, instance, **kwargs):
        title = instance.title
        average_review = Review.objects.filter(title=title).aggregate(Avg('rating'))['rating__avg']
        title.average_review = average_review
        title.save()

request_finished.connect(ready)