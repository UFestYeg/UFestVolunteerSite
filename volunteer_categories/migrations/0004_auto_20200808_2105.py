# Generated by Django 3.0.8 on 2020-08-09 03:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('volunteer_categories', '0003_auto_20200808_1221'),
    ]

    operations = [
        migrations.RenameField(
            model_name='role',
            old_name='number_of_slots',
            new_name='number_of_positions',
        ),
    ]