from django.db import models

class User(models.Model):
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=500)
    def __str__(self):
        return self.username

class InvoiceList(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    invoiceNumber = models.CharField(max_length=100)
    customer = models.CharField(max_length=100)
    createdDate = models.CharField(max_length=100)
    dueDate = models.CharField(max_length=100)
    totalDue = models.CharField(max_length=200)
    status = models.CharField(max_length=20)
    def __str__(self):
        return self.invoiceNumber

class QuoteList(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    quoteNumber = models.CharField(max_length=100)
    createdDate = models.CharField(max_length=100)
    expectedDate = models.CharField(max_length=100)
    customer = models.CharField(max_length=100)
    salesperson = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    total = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    def __str__(self):
        return self.quoteNumber

class Part(models.Model):
    partQuoteNumber = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    partModelNumber = models.CharField(max_length=100)
    partNumber = models.CharField(max_length=100)
    partDescription = models.CharField(max_length=100)
    partCost = models.CharField(max_length=100)
    partPrice = models.CharField(max_length=100)
    partQtyOnHand = models.CharField(max_length=100)
    partQtyCommitted = models.CharField(max_length=100)
    def __str__(self):
        return self.partModelNumber

class invoicePart(models.Model):
    partInvoiceNumber = models.CharField(max_length=100)
    itemCode = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)
    unitPrice = models.CharField(max_length=100)
    totalPrice = models.CharField(max_length=100)
    def __str__(self):
        return self.itemCode

class FileInformation(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    fileName = models.CharField(max_length=100)
    fileData = models.FileField(upload_to='excel/')
    def __str__(self):
        return self.fileName

class EmailInfo(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    PDF = models.FileField(upload_to='pdf/')
    recipients = models.CharField(max_length=100)
    message = models.CharField(max_length=500)
    now = models.BooleanField()
    later = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    fileName = models.CharField(max_length=100, default='')
    date = models.CharField(max_length=100, default='')
    def __str__(self):
        return self.fileName

class UserImages(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    profilePicture = models.ImageField(upload_to ='faces/', default='faces/default.png')
    backgroundPicture = models.ImageField(upload_to='background/', default='background/default.png')
    def __str__(self):
        return self.author.username
