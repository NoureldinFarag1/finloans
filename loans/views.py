from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseForbidden
from .models import Loan, CustomUser, Payment, LoanParameters
from rest_framework import viewsets, generics
from .models import LoanProvider, LoanCustomer, BankPersonnel
from .serializers import LoanProviderSerializer, LoanCustomerSerializer, BankPersonnelSerializer, LoanSerializer, PaymentSerializer, LoanParametersSerializer
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from .permissions import IsLoanProvider, IsLoanCustomer, IsBankPersonnel
from django.contrib.auth import authenticate, login, logout
import logging

logger = logging.getLogger(__name__)

# Create your views here.

def approve_loan_request(request, loan_id):
    loan = get_object_or_404(Loan, id=loan_id)
    if loan.approve():
        return JsonResponse({'status': 'approved'})
    else:
        return JsonResponse({'status': 'insufficient funds'})

@require_POST
@csrf_exempt
def apply_for_loan(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden("You must be logged in to apply for a loan.")
    
    logger.debug(f"User {request.user.username} has role {request.user.role}")
    
    if request.user.role != CustomUser.LOAN_CUSTOMER:
        return HttpResponseForbidden("Only loan customers can apply for loans.")
    
    try:
        customer = request.user.loancustomer
    except LoanCustomer.DoesNotExist:
        return HttpResponseForbidden("User is not associated with a LoanCustomer.")
    
    amount = request.POST.get('amount')
    term = request.POST.get('term')
    return JsonResponse({'status': 'loan applied'})

@require_POST
@csrf_exempt
def make_loan_payment(request, loan_id):
    if not request.user.is_authenticated or request.user.role != CustomUser.LOAN_CUSTOMER:
        raise PermissionDenied
    loan = get_object_or_404(Loan, id=loan_id)
    amount = request.POST.get('amount')
    date = parse_date(request.POST.get('date'))
    return JsonResponse({'status': 'payment made'})

@require_POST
@csrf_exempt
def define_loan_parameters(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden("You must be logged in to define loan parameters.")
    if request.user.role != CustomUser.BANK_PERSONNEL:
        return HttpResponseForbidden("Only bank personnel can define loan parameters.")
    serializer = LoanParametersSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'status': 'parameters defined'})
    return JsonResponse(serializer.errors, status=400)

def view_amortization_table(request, provider_id):
    if not request.user.is_authenticated or request.user.role != CustomUser.LOAN_PROVIDER:
        raise PermissionDenied
    provider = get_object_or_404(LoanProvider, id=provider_id)
    funds = request.GET.get('funds')
    return JsonResponse({'amortization_table': '...'})

def loan_application_view(request):
    return render(request, 'loans/apply_for_loan.html')

def loan_payment_view(request, loan_id):
    return render(request, 'loans/make_loan_payment.html', {'loan_id': loan_id})

def loan_parameters_view(request):
    return render(request, 'loans/define_loan_parameters.html')

def loan_list_view(request):
    loans = Loan.objects.all()
    return render(request, 'loans/loan_list.html', {'loans': loans})

def loan_detail_view(request, loan_id):
    loan = get_object_or_404(Loan, id=loan_id)
    return render(request, 'loans/loan_detail.html', {'loan': loan})

def home_view(request):
    return render(request, 'loans/home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'loans/login.html', {'error': 'Invalid credentials'})
    return render(request, 'loans/login.html')

def logout_view(request):
    logout(request)
    return redirect('home')

class LoanProviderViewSet(viewsets.ModelViewSet):
    queryset = LoanProvider.objects.all()
    serializer_class = LoanProviderSerializer
    permission_classes = [IsAuthenticated, IsLoanProvider]

class LoanCustomerViewSet(viewsets.ModelViewSet):
    queryset = LoanCustomer.objects.all()
    serializer_class = LoanCustomerSerializer
    permission_classes = [IsAuthenticated, IsLoanCustomer]

class BankPersonnelViewSet(viewsets.ModelViewSet):
    queryset = BankPersonnel.objects.all()
    serializer_class = BankPersonnelSerializer
    permission_classes = [IsAuthenticated, IsBankPersonnel]

class LoanListView(generics.ListCreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class LoanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class PaymentListView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class LoanParametersListView(generics.ListCreateAPIView):
    queryset = LoanParameters.objects.all()
    serializer_class = LoanParametersSerializer

class LoanParametersDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LoanParameters.objects.all()
    serializer_class = LoanParametersSerializer
