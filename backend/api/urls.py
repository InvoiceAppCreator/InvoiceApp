from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', views.Users.as_view()),
    path('invoiceList/<username>', views.InvoiceLists),
    path('part-invoice/<username>', views.invoiceParts),
    path('quoteList/<username>', views.QuoteLists),
    path('parts/<username>', views.Parts),
    path('part-search/<username>', views.partSearch)
]
