from rest_framework import serializers
from .models import Review
from titles.models import Title

class ReviewSerializer(serializers.ModelSerializer):
    title = serializers.PrimaryKeyRelatedField(queryset=Title.objects.all(), required=True)
    rating = serializers.IntegerField(required=True)
    text = serializers.CharField(required=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'title', 'rating', 'text', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    # gets the user object from the review object
    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username}