from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from .models import Watchlist
from titles.models import Title
from django.contrib.auth.models import User
from accounts.serializers import UserSerializer
from .serializers import WatchlistSerializer

class GetWatchlist(APITestCase):
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

        self.watchlist_item = Watchlist.objects.create(
            user=self.user,
            title=self.title
        )

        self.watchlist_url = '/api/watchlist/'

    def test_get_watchlist_when_logged_in(self):
        response = self.client.get(f'{self.watchlist_url}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        expected_data = WatchlistSerializer(self.watchlist_item).data
        self.assertEqual(response.data[0], expected_data)

    def test_get_watchlist_when_not_logged_in(self):
        self.client.logout()
        response = self.client.get(f'{self.watchlist_url}')
        self.assertEqual(response.status_code, 403)

    def test_get_empty_watchlist(self):
        Watchlist.objects.all().delete()
        response = self.client.get(f"{self.watchlist_url}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_get_watchlist_with_multiple_items(self):
        title_2 = Title.objects.create(
            title_type='Movie',
            primary_title='Test Title',
            original_title='Test Title',
            is_adult=False,
            start_year=2000,
            runtime_minutes=120,
            genres='Action,Adventure',
            average_review=2.5
        )
        Watchlist.objects.create(user=self.user, title=title_2)
        response = self.client.get(f"{self.watchlist_url}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

class AddToWatchlist(APITestCase):
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
        )

        self.watchlist_url = '/api/watchlist/add'

    def test_add_to_watchlist(self):
        response = self.client.post(f'{self.watchlist_url}?title_id={self.title.id}')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Watchlist.objects.filter(user=self.user, title=self.title).exists())

    def test_add_to_watchlist_already_exists(self):
        Watchlist.objects.create(user=self.user, title=self.title)
        response = self.client.post(f'{self.watchlist_url}?title_id={self.title.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Watchlist.objects.filter(user=self.user, title=self.title).count(), 1)

    def test_add_to_watchlist_title_does_not_exist(self):
        response = self.client.post(f'{self.watchlist_url}?title_id=9999')
        self.assertEqual(response.status_code, 404)

    def test_add_to_watchlist_not_authenticated(self):
        self.client.logout()
        response = self.client.post(f'{self.watchlist_url}?title_id={self.title.id}')
        self.assertEqual(response.status_code, 403)

class DeleteFromWatchlist(APITestCase):
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
        )

        self.watchlist_item = Watchlist.objects.create(
            user=self.user,
            title=self.title
        )

        self.watchlist_url = '/api/watchlist/remove'

    def test_remove_from_watchlist(self):
        response = self.client.delete(f'{self.watchlist_url}?id={self.watchlist_item.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Watchlist.objects.filter(user=self.user, title=self.title).exists())

    def test_remove_from_watchlist_not_exists(self):
        response = self.client.delete(f'{self.watchlist_url}?id=9999')
        self.assertEqual(response.status_code, 404)

    def test_remove_from_watchlist_not_authenticated(self):
        self.client.logout()
        response = self.client.delete(f'{self.watchlist_url}?id={self.watchlist_item.id}')
        self.assertEqual(response.status_code, 403)

    def test_remove_from_watchlist_not_owned(self):
        user_data = {
            'username': 'otheruser',
            'password': 'testpassword123',
            'email': 'otheruser@example.com',
            'first_name': 'otheruser',
            'last_name': 'otheruser',
            'date_of_birth': '2000-01-01'
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            other_user = User.objects.get(username=user_data['username'])
            other_user.set_password(user_data['password'])
            other_user.save()
        else:
            raise Exception(serializer.errors)
        
        watchlist_item = Watchlist.objects.create(user=other_user, title=self.title)
        response = self.client.delete(f'{self.watchlist_url}?id={watchlist_item.id}')
        self.assertEqual(response.status_code, 404)
