from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework import status

class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/accounts/register'

    def tearDown(self):
        try:
            user = User.objects.get(username='testuser56')
            user.delete()
        except User.DoesNotExist:
            pass

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
        User.objects.create_user(username='existinguser', password='testpassword123', email='testuser@example.com')
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

class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/accounts/login'
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='testuser@example.com',
            first_name='testuser',
            last_name='testuser',
        )
        UserProfile.objects.create(user=self.user, date_of_birth='1990-01-01')

    def tearDown(self):
        self.user.delete()
        self.user.userprofile.delete()

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