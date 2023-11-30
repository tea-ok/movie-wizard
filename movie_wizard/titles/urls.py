from django.urls import path
from . import views

urlpatterns = [
    path('all_titles', views.all_titles),
    path('paginated_titles', views.paginated_titles),
]