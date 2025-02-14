# Generated by Django 5.1.5 on 2025-02-14 13:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifieds', '0002_remove_location_is_active_remove_location_latitude_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='locations', to=settings.AUTH_USER_MODEL),
        ),
    ]
