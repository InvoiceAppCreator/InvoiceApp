from rest_framework import serializers
from .models import User, InvoiceList, QuoteList, Part, invoicePart

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class InvoiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceList
        fields = '__all__'

class QuoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteList
        fields = '__all__'

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'

class invoicePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = invoicePart
        fields = '__all__'
