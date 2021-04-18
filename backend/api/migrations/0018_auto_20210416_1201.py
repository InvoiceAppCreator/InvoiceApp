# Generated by Django 3.1.7 on 2021-04-16 16:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20210416_1158'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='image',
        ),
        migrations.CreateModel(
            name='UserImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profilePicture', models.ImageField(default='faces/default.png', upload_to='faces/%Y/%m/%d/')),
                ('backgroundPicture', models.ImageField(default='background/default.png', upload_to='background/%Y/%m/%d/')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
    ]