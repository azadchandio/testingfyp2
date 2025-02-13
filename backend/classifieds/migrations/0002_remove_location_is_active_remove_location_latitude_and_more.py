# Generated by Django 5.1.5 on 2025-02-13 10:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifieds', '0001_remove_advertisement_message_count_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='location',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='location',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='location',
            name='longitude',
        ),
        migrations.AlterField(
            model_name='advertisement',
            name='location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='classifieds.location'),
        ),
    ]
