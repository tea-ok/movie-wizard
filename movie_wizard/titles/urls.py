from django.urls import path
from . import views

urlpatterns = [
    path('', views.paginated_titles),
    path('title', views.title)
]