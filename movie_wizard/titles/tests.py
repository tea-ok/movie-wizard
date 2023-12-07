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

class PaginatedTitlesTest(APITestCase):
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

        # creating titles
        self.title1 = Title.objects.create(title_type='movie', primary_title='Apple Title 1', original_title='Title 1', is_adult=False, start_year=2000, runtime_minutes=120, genres='Action,Drama', average_review=2.5)
        self.title2 = Title.objects.create(title_type='tvMovie', primary_title='Mango Title 2', original_title='Title 2', is_adult=True, start_year=2005, runtime_minutes=90, genres='Comedy,Horror')
        self.title3 = Title.objects.create(title_type='tvSeries', primary_title='Apple Title 3', original_title='Title 3', is_adult=False, start_year=2010, runtime_minutes=150, genres='Adventure,Sci-Fi', average_review=4.5)
        self.title4 = Title.objects.create(title_type='tvEpisode', primary_title='Mango Title 4', original_title='Title 4', is_adult=True, start_year=2015, runtime_minutes=60, genres='Romance,Comedy')
        self.title5 = Title.objects.create(title_type='tvMiniSeries', primary_title='Apple Title 5', original_title='Title 5', is_adult=False, start_year=1998, runtime_minutes=180, genres='Action,Adventure', average_review=3.5)
        self.title6 = Title.objects.create(title_type='tvSpecial', primary_title='Mango Title 6', original_title='Title 6', is_adult=True, start_year=2000, runtime_minutes=30, genres='Drama,Horror', average_review=5)
        self.title7 = Title.objects.create(title_type='movie', primary_title='Apple Title 7', original_title='Title 7', is_adult=False, start_year=2005, runtime_minutes=90, genres='Sci-Fi,Comedy')
        self.title8 = Title.objects.create(title_type='tvMovie', primary_title='Mango Title 8', original_title='Title 8', is_adult=True, start_year=1980, runtime_minutes=45, genres='Romance,Adventure')
        self.title9 = Title.objects.create(title_type='tvSeries', primary_title='Apple Title 9', original_title='Title 9', is_adult=False, start_year=2015, runtime_minutes=200, genres='Action,Romance')
        self.title10 = Title.objects.create(title_type='tvEpisode', primary_title='Mango Title 10', original_title='Title 10', is_adult=True, start_year=2020, runtime_minutes=60, genres='Drama,Sci-Fi')
        
        self.titles_url = '/api/titles/'

    def test_get_titles(self):
        response = self.client.get(self.titles_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 10)

    def test_filter_by_title_type(self):
        response = self.client.get(f'{self.titles_url}?title_type=movie')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_filter_by_primary_title(self):
        response = self.client.get(f'{self.titles_url}?primary_title=Apple')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 5)

    def test_filter_by_primary_title_case_insensitive(self):
        response = self.client.get(f'{self.titles_url}?primary_title=apple')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 5)

    def test_filter_by_start_year(self):
        response = self.client.get(f'{self.titles_url}?year=2000')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 2)

    def test_filter_by_two_genres(self):
        response = self.client.get(f'{self.titles_url}?genre=Action,Drama')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_by_one_genre(self):
        response = self.client.get(f'{self.titles_url}?genre=Action')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 3)

    def test_filter_by_runtime_minutes_above(self):
        response = self.client.get(f'{self.titles_url}?runtime_minutes=120&runtime_filter=above')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 3)

    def test_filter_by_runtime_minutes_below(self):
        response = self.client.get(f'{self.titles_url}?runtime_minutes=120&runtime_filter=below')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 6) # one of the titles runtime_minutes=120 so it's excluded

    def test_sort_by_runtime_minutes_asc(self):
        response = self.client.get(f'{self.titles_url}?sort_by=runtime_minutes')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['runtime_minutes'], 30)

    def test_sort_by_runtime_minutes_desc(self):
        response = self.client.get(f'{self.titles_url}?sort_by=runtime_minutes&sort_order=desc')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['results'][0]['runtime_minutes'], 200)

    def test_underage_user_cannot_see_adult_titles(self):
        # log out the previous user
        self.client.logout()

        # new underage user + token
        user_data = {
            'username': 'underage_user',
            'password': 'password',
            'email': 'underage_user@example.com',
            'first_name': 'Underage',
            'last_name': 'User',
            'date_of_birth': '2010-01-01'  # Underage date of birth
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

        response = self.client.get(self.titles_url)
        self.assertEqual(response.status_code, 200)

        # check that no adult titles are returned
        for title in response.data['results']:
            self.assertFalse(title['is_adult'])

    def test_pagination(self):
        # create 30 more titles (40 total)
        for i in range(30):
            Title.objects.create(title_type='movie', primary_title=f'Title {i}', original_title=f'Title {i}', is_adult=False, start_year=2000+i, runtime_minutes=120, genres='Action,Drama')

        # request the first page
        response = self.client.get(self.titles_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 25)  # check the number of results on the first page

        # get the URL for the next page from the response data
        next_page_url = response.data['next']

        # request the second page
        response = self.client.get(next_page_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 15)  # check the number of results on the second page

        # check that there is no next page
        self.assertIsNone(response.data['next'])
