from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, InvoiceListSerializer, QuoteListSerializer, PartSerializer, invoicePartSerializer, FileInformationSerializer
from .models import User, InvoiceList, QuoteList, Part, invoicePart, FileInformation
from rest_framework.decorators import api_view
from django.core.files.storage import FileSystemStorage
import os
import pandas as pd

CURR_DIR = os.getcwd()

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

@api_view(['GET', 'POST', 'DELETE', 'PUT'])
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
    elif request.method == 'DELETE':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        for invoiceNumber in request.data:
            filteredData = InvoiceList.objects.filter(author=userID, invoiceNumber=invoiceNumber).delete()
        return Response(request.data)
    elif request.method == 'PUT':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id

        invoiceData = InvoiceList.objects.get(author=userID, id=data['invoiceNumberOriginal'])
        invoiceData.invoiceNumber = data['invoiceNumber']
        invoiceData.customer = data['customer']
        invoiceData.createdDate = data['createdDate']
        invoiceData.dueDate = data['dueDate']
        invoiceData.totalDue = data['totalDue']
        invoiceData.status = data['status']
        invoiceData.save()
        return Response({'MESSAGE':"UPDATED"})


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
            serializer = PartSerializer(partData, many=True)
            return Response(serializer.data)


@api_view(['GET'])
def partSearch(request, username):
    if request.method == 'GET':
        user = User.objects.get(username=username)
        userID = user.id
        data = QuoteList.objects.filter(author=userID)
        serializer = QuoteListSerializer(data, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE', 'PUT'])
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
    elif request.method == 'POST':
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
    elif request.method == 'DELETE':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        if request.data[1] =='allDelete':
            for idNumber in request.data[0]:
                filteredData = invoicePart.objects.filter(author=userID, id=idNumber).delete()
            return Response({'allDelete':request.data})
        elif request.data[1] == 'notDelete':
            for itemCode in request.data[0]:
                filteredData = invoicePart.objects.filter(author=userID, itemCode=itemCode).delete()
            return Response({'notAllDelete':request.data})
    elif request.method == 'PUT':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        try:
            partData = invoicePart.objects.get(author=userID, id=data['invoiceNumberOriginal'])
            partData.partInvoiceNumber = data['partInvoiceNumber']
            partData.itemCode = data['itemCode']
            partData.description = data['description']
            partData.quantity = data['quantity']
            partData.unitPrice = data['unitPrice']
            partData.totalPrice = data['totalPrice']
            partData.save()
            return Response(request.data)
        except:
            author = User.objects.get(username=data['author'])
            partData = invoicePart.objects.create(
                author=author,
                itemCode=data['itemCode'],
                partInvoiceNumber=data['partInvoiceNumber'],
                description=data['description'],
                quantity=data['quantity'],
                unitPrice=data['unitPrice'],
                totalPrice=data['totalPrice']
            )
            return Response({"UPDATED":'TRUE'})


@api_view(['POST', 'GET'])
def uploadFile(request, username):
    if request.method == 'GET':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        fileList = FileInformation.objects.filter(author=userID)
        serializer = FileInformationSerializer(fileList, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=username)
        uploaded_file = request.FILES['files']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        url = fs.url(name)
        addedData = FileInformation.objects.create(
            author=author,
            fileName=uploaded_file.name,
            fileData=url
        )
        df = pd.read_excel(io=CURR_DIR+url)

        quote_number = df['Quote Number'][0]
        created_date = df['Created Date'][0]
        expected_date = df['Expected Date'][0]
        customers = df['Customers'][0]
        salesperson = df['Salesperson'][0]
        company = df['Company'][0]
        total = df['Total'][0]
        status = df['Status'][0]

        model_number = df['Model Number']
        part_number = df['Part Number']
        description = df['Description']
        cost = df['Cost']
        price = df['Price']
        onHand = df['On Hand']
        committed = df['Committed']


        for x in range(len(model_number)):
            addedData = Part.objects.create(
                author=author,
                partQuoteNumber=quote_number,
                partModelNumber=model_number[x],
                partNumber=part_number[x],
                partDescription=description[x],
                partCost=cost[x],
                partPrice=price[x],
                partQtyOnHand=onHand[x],
                partQtyCommitted=committed[x]
            )

        addedData2 = QuoteList.objects.create(
            author=author,
            quoteNumber=quote_number,
            customer=customers,
            total=total,
            createdDate=created_date,
            salesperson=salesperson,
            expectedDate=expected_date,
            company=company,
            status=status
        )

        return Response({'Imported': 'Success'})

@api_view(['POST', 'GET'])
def uploadFileInvoice(request, username):
    if request.method == 'GET':
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        fileList = FileInformation.objects.filter(author=userID)
        serializer = FileInformationSerializer(fileList, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=username)
        uploaded_file = request.FILES['files']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        url = fs.url(name)
        addedData = FileInformation.objects.create(
            author=author,
            fileName=uploaded_file.name,
            fileData=url
        )
        df = pd.read_excel(io=CURR_DIR+url)

        invoice_number = df['Invoice Number'][0]
        customer = df['Customer'][0]
        created_date = df['Created Date'][0]
        due_date = df['Due Date'][0]
        total = df['Total'][0]
        status = df['Status'][0]

        item_code = df['Item Code']
        description = df['Description']
        quantity = df['Quantity']
        unit_price = df['Unit Price']
        total_price = df['Total Price']

        for x in range(len(item_code)):
            addedData = invoicePart.objects.create(
                author=author,
                partInvoiceNumber=invoice_number,
                itemCode=item_code[x],
                description=description[x],
                quantity=quantity[x],
                unitPrice=unit_price[x],
                totalPrice=total_price[x],
            )
        addedData2 = InvoiceList.objects.create(
            author=author,
            invoiceNumber=invoice_number,
            customer=customer,
            createdDate=created_date,
            dueDate=due_date,
            totalDue=total,
            status=status
        )
        return Response({'Imported': 'Success'})
