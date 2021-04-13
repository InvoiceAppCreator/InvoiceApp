from django.core.management.base import BaseCommand
from api.models import EmailInfo
import time as t
from email.message import EmailMessage
import datetime
import smtplib
import os

class Command(BaseCommand):
	def handle(self, *args, **options):
		CURR_DIR = os.getcwd()
		emailInfo = 'xxx'
		password = 'xxx'
		while True:
			allEmails = EmailInfo.objects.all()
			for email in allEmails:
				contactsArray = []
				contacts = email.recipients.split(' ')
				for contact in contacts:
					contactsArray.append(contact)

				msg = EmailMessage()
				msg['Subject'] = email.subject
				msg['From'] = emailInfo
				msg['To'] = contactsArray
				msg.set_content(email.message)

				with open(str(CURR_DIR) + str(email.PDF), 'rb') as f:
					file_data = f.read()
					file_name = email.fileName
					msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)

				dateData = email.date

				dateSplit = dateData.split(' ')

				date = dateSplit[0].split('/')
				time = dateSplit[1].split(':')
				am_or_pm = dateSplit[2]

				setTime = f'{date[0]}/{date[1]}/{date[2]} {time[0]}:{time[1]} {am_or_pm}'
				print(setTime)
				x = datetime.datetime.now()

				currentTime = f'{x.strftime("%d")}/{x.strftime("%m")}/{x.strftime("%Y")} {x.strftime("%I")}:{x.strftime("%M")} {x.strftime("%p")}'
				print(currentTime)
				if currentTime == setTime:
					with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
						smtp.login(emailInfo, password)
						smtp.send_message(msg)
						email.delete()

				t.sleep(0.5)
