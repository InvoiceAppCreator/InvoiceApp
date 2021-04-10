from django.contrib import admin
from .models import InvoiceList, QuoteList, User, Part, invoicePart, FileInformation
# Register your models here.

admin.site.register(InvoiceList)
admin.site.register(QuoteList)
admin.site.register(User)
admin.site.register(Part)
admin.site.register(invoicePart)
admin.site.register(FileInformation)
