from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login),
    path('register', views.register),
    path('test', views.test_token),
    path('logout', views.logout),
    path('dob', views.get_dob),
]