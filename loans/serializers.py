from rest_framework import serializers
from .models import LoanProvider, LoanCustomer, BankPersonnel, LoanParameters, Loan, Payment

class LoanProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProvider
        fields = '__all__'

class LoanCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanCustomer
        fields = '__all__'

class BankPersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankPersonnel
        fields = '__all__'

class LoanParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanParameters
        fields = '__all__'

    def validate(self, data):
        if data['min_duration'] > data['max_duration']:
            raise serializers.ValidationError("Min duration cannot be greater than max duration.")
        return data

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
