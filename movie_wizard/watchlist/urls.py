from django.urls import path
from .views import watchlist, add_to_watchlist, remove_from_watchlist

urlpatterns = [
    path('', watchlist, name='watchlist'),
    path('add', add_to_watchlist, name='add-to-watchlist'),
    path('remove', remove_from_watchlist, name='remove-from-watchlist'),
]