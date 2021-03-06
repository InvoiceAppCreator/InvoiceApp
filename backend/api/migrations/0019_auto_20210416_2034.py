# Generated by Django 3.1.7 on 2021-04-17 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20210416_1201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userimages',
            name='backgroundPicture',
            field=models.ImageField(default='background/default.png', upload_to='background/'),
        ),
        migrations.AlterField(
            model_name='userimages',
            name='profilePicture',
            field=models.ImageField(default='faces/default.png', upload_to='faces/'),
        ),
    ]
