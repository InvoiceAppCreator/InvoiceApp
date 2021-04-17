from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('users/', views.Users),

    path('invoiceList/<username>/<token>', views.InvoiceLists),
    path('part-invoice/<username>/<token>', views.invoiceParts),
    path('uploadFileInvoice/<username>/<token>', views.uploadFileInvoice),
    path('invoicePDF/<username>/<token>', views.invoicePDF),

    path('quoteList/<username>/<token>', views.QuoteLists),
    path('parts/<username>/<token>', views.Parts),
    path('uploadFile/<username>/<token>', views.uploadFile),
    path('quotePDF/<username>/<token>', views.quotePDF),
    path('part-search/<username>/<token>', views.partSearch),

    path('userImages/<username>/<token>', views.imageHandling),
    path('email/<username>/<token>', views.emailPDF),

    path('updateUser/<username>/<token>', views.updateUser),
    path('updatePassword/<username>/<token>', views.updatePassword),
    path('updatePictures/<username>/<token>', views.updatePictures)
]
