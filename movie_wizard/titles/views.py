from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Title
from .serializers import TitleSerializer
from rest_framework.pagination import PageNumberPagination

# test purposes, not used in production due to performance issues
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def all_titles(request):
    titles = Title.objects.all()
    serializer = TitleSerializer(titles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def paginated_titles(request):
    class LargeResultsSetPagination(PageNumberPagination):
        page_size = 25  # default page size
        page_size_query_param = 'page_size' # user can override the default

    paginator = LargeResultsSetPagination()
    titles = Title.objects.all()

    # filtering
    requested_genres = request.GET.get('genre', None)
    requested_title_type = request.GET.get('title_type', None)
    requested_start_year = request.GET.get('year', None)
    requested_primary_title = request.GET.get('primary_title', None)
    requested_runtime_minutes = request.GET.get('runtime_minutes', None)
    runtime_filter = request.GET.get('runtime_filter', None)  # 'above' or 'below'
    sort_by = request.GET.get('sort_by', 'pk')  # default to sorting by primary key
    sort_order = request.GET.get('sort_order', 'asc')  # default to ascending order

    if requested_genres:
        requested_genres = requested_genres.split(',')
        for genre in requested_genres:
            titles = titles.filter(genres__icontains=genre)
    if requested_title_type:
        titles = titles.filter(title_type__icontains=requested_title_type)
    if requested_start_year:
        titles = titles.filter(start_year=requested_start_year)
    if requested_primary_title:
        titles = titles.filter(primary_title__icontains=requested_primary_title)
    
    if requested_runtime_minutes and runtime_filter:
        if runtime_filter == 'above':
            titles = titles.filter(runtime_minutes__gt=requested_runtime_minutes)
        elif runtime_filter == 'below':
            titles = titles.filter(runtime_minutes__lt=requested_runtime_minutes)

    # sorting
    if sort_order == 'desc':
        sort_by = f"-{sort_by}"  # add '-' for descending order
    titles = titles.order_by(sort_by)

    result_page = paginator.paginate_queryset(titles, request)
    serializer = TitleSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)
