from django.db import models
from django.contrib.auth.models import User
from titles.models import Title

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.ForeignKey(Title, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}'s Watchlist"
