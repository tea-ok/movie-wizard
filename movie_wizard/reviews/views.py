from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Review
from titles.models import Title
from .serializers import ReviewSerializer
from datetime import date
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import status

def age_check(user_profile, is_adult):
    user_date_of_birth = user_profile.date_of_birth if user_profile else None

    if user_date_of_birth:
        today = date.today()
        user_age = today.year - user_date_of_birth.year - ((today.month, today.day) < (user_date_of_birth.month, user_date_of_birth.day))

        if user_age and user_age < 18 and is_adult:
            return Response({'error': 'You must be 18+ to view adult content.'}, status=403)

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_review(request):
    title_id = request.data.get('title')
    if not title_id:
        return Response({'error': 'Title ID is required.'}, status=400)
    title = get_object_or_404(Title, pk=title_id) # get_object_or_404 handles the case where the title does not exist

    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():
        user_profile = request.user.userprofile

        age_check_result = age_check(user_profile, title.is_adult)
        if age_check_result:
            return age_check_result

        serializer.save(user=request.user, title=title)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_reviews_for_title(request):
    title_id = request.query_params.get('title_id')
    if not title_id:
        return Response({'error': 'Title ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not title_id.isdigit():
        return Response({'error': 'Invalid title_id.'}, status=status.HTTP_400_BAD_REQUEST)

    title = get_object_or_404(Title, pk=title_id)
    user_profile = request.user.userprofile

    age_check_result = age_check(user_profile, title.is_adult)
    if age_check_result:
        return age_check_result

    reviews = Review.objects.filter(title=title)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_review(request):
    review_id = request.query_params.get('review_id')
    if not review_id:
        return Response({'error': 'Review ID is required.'}, status=400)
    if not review_id.isdigit():
        return Response({'error': 'Invalid review_id.'}, status=400)

    review = get_object_or_404(Review, pk=review_id)
    if review.user != request.user:
        return Response({'error': 'You do not have permission to update this review.'}, status=403)

    serializer = ReviewSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_review(request):
    review_id = request.query_params.get('review_id')
    if not review_id:
        return Response({'error': 'Review ID is required.'}, status=400)
    if not review_id.isdigit():
        return Response({'error': 'Invalid review_id.'}, status=400)

    review = get_object_or_404(Review, pk=review_id)
    if review.user != request.user:
        return Response({'error': 'You do not have permission to delete this review.'}, status=403)

    review.delete()
    return Response(status=204)