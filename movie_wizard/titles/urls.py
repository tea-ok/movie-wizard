from django.urls import path
from . import views

urlpatterns = [
    path('all_titles', views.all_titles),
]