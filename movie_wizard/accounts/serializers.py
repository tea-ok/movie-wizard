from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from datetime import date, timedelta

class UserSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(source='userprofile.date_of_birth', required=True)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)

    class Meta(object):
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'date_of_birth']

    def validate_date_of_birth(self, value):
        today = date.today()
        if value > today - timedelta(days=13*365.25):
            raise serializers.ValidationError('You must be at least 13 years old to register.')
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('userprofile', None)
        user = User.objects.create(**validated_data)
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        return user