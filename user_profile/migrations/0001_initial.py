# Generated by Django 3.0.8 on 2020-07-31 16:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('over_eighteen', models.BooleanField(default=False)),
                ('age', models.IntegerField()),
                ('previous_volunteer', models.BooleanField(default=False)),
                ('dietary_restrictions', models.TextField()),
                ('medical_restrictions', models.TextField()),
                ('special_interests', models.TextField()),
                ('student_volunteer_hours', models.BooleanField(default=False)),
                ('emergency_contact', models.TextField()),
                ('comments', models.TextField()),
                ('t_shirt_size', models.CharField(choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large'), ('XL', 'Extra Large'), ('XXL', 'Extra Extra Large'), ('XXXL', 'Extra Extra Extra Large')], default='M', max_length=4)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]