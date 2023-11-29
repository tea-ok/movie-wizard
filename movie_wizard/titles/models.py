from django.db import models

# class Title(models.Model):
#     title_type = models.CharField(max_length=50)
#     primary_title = models.CharField(max_length=512)
#     original_title = models.CharField(max_length=512)
#     is_adult = models.BooleanField(default=False)
#     start_year = models.IntegerField(null=True, blank=True)
#     runtime_minutes = models.IntegerField(null=True, blank=True)
#     genres = models.CharField(max_length=255, null=True, blank=True)

#     def __str__(self):
#         return self.primary_title