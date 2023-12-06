from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from reviews.models import Review
from titles.models import Title
from accounts.models import UserProfile
from accounts.serializers import UserSerializer

class CreateReviewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '2010-10-1' # 13-year-old user to test age restriction
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
            title_type='movie',
            primary_title='Test Title',
            original_title='Test Title',
            is_adult=False,
            start_year=2000,
            runtime_minutes=120,
            genres='Action,Adventure',
            average_review=2.5
        )
        self.create_review_url = '/api/reviews/create'

    def test_create_review_with_valid_data(self):
        data = {
            'title': self.title.id,
            'rating': 5,
            'text': 'Test Content'
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Review.objects.filter(user=self.user, title=self.title).exists())

    def test_create_review_with_invalid_title_id(self):
        data = {
            'title': 9999,
            'rating': 5,
            'text': 'Test Content'
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 404)

    def test_create_review_with_invalid_rating(self):
        data = {
            'title': self.title.id,
            'rating': 6,
            'text': 'Test Content'
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 400)

    def test_create_review_with_missing_text(self):
        data = {
            'title': self.title.id,
            'rating': 5,
            'text': ''
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 400)

    def test_create_review_without_authentication(self):
        self.client.logout()
        data = {
            'title': self.title.id,
            'rating': 5,
            'text': 'Test Content'
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 403)

    def test_create_review_with_age_restriction(self):
        self.title.is_adult = True
        self.title.save()
        data = {
            'title': self.title.id,
            'rating': 5,
            'text': 'Test Content'
        }
        response = self.client.post(self.create_review_url, data)
        self.assertEqual(response.status_code, 403)

class GetReviewsForTitleTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '2010-10-1', # 13-year-old user to test age restriction
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
        self.get_reviews_url = '/api/reviews/'

    def test_get_reviews_for_title_with_valid_title_id(self):
        Review.objects.create(user=self.user, title=self.title, rating=5, text='Test Content')
        response = self.client.get(f"{self.get_reviews_url}?title_id={self.title.id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_reviews_for_title_with_invalid_title_id(self):
        response = self.client.get(f"{self.get_reviews_url}?title_id=9999")
        self.assertEqual(response.status_code, 404)

    def test_get_reviews_for_title_without_title_id(self):
        response = self.client.get(self.get_reviews_url)
        self.assertEqual(response.status_code, 400)

    def test_get_reviews_for_title_without_authentication(self):
        self.client.logout()
        response = self.client.get(f"{self.get_reviews_url}?title_id={self.title.id}")
        self.assertEqual(response.status_code, 403)

    def test_get_reviews_for_title_with_age_restriction(self):
        self.title.is_adult = True
        self.title.save()
        response = self.client.get(f"{self.get_reviews_url}?title_id={self.title.id}")
        self.assertEqual(response.status_code, 403)  # Assuming age_check returns a 403 status code

class UpdateReviewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'testuser@example.com',
            'first_name': 'testuser',
            'last_name': 'testuser',
            'date_of_birth': '2010-10-1' # 13-year-old user to test age restriction
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
        self.review = Review.objects.create(user=self.user, title=self.title, rating=5, text='Test Content')
        self.update_review_url = '/api/reviews/update'

    def test_update_review_with_valid_data(self):
        data = {
            'rating': 4,
            'text': 'Updated Content'
        }
        response = self.client.put(f"{self.update_review_url}?review_id={self.review.id}", data)
        self.assertEqual(response.status_code, 200)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 4)
        self.assertEqual(self.review.text, 'Updated Content')

    def test_update_review_with_invalid_review_id(self):
        data = {
            'rating': 4,
            'text': 'Updated Content'
        }
        response = self.client.put(f"{self.update_review_url}?review_id=9999", data)
        self.assertEqual(response.status_code, 404)

    def test_update_review_without_review_id(self):
        data = {
            'rating': 4,
            'text': 'Updated Content'
        }
        response = self.client.put(self.update_review_url, data)
        self.assertEqual(response.status_code, 400)

    def test_update_review_without_authentication(self):
        self.client.logout()
        data = {
            'rating': 4,
            'text': 'Updated Content'
        }
        response = self.client.put(f"{self.update_review_url}?review_id={self.review.id}", data)
        self.assertEqual(response.status_code, 403)

    def test_update_review_without_permission(self):
        user_data = {
            'username': 'otheruser',
            'password': 'otherpassword123',
            'email': 'otheruser@example.com',
            'first_name': 'other',
            'last_name': 'testuser',
            'date_of_birth': '1999-02-09',
        }
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            otheruser = User.objects.get(username=user_data['username'])
            otheruser.set_password(user_data['password'])
            otheruser.save()
        else:
            raise Exception(serializer.errors)
        
        other_review = Review.objects.create(user=otheruser, title=self.title, rating=3, text="Other user's review")

        data = {
            'rating': 4,
            'text': 'Updated Content'
        }
        response = self.client.put(f"{self.update_review_url}?review_id={other_review.id}", data)
        self.assertEqual(response.status_code, 403)