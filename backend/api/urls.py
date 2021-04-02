from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', views.Users.as_view()),
    path('invoiceList/', views.InvoiceLists.as_view()),
    path('quoteList/<username>', views.QuoteLists),
    path('parts/', views.Parts)
]
