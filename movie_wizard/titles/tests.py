from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from titles.models import Title
from titles.serializers import TitleSerializer
from accounts.serializers import UserSerializer

class TitleTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            self.user = User.objects.get(username=user_data['username'])
            self.user.set_password(user_data['password'])
            self.user.save()
        else:
            raise Exception(serializer.errors)
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.title = Title.objects.create(
            title_type='Movie',
            primary_title='Test Title',
            original_title='Test Title',
            is_adult=False,
            start_year=2000,
            runtime_minutes=120,
            genres='Action,Adventure',
            average_review=2.5
        )
        self.title_url = '/api/titles/title'

    def test_get_title_with_valid_id(self):
        response = self.client.get(f"{self.title_url}?id={self.title.id}")
        self.assertEqual(response.status_code, 200)
        serializer = TitleSerializer(self.title)
        self.assertEqual(response.data, serializer.data)

    def test_get_title_with_invalid_id(self):
        response = self.client.get(f"{self.title_url}?id=9999")
        self.assertEqual(response.status_code, 404)

    def test_get_title_without_id(self):
        response = self.client.get(self.title_url)
        self.assertEqual(response.status_code, 400)

    def test_get_title_without_authentication(self):
        self.client.logout()
        response = self.client.get(f"{self.title_url}?id={self.title.id}")
        self.assertEqual(response.status_code, 403)