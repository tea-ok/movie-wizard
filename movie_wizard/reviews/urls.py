from django.urls import path
from .views import create_review, get_reviews_for_title, update_review

urlpatterns = [
    path('create', create_review, name='create-review'),
    path('', get_reviews_for_title, name='get-reviews-for-title'),
    path('update', update_review, name='update-review'),
]