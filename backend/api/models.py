from django.db import models


class User(models.Model):
    firstName = models.CharField(max_length=20)
    lastName = models.CharField(max_length=20)
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=500)
    #image = models.ImageField() -- learn about that
    def __str__(self):
        return self.username

class InvoiceList(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    invoiceNumber = models.CharField(max_length=10)
    customer = models.CharField(max_length=30)
    createdDate = models.CharField(max_length=15)
    dueDate = models.CharField(max_length=15)
    totalDue = models.CharField(max_length=15)
    status = models.BooleanField()
    def __str__(self):
        return self.invoiceNumber


class QuoteList(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    quoteNumber = models.CharField(max_length=10)
    createdDate = models.CharField(max_length=15)
    expectedDate = models.CharField(max_length=15)
    customer = models.CharField(max_length=30)
    salesperson = models.CharField(max_length=30)
    company = models.CharField(max_length=30)
    total = models.CharField(max_length=15)
    status = models.BooleanField()
    def __str__(self):
        return self.quoteNumber

# Quote NUmber as well to link the parts to the quotelist, groupcode list the parts with each other
class Part(models.Model):
    partQuoteNumber = models.CharField(max_length=10)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    partGroupCode = models.CharField(max_length=20)
    partModelNumber = models.CharField(max_length=30)
    partNumber = models.CharField(max_length=20)
    partDescription = models.CharField(max_length=100)
    partCost = models.CharField(max_length=20)
    partPrice = models.CharField(max_length=20)
    partQtyOnHand = models.IntegerField()
    partQtyCommitted = models.IntegerField()
    def __str__(self):
        return self.partModelNumber
