# Generated by Django 4.2.7 on 2023-11-28 23:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0002_delete_review'),
        ('watchlist', '0002_delete_watchlist'),
        ('titles', '0002_alter_title_original_title_alter_title_primary_title'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Title',
        ),
    ]
