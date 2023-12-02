from django.urls import path
from . import views

urlpatterns = [
    path('', views.paginated_titles),
    path('all_titles', views.all_titles),
    path('title/<int:id>', views.title)
]