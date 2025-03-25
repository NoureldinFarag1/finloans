from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import LoanProvider, LoanCustomer, Loan, CustomUser, LoanParameters

class LoanApprovalTest(TestCase):
    def setUp(self):
        self.provider_user = CustomUser.objects.create_user(username='provider', password='password', role=CustomUser.LOAN_PROVIDER)
        self.customer_user = CustomUser.objects.create_user(username='customer', password='password', role=CustomUser.LOAN_CUSTOMER)
        self.provider = LoanProvider.objects.create(user=self.provider_user, available_funds=1000.00)
        self.customer = LoanCustomer.objects.create(user=self.customer_user)
        self.loan = Loan.objects.create(provider=self.provider, customer=self.customer, amount=500.00, interest_rate=5.00, start_date='2025-01-01', end_date='2026-01-01')

    def test_approve_loan_request(self):
        self.assertTrue(self.loan.approve())
        self.loan.refresh_from_db()
        self.provider.refresh_from_db()
        self.assertTrue(self.loan.approved)
        self.assertEqual(self.provider.available_funds, 500.00)

    def test_approve_loan_request_insufficient_funds(self):
        self.loan.amount = 1500.00
        self.loan.save()
        self.assertFalse(self.loan.approve())
        self.loan.refresh_from_db()
        self.provider.refresh_from_db()
        self.assertFalse(self.loan.approved)
        self.assertEqual(self.provider.available_funds, 1000.00)

class LoanEndpointsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.bank_personnel_user = CustomUser.objects.create_user(username='bank', password='password', role=CustomUser.BANK_PERSONNEL)
        self.client.login(username='bank', password='password')
        self.provider_user = CustomUser.objects.create_user(username='provider', password='password', role=CustomUser.LOAN_PROVIDER)
        self.customer_user = CustomUser.objects.create_user(username='customer', password='password', role=CustomUser.LOAN_CUSTOMER)
        self.provider = LoanProvider.objects.create(user=self.provider_user, available_funds=1000.00)
        self.customer = LoanCustomer.objects.create(user=self.customer_user)
        self.loan = Loan.objects.create(provider=self.provider, customer=self.customer, amount=500.00, interest_rate=5.00, start_date='2025-01-01', end_date='2026-01-01')

    def test_define_loan_parameters(self):
        response = self.client.post(reverse('define_loan_parameters'), {
            'min_amount': 100.00,
            'max_amount': 10000.00,
            'min_interest_rate': 1.00,
            'max_interest_rate': 10.00,
            'min_duration': 6,
            'max_duration': 60
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'parameters defined')

    def test_apply_for_loan(self):
        self.client.login(username='customer', password='password')
        response = self.client.post(reverse('apply_loan'), {
            'amount': 500.00,
            'term': 12
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'loan applied')

    def test_make_loan_payment(self):
        self.client.login(username='customer', password='password')
        response = self.client.post(reverse('make_payment', args=[self.loan.id]), {
            'amount': 100.00,
            'date': '2025-06-01'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'payment made')

    def test_view_amortization_table(self):
        self.client.login(username='provider', password='password')
        response = self.client.get(reverse('view_amortization', args=[self.provider.id]), {'funds': 1000.00})
        self.assertEqual(response.status_code, 200)
        self.assertIn('amortization_table', response.json())

    def test_unauthorized_access(self):
        self.client.logout()
        response = self.client.post(reverse('apply_loan'), {
            'amount': 500.00,
            'term': 12
        })
        self.assertEqual(response.status_code, 403)

class LoanParametersTest(TestCase):
    def setUp(self):
        self.bank_personnel_user = CustomUser.objects.create_user(username='bank', password='password', role=CustomUser.BANK_PERSONNEL)
        self.client = APIClient()
        self.client.login(username='bank', password='password')

    def test_define_loan_parameters(self):
        response = self.client.post(reverse('define_loan_parameters'), {
            'min_amount': 100.00,
            'max_amount': 10000.00,
            'min_interest_rate': 1.00,
            'max_interest_rate': 10.00,
            'min_duration': 6,
            'max_duration': 60
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'parameters defined')

    def test_define_loan_parameters_invalid(self):
        response = self.client.post(reverse('define_loan_parameters'), {
            'min_amount': 100.00,
            'max_amount': 10000.00,
            'min_interest_rate': 1.00,
            'max_interest_rate': 10.00,
            'min_duration': 6,
            'max_duration': 5 
        })
        self.assertEqual(response.status_code, 400)

class UnauthorizedAccessTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer_user = CustomUser.objects.create_user(username='customer', password='password', role=CustomUser.LOAN_CUSTOMER)
        self.bank_personnel_user = CustomUser.objects.create_user(username='bank', password='password', role=CustomUser.BANK_PERSONNEL)

    def test_apply_for_loan_unauthorized(self):
        response = self.client.post(reverse('apply_loan'), {'amount': 500, 'term': 12})
        self.assertEqual(response.status_code, 403)

    def test_define_loan_parameters_unauthorized(self):
        response = self.client.post(reverse('define_loan_parameters'), {
            'min_amount': 100, 'max_amount': 10000, 'min_interest_rate': 1, 'max_interest_rate': 10, 'min_duration': 6, 'max_duration': 60
        })
        self.assertEqual(response.status_code, 403)
