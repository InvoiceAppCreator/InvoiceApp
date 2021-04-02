from django.contrib import admin
from .models import InvoiceList, QuoteList, User, Part
# Register your models here.

admin.site.register(InvoiceList)
admin.site.register(QuoteList)
admin.site.register(User)
admin.site.register(Part)
