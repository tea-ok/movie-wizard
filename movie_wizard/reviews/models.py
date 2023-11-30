from django.db import models
from django.contrib.auth.models import User
from titles.models import Title

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.ForeignKey(Title, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s review for {self.title}"
