from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, InvoiceListSerializer, QuoteListSerializer, PartSerializer, invoicePartSerializer
from .models import User, InvoiceList, QuoteList, Part, invoicePart
from rest_framework.decorators import api_view

# Create your views here.
class Users(APIView):
    def get_query(self):
        userData = User.objects.all()
        return userData
    def get(self, request):
        userData = self.get_query()
        serializer = UserSerializer(userData, many=True)
        return Response(serializer.data)
    def post(self, request):
        try:
            userData = request.data
            if userData['login'] == True:
                loginData = User.objects.get(username=userData['username'])
                usernameCheck = loginData.username
                passwordCheck = loginData.password

                if usernameCheck == userData['username'] and passwordCheck == userData['password']:
                    return Response({'message':'Success'})
                else:
                    return Response({'message':'Wrong'})

            elif userData['login'] == False:
                addedData = User.objects.create(firstName=userData['firstName'],
                                            lastName=userData['lastName'],
                                            username=userData['username'],
                                            email=userData['email'],
                                            password=userData['password'])
                addedData.save()
                serializer = UserSerializer(addedData)
                return Response(serializer.data)
        except:
            return Response({'message':'Wrong'})

@api_view(['GET', 'POST'])
def InvoiceLists(request, username):
    invoiceList = InvoiceList.objects.all()
    serializer = InvoiceListSerializer(invoiceList, many=True)
    if request.method == 'GET':
        user = User.objects.get(username=username)
        userID = user.id
        authInvoiceList = InvoiceList.objects.filter(author=userID)
        serialize = InvoiceListSerializer(authInvoiceList, many=True)
        return Response(serialize.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=data['author'])
        addedData = InvoiceList.objects.create(
            author=author,
            invoiceNumber=data['invoiceNumber'],
            customer=data['customer'],
            createdDate=data['createdDate'],
            dueDate=data['dueDate'],
            totalDue=data['totalDue'],
            status=data['status']
        )
        serializer = InvoiceListSerializer(invoiceList, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def QuoteLists(request, username):
    quoteList = QuoteList.objects.all()
    serializer = QuoteListSerializer(quoteList, many=True)
    if request.method == 'GET':
        user = User.objects.get(username=username)
        userID = user.id
        authQuoteList = QuoteList.objects.filter(author=userID)
        serialize = QuoteListSerializer(authQuoteList, many=True)
        return Response(serialize.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=data['author'])
        addedData = QuoteList.objects.create(
            author=author,
            quoteNumber=data['quoteNumber'],
            customer=data['customers'],
            total=data['total'],
            createdDate=data['createdDate'],
            salesperson=data['salesperson'],
            expectedDate=data['expectedDate'],
            company=data['company'],
            status=data['status']
        )
        serializer = QuoteListSerializer(quoteList, many=True)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        for quoteNumber in request.data:
            filteredData = QuoteList.objects.filter(author=userID, quoteNumber=quoteNumber).delete()
        return Response(request.data)
    elif request.method == 'PUT':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id

        quoteData = QuoteList.objects.get(author=userID, id=data['quoteNumberOriginal'])
        quoteData.quoteNumber = data['quoteNumber']
        quoteData.createdDate = data['createdDate']
        quoteData.expectedDate = data['expectedDate']
        quoteData.customer = data['customer']
        quoteData.salesperson = data['salesperson']
        quoteData.company = data['company']
        quoteData.total = data['total']
        quoteData.status = data['status']
        quoteData.save()

        return Response(request.data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def Parts(request, username):
    partList = Part.objects.all()
    serializer = PartSerializer(partList, many=True)
    if request.method == 'GET':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        partList = Part.objects.filter(author=userID)
        serializer = PartSerializer(partList, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=data['author'])
        addedData = Part.objects.create(
            author=author,
            partQuoteNumber=data['partQuoteNumber'],
            partModelNumber=data['partModelNumber'],
            partNumber=data['partNumber'],
            partDescription=data['partDescription'],
            partCost=data['partCost'],
            partPrice=data['partPrice'],
            partQtyOnHand=data['partQtyOnHand'],
            partQtyCommitted=data['partQtyCommitted']
        )
        addedData.save()
        serializer = PartSerializer(partList, many=True)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        if request.data[1] =='allDelete':
            for idNumber in request.data[0]:
                filteredData = Part.objects.filter(author=userID, id=idNumber).delete()
            return Response({'allDelete':request.data})
        elif request.data[1] == 'notDelete':
            for modelNumber in request.data[0]:
                filteredData = Part.objects.filter(author=userID, partModelNumber=modelNumber).delete()
            return Response({'notAllDelete':request.data})

    elif request.method == 'PUT':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        try:
            partData = Part.objects.get(author=userID, id=data['quoteNumberOriginal'])
            partData.partQuoteNumber = data['partQuoteNumber']
            partData.partModelNumber = data['partModelNumber']
            partData.partNumber = data['partNumber']
            partData.partDescription = data['partDescription']
            partData.partCost = data['partCost']
            partData.partPrice = data['partPrice']
            partData.partQtyOnHand = data['partQtyOnHand']
            partData.partQtyCommitted = data['partQtyCommitted']
            partData.save()
            return Response(request.data)
        except:
            author = User.objects.get(username=data['author'])
            partData = Part.objects.create(
                author=author,
                partQuoteNumber=data['partQuoteNumber'],
                partModelNumber=data['partModelNumber'],
                partNumber=data['partNumber'],
                partDescription=data['partDescription'],
                partCost=data['partCost'],
                partPrice=data['partPrice'],
                partQtyOnHand=data['partQtyOnHand'],
                partQtyCommitted=data['partQtyCommitted']
            )
            partData.save()
            serializer = PartSerializer(partList, many=True)
            return Response(serializer.data)


@api_view(['GET'])
def partSearch(request, username):
    if request.method == 'GET':
        user = User.objects.get(username=username)
        userID = user.id
        data = QuoteList.objects.filter(author=userID)
        serializer = QuoteListSerializer(data, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
def invoiceParts(request, username):
    invoicePartsList = invoicePart.objects.all()
    serializer = invoicePartSerializer(invoicePartsList, many=True)
    if request.method == 'GET':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        invoicePartsList = invoicePart.objects.filter(author=userID)
        serializer = invoicePartSerializer(invoicePartsList, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        data = request.data
        author = User.objects.get(username=data['author'])
        addedData = invoicePart.objects.create(
            author=author,
            itemCode=data['itemCode'],
            partInvoiceNumber=data['partInvoiceNumber'],
            description=data['description'],
            quantity=data['quantity'],
            unitPrice=data['unitPrice'],
            totalPrice=data['totalPrice']
        )
        addedData.save()
        serializer = invoicePartSerializer(invoicePartsList, many=True)
        return Response(serializer.data)
