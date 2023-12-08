import csv
from tqdm import tqdm
import os
import sys

# adding the project to the sys.path
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'movie_wizard'))
sys.path.append(project_path)

# Django settings 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_wizard.settings')
import django
django.setup()

from titles.models import Title

csv_file_path = '../data/data.csv'

with open(csv_file_path, 'r') as file:
    reader = csv.reader(file)
    next(reader)

    titles_to_create = [Title(title_type=row[0], primary_title=row[1], original_title=row[2], is_adult=row[3],
                              start_year=int(row[4]), runtime_minutes=int(row[5]), genres=row[6]) for row in reader]

    batch_size = 100000
    title_batches = [titles_to_create[i:i + batch_size] for i in range(0, len(titles_to_create), batch_size)]

    progress_bar = tqdm(total=len(titles_to_create), desc='Inserting Data', unit='row', dynamic_ncols=True)

    # bulk creating the data
    for batch in title_batches:
        Title.objects.bulk_create(batch)
        progress_bar.update(len(batch))

    progress_bar.close()
