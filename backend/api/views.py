from django.shortcuts import render
from rest_framework.response import Response
from .serializers import UserSerializer, InvoiceListSerializer, QuoteListSerializer, PartSerializer, invoicePartSerializer, FileInformationSerializer
from .models import User, InvoiceList, QuoteList, Part, invoicePart, FileInformation, EmailInfo
from rest_framework.decorators import api_view
from django.core.files.storage import FileSystemStorage
from django.http import FileResponse
from email.message import EmailMessage
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph, Table, TableStyle
from django.http import HttpResponse, HttpResponseNotFound
import io
import os
import pandas as pd
import datetime
import smtplib
import hashlib
import json
from . import TokenCheck

CURR_DIR = os.getcwd()

@api_view(['POST'])
def Users(request):
    if request.method == "POST":
        userData = request.data
        try:
            if userData['login'] == True:
                loginData = User.objects.get(username=userData['username'])
                usernameCheck = loginData.username
                passwordCheck = loginData.password
                if usernameCheck == userData['username'] and passwordCheck == userData['password']:
                    hashData = {
                    'firstName':loginData.firstName,
                    'lastName':loginData.lastName,
                    'username':loginData.username,
                    'email':loginData.email,
                    'password':loginData.password,
                    }
                    hashData = json.dumps(hashData).encode('utf-8')
                    token = hashlib.sha256(hashData).hexdigest()
                    return Response({'message':'Success', 'TOKEN':token, 'username':loginData.username, 'firstName':loginData.firstName, 'lastName':loginData.lastName, 'email':loginData.email})
                else:
                    return Response({'message':'Wrong'})

            elif userData['login'] == False:
                User.objects.create(firstName=userData['firstName'],
                                    lastName=userData['lastName'],
                                    username=userData['username'],
                                    email=userData['email'],
                                    password=userData['password'])
                hashData = {
                    'firstName':userData['firstName'],
                    'lastName':userData['lastName'],
                    'username':userData['username'],
                    'email':userData['email'],
                    'password':userData['password'],
                }
                hashData = json.dumps(hashData).encode('utf-8')
                token = hashlib.sha256(hashData).hexdigest()
                return Response({'TOKEN':token})
        except Exception as e:
            return Response({'message':e})

@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def InvoiceLists(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'GET' and check == True:
        user = User.objects.get(username=username)
        userID = user.id
        authInvoiceList = InvoiceList.objects.filter(author=userID)
        serialize = InvoiceListSerializer(authInvoiceList, many=True)
        return Response(serialize.data)
    elif request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=data['author'])
        InvoiceList.objects.create(
            author=author,
            invoiceNumber=data['invoiceNumber'],
            customer=data['customer'],
            createdDate=data['createdDate'],
            dueDate=data['dueDate'],
            totalDue=data['totalDue'],
            status=data['status']
        )
        return Response({'Status':'OK'})
    elif request.method == 'DELETE' and check == True:
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        for invoiceNumber in request.data:
            filteredData = InvoiceList.objects.filter(author=userID, invoiceNumber=invoiceNumber).delete()
        return Response({'Status':'OK'})
    elif request.method == 'PUT' and check == True:
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
        return Response({'Status':'OK'})

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def QuoteLists(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'GET' and check == True:
        user = User.objects.get(username=username)
        userID = user.id
        authQuoteList = QuoteList.objects.filter(author=userID)
        serialize = QuoteListSerializer(authQuoteList, many=True)
        return Response(serialize.data)
    elif request.method == 'POST' and check == True:
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
        return Response({'Status':'OK'})
    elif request.method == 'DELETE' and check == True:
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        for quoteNumber in request.data:
            filteredData = QuoteList.objects.filter(author=userID, quoteNumber=quoteNumber).delete()
        return Response({'Status':'OK'})
    elif request.method == 'PUT' and check == True:
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
        return Response({'Status':'OK'})

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def Parts(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'GET' and check == True:
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        partListAuth = Part.objects.filter(author=userID)
        serializer = PartSerializer(partListAuth, many=True)
        return Response(serializer.data)
    elif request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=data['author'])
        Part.objects.create(
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
        return Response({'Status':'OK'})
    elif request.method == 'DELETE' and check == True:
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        if request.data[1] =='allDelete':
            for idNumber in request.data[0]:
                filteredData = Part.objects.filter(author=userID, id=idNumber).delete()
            return Response({'Status':'OK'})
        elif request.data[1] == 'notDelete':
            for modelNumber in request.data[0]:
                filteredData = Part.objects.filter(author=userID, partModelNumber=modelNumber).delete()
            return Response({'Status':'OK'})
    elif request.method == 'PUT' and check == True:
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
            return Response({'Status':'OK'})
        except:
            author = User.objects.get(username=data['author'])
            Part.objects.create(
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
            return Response({'Status':'OK'})

@api_view(['GET'])
def partSearch(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'GET' and check == True:
        user = User.objects.get(username=username)
        userID = user.id
        data = QuoteList.objects.filter(author=userID)
        serializer = QuoteListSerializer(data, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def invoiceParts(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'GET' and check == True:
        data = request.data
        user = User.objects.get(username=username)
        userID = user.id
        invoicePartsList = invoicePart.objects.filter(author=userID)
        serializer = invoicePartSerializer(invoicePartsList, many=True)
        return Response(serializer.data)
    elif request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=data['author'])
        invoicePart.objects.create(
            author=author,
            itemCode=data['itemCode'],
            partInvoiceNumber=data['partInvoiceNumber'],
            description=data['description'],
            quantity=data['quantity'],
            unitPrice=data['unitPrice'],
            totalPrice=data['totalPrice']
        )
        return Response({'Status':'OK'})
    elif request.method == 'DELETE' and check == True:
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
    elif request.method == 'PUT' and check == True:
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
            return Response({'Status':'OK'})
        except:
            author = User.objects.get(username=data['author'])
            invoicePart.objects.create(
                author=author,
                itemCode=data['itemCode'],
                partInvoiceNumber=data['partInvoiceNumber'],
                description=data['description'],
                quantity=data['quantity'],
                unitPrice=data['unitPrice'],
                totalPrice=data['totalPrice']
            )
            return Response({'Status':'OK'})

@api_view(['POST'])
def uploadFile(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=username)
        uploaded_file = request.FILES['files']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        url = fs.url(name)
        addedData = FileInformation.objects.create (
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
            Part.objects.create(
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
        QuoteList.objects.create(
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
        return Response({'Status':'OK'})

@api_view(['POST'])
def uploadFileInvoice(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=username)
        uploaded_file = request.FILES['files']
        fs = FileSystemStorage()
        name = fs.save(uploaded_file.name, uploaded_file)
        url = fs.url(name)
        FileInformation.objects.create (
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
            invoicePart.objects.create(
                author=author,
                partInvoiceNumber=invoice_number,
                itemCode=item_code[x],
                description=description[x],
                quantity=quantity[x],
                unitPrice=unit_price[x],
                totalPrice=total_price[x],
            )
        InvoiceList.objects.create(
            author=author,
            invoiceNumber=invoice_number,
            customer=customer,
            createdDate=created_date,
            dueDate=due_date,
            totalDue=total,
            status=status
        )
        return Response({'Status':'OK'})

@api_view(['POST'])
def quotePDF(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'POST' and check == True:
        info = request.data
        quoteNumber = info['quoteNumber']
        customer = info['customer']
        total = info['total']
        createdDate = info['createdDate']
        salesperson = info['salesperson']
        expectedDate = info['expectedDate']
        company = info['company']
        modelNumber = info['modelNumber']
        partNumber = info['partNumber']
        description = info['description']
        cost = info['cost']
        price = info['price']
        onHand = info['onHand']
        comitted = info['comitted']
        header_info = ['Model #', 'Part #', 'Desc.', 'Cost', 'Price', 'Hand', 'Committed']
        data = []
        for x in range(len(modelNumber)):
            dataToBeAppended = [modelNumber[x], partNumber[x], Paragraph(description[x]), cost[x], price[x], onHand[x], comitted[x]]
            data.append(dataToBeAppended)
        data.append(header_info)
        fileName = CURR_DIR + '/api/PDFs/' + quoteNumber + '.pdf'
        pdf = canvas.Canvas(fileName, bottomup=False, pagesize=A4)
        pdf.drawImage(CURR_DIR+'/api/header.jpeg', 7,9,580,70)
        pdf.setFillColorRGB(255,255,255)
        pdf.setFont("Courier-Bold", 36)
        pdf.drawString(30,54, quoteNumber)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,120, "Customer: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(200,120, customer)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,150, "Salesperson")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(200,150, salesperson)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,180, "Company: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(200,180, company)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,240, "Total: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(120,240, '$'+total)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 10)
        pdf.drawString(30,265, "Created: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 10)
        pdf.drawString(80,265, createdDate)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 10)
        pdf.drawString(430,265, "Expected: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 10)
        pdf.drawString(490,265, expectedDate)
        table = Table(data, colWidths=[60,60,150,60,60, 60, 80])
        table.setStyle([
				('FONTNAME', (0,-1), (-1,-1), 'Courier-Bold'),
				('FONTSIZE', (0,-1), (-1,-1), 12),
                ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                ("TOPPADDING", (0,0), (-1,-1), 10),
                ('BACKGROUND', (0,-1), (-1,-1), colors.green),
                ('TEXTCOLOR', (0,-1), (-1,-1), colors.white),
                ('BOX', (0,0), (-1,-1), 0.25, colors.black),
                ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ])
        table.wrapOn(pdf, 0, 0)
        table.drawOn(pdf, 30, 270)
        pdf.showPage()
        pdf.save()
        return FileResponse(open(fileName, 'rb'))

@api_view(['POST'])
def invoicePDF(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'POST' and check == True:
        info = request.data
        invoiceNumber = info['invoiceNumber']
        customer = info['customer']
        createdDate = info['createdDate']
        dueDate = info['dueDate']
        totalDue = info['totalDue']
        itemCode = info['itemCode']
        description = info['description']
        quantity = info['quantity']
        unitPrice = info['unitPrice']
        totalPrice = info['totalPrice']
        header_info = ['Item Code', 'Desc.', 'Quantity', 'Unit Price', 'Total Price']
        data = []
        for x in range(len(itemCode)):
            dataToBeAppended = [itemCode[x], Paragraph(description[x]), quantity[x], unitPrice[x], totalPrice[x]]
            data.append(dataToBeAppended)
        data.append(header_info)
        fileName = CURR_DIR + '/api/PDFs/' + invoiceNumber + '.pdf'
        pdf = canvas.Canvas(fileName, bottomup=False, pagesize=A4)
        pdf.drawImage(CURR_DIR+'/api/header.jpeg', 7,9,580,70)
        pdf.setFillColorRGB(255,255,255)
        pdf.setFont("Courier-Bold", 36)
        pdf.drawString(30,54, invoiceNumber)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,120, "Customer: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(200,120, customer)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 20)
        pdf.drawString(30,150, "Due Date: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 20)
        pdf.drawString(200,150, dueDate)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 40)
        pdf.drawString(30,220, "Total: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 35)
        pdf.drawString(190,220, '$'+ totalDue)
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier-Bold', 10)
        pdf.drawString(40,265, "Created: ")
        pdf.setFillColorRGB(0,0,0)
        pdf.setFont('Courier', 10)
        pdf.drawString(90,265, createdDate)
        table = Table(data, colWidths=[90,160,90,90,90])
        table.setStyle([
				('FONTNAME', (0,-1), (-1,-1), 'Courier-Bold'),
				('FONTSIZE', (0,-1), (-1,-1), 12),
                ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 10),
                ('BACKGROUND', (0,-1), (-1,-1), colors.green),
                ('TEXTCOLOR', (0,-1), (-1,-1), colors.white),
                ('BOX', (0,0), (-1,-1), 0.25, colors.black),
                ('INNERGRID', (0,0), (-1,-1), 0.25, colors.black),
        ])
        table.wrapOn(pdf, 0, 0)
        table.drawOn(pdf, 30, 270)
        pdf.showPage()
        pdf.save()
        return FileResponse(open(fileName, 'rb'))

@api_view(['POST'])
def emailPDF(request, username, token):
    check = TokenCheck.checkToken(username, token)
    if request.method == 'POST' and check == True:
        data = request.data
        author = User.objects.get(username=username)
        if request.data['nowOrLater'] == 'now':
            email = 'xxx'
            password = 'xxx'
            contactsArray = []
            contacts = request.data['recipients'].split(' ')
            for contact in contacts:
                contactsArray.append(contact)
            msg = EmailMessage()
            msg['Subject'] = request.data['subject']
            msg['From'] = email
            msg['To'] = contactsArray
            msg.set_content(request.data['message'])
            uploaded_file = request.FILES['filePDF']
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            url = fs.url(name)
            with open(CURR_DIR + url, 'rb') as f:
                file_data = f.read()
                file_name = request.FILES['filePDF'].name
                msg.add_attachment(file_data, maintype='application', subtype='octet-stream', filename=file_name)
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(email, password)
                smtp.send_message(msg)
            return Response({'Status':'OK'})
        elif request.data['nowOrLater'] == 'later':
            uploaded_file = request.FILES['filePDF']
            fs = FileSystemStorage()
            name = fs.save(uploaded_file.name, uploaded_file)
            url = fs.url(name)
            EmailInfo.objects.create(
                author=author,
                PDF=url,
                recipients=request.data['recipients'],
                message=request.data['message'],
                now=False,
                later=request.data['nowOrLater'],
                subject=request.data['subject'],
                fileName=request.FILES['filePDF'].name,
                date=request.data['timeToSend']
            )
            return Response({'Status':'OK'})
