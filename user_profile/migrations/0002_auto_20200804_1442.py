# Generated by Django 3.0.8 on 2020-08-04 20:42

from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='userprofile',
            managers=[
                ('profiles', django.db.models.manager.Manager()),
            ],
        ),
    ]