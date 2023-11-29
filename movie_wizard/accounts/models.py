from django.db import models
from django.contrib.auth.models import User

"""
Custom model with a one-to-one relationship with the User model.
Contains a date_of_birth field and an associated user field.
"""
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_birth = models.DateField()