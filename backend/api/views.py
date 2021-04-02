from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, InvoiceListSerializer, QuoteListSerializer, PartSerializer
from .models import User, InvoiceList, QuoteList, Part
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

class InvoiceLists(APIView):
    def get_query(self):
        invoiceList = InvoiceList.objects.all()
        return invoiceList
    def get(self, request):
        invoiceList = self.get_query()
        serializer = InvoiceListSerializer(invoiceList, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
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

@api_view(['GET', 'POST'])
def Parts(request):
    partList = Part.objects.all()
    serializer = PartSerializer(partList, many=True)
    if request.method == 'GET':
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        author = User.objects.get(username=data['author'])
        addedData = Part.objects.create(
            author=author,
            partQuoteNumber=data['partQuoteNumber'],
            partGroupCode=data['partGroupCode'],
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
