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
    titles = Title.objects.all().order_by('primary_title') # ensures consistent pagination

    result_page = paginator.paginate_queryset(titles, request)
    serializer = TitleSerializer(result_page, many=True)

    return paginator.get_paginated_response(serializer.data)
