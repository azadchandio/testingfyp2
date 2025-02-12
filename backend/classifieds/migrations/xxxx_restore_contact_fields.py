from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('classifieds', '0002_alter_advertisement_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='advertisement',
            name='show_phone',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='contact_phone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='allow_offers',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='negotiable',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='model',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='advertisement',
            name='year',
            field=models.IntegerField(blank=True, null=True),
        ),
    ] 