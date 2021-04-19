from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', views.Users),

    path('invoiceList/<username>', views.InvoiceLists),
    path('part-invoice/<username>', views.invoiceParts),
    path('uploadFileInvoice/<username>', views.uploadFileInvoice),
    path('invoicePDF/<username>', views.invoicePDF),

    path('quoteList/<username>', views.QuoteLists),
    path('parts/<username>', views.Parts),
    path('uploadFile/<username>', views.uploadFile),
    path('quotePDF/<username>', views.quotePDF),
    path('part-search/<username>', views.partSearch),

    path('userImages/<username>', views.imageHandling),
    path('email/<username>', views.emailPDF),

    path('updateUser/<username>', views.updateUser),
    path('updatePassword/<username>', views.updatePassword),
    path('updatePictures/<username>', views.updatePictures),

    path('deleteToken/<username>', views.deleteToken),

    path('tokenCheckActive/<username>', views.checkTokenActive)
]
