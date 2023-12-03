from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Watchlist
from .serializers import WatchlistSerializer
from titles.models import Title

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def watchlist(request):
    watchlist_items = Watchlist.objects.filter(user=request.user)
    serializer = WatchlistSerializer(watchlist_items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    title_id = request.query_params.get('title_id')
    title = get_object_or_404(Title, pk=title_id)
    watchlist_item, created = Watchlist.objects.get_or_create(user=request.user, title=title) # if already in watchist, return it, else create it
    serializer = WatchlistSerializer(watchlist_item)
    return Response(serializer.data, status=201 if created else 200)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request):
    watchlist_id = request.query_params.get('id')
    watchlist_item = get_object_or_404(Watchlist, pk=watchlist_id, user=request.user)
    watchlist_item.delete()
    return Response(status=204)
