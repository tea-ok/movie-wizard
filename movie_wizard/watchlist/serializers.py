from rest_framework import serializers
from .models import Watchlist
from titles.serializers import TitleSerializer
from titles.models import Title

class WatchlistSerializer(serializers.ModelSerializer):
    title_details = TitleSerializer(source='title', read_only=True)

    class Meta:
        model = Watchlist
        fields = ['id', 'title_details']
