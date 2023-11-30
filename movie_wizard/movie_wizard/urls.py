from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/titles/', include('titles.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/watchlist/', include('watchlist.urls')),
]
