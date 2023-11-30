from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
from django.http import HttpResponse
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils import timezone

from django.shortcuts import get_object_or_404
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        
        response = HttpResponse()
        response['Content-Type'] = 'application/json'
        response['Authorization'] = f'Token {token.key}'
        response.content = json.dumps({'user': serializer.data})
        response.status_code = 201

        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'error': 'Incorrect password'}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)

    user.last_login = timezone.now()
    user.save()

    response = HttpResponse()
    response['Content-Type'] = 'application/json'
    response['Authorization'] = f'Token {token.key}'
    response.content = json.dumps({'user': serializer.data})
    response.status_code = 200

    return response

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)