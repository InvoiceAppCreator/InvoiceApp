# Generated by Django 3.1.7 on 2021-04-18 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_auto_20210418_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tokenmake',
            name='createdDate',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='tokenmake',
            name='expiryDate',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='tokenmake',
            name='salt',
            field=models.CharField(default='', max_length=500),
        ),
    ]
