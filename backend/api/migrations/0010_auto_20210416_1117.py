# Generated by Django 3.1.7 on 2021-04-16 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20210416_1116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(upload_to='media/faces/%Y/%m/%d/'),
        ),
    ]
