from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserProfile
from accounts.serializers import UserSerializer
from rest_framework import status
from rest_framework.test import force_authenticate

class RegisterViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/accounts/register'

    def test_register_with_no_username(self):
        data = {
            'username': '',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_with_invalid_email(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'invalidemail',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_underage_user(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '2015-01-01' # 8 years old, must be at least 13
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_with_valid_data(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertTrue('Token' in response['Authorization'])

    def test_register_with_duplicate_email(self):
        existing_user = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '2000-07-01'
        }
        serializer = UserSerializer(data=existing_user)
        if serializer.is_valid():
            self.user = serializer.save()
        else:
            raise Exception(serializer.errors)

        data = {
            'username': 'testuser2',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

class LoginViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/accounts/login'
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '1990-01-01'
        }
        # note to self - replicate the /register endpoint when creating a user for a test
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            self.user = User.objects.get(username=user_data['username'])
            self.user.set_password(user_data['password'])
            self.user.save()
        else:
            raise Exception(serializer.errors)

    def test_login_with_valid_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('Token' in response['Authorization'])
        self.assertTrue('user' in response.content.decode('utf-8'))  # Decode response.content to a string

    def test_login_with_invalid_username(self):
        data = {
            'username': 'wrongusername',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_login_with_invalid_password(self):
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class LogoutViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.logout_url = '/api/accounts/logout'
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

    def test_logout_authenticated_user(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(user=self.user).exists())

    def test_logout_unauthenticated_user(self):
        self.client.credentials()  # remove the credentials
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)