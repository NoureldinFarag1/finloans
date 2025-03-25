from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    LOAN_PROVIDER = 'LP'
    LOAN_CUSTOMER = 'LC'
    BANK_PERSONNEL = 'BP'
    
    ROLE_CHOICES = [
        (LOAN_PROVIDER, 'Loan Provider'),
        (LOAN_CUSTOMER, 'Loan Customer'),
        (BANK_PERSONNEL, 'Bank Personnel'),
    ]
    
    role = models.CharField(max_length=2, choices=ROLE_CHOICES)
    
    def __str__ (self):
        return self.username
    
class LoanProvider(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    available_funds = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return self.user.username

class LoanCustomer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
class BankPersonnel(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
    
class Loan(models.Model):
    provider = models.ForeignKey(LoanProvider, on_delete=models.CASCADE)
    customer = models.ForeignKey(LoanCustomer, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Loan {self.id} from {self.provider} to {self.customer}"
    
    def approve(self):
        if self.amount <= self.provider.available_funds:
            self.approved = True
            self.provider.available_funds -= self.amount
            self.save()
            self.provider.save()
            return True
        return False

class Payment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    
    def __str__(self):
        return f"Payment {self.id} for Loan {self.loan.id}"

class LoanParameters(models.Model):
    min_amount = models.DecimalField(max_digits=10, decimal_places=2)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2)
    min_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    max_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    min_duration = models.IntegerField() 
    max_duration = models.IntegerField()

    def __str__(self):
        return f"Loan Parameters {self.id}"