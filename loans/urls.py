from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import approve_loan_request, LoanProviderViewSet, LoanCustomerViewSet, BankPersonnelViewSet, apply_for_loan, make_loan_payment, define_loan_parameters, view_amortization_table
from django.views.generic import RedirectView
from .views import LoanListView, LoanDetailView, PaymentListView, PaymentDetailView, LoanParametersListView, LoanParametersDetailView
from .views import loan_application_view, loan_payment_view, loan_parameters_view
from .views import loan_list_view, loan_detail_view
from .views import home_view
from .views import login_view, logout_view

router = DefaultRouter()
router.register(r'loan-providers', LoanProviderViewSet)
router.register(r'loan-customers', LoanCustomerViewSet)
router.register(r'bank-personnel', BankPersonnelViewSet)

urlpatterns = [
    path('', home_view, name='home'),
    path('approve-loan/<int:loan_id>/', approve_loan_request, name='approve_loan'),
    path('api/', include(router.urls)),
]

urlpatterns += [
    path('apply-loan/', apply_for_loan, name='apply_loan'),
    path('make-payment/<int:loan_id>/', make_loan_payment, name='make_payment'),
    path('define-loan-parameters/', define_loan_parameters, name='define_loan_parameters'),
    path('view-amortization/<int:provider_id>/', view_amortization_table, name='view_amortization'),
    path('loans/', LoanListView.as_view(), name='loan_list'),
    path('loans/<int:pk>/', LoanDetailView.as_view(), name='loan_detail'),
    path('payments/', PaymentListView.as_view(), name='payment_list'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment_detail'),
    path('loan-parameters/', LoanParametersListView.as_view(), name='loan_parameters_list'),
    path('loan-parameters/<int:pk>/', LoanParametersDetailView.as_view(), name='loan_parameters_detail'),
]

urlpatterns += [
    path('apply-loan-view/', loan_application_view, name='apply_loan_view'),
    path('make-payment-view/<int:loan_id>/', loan_payment_view, name='make_payment_view'),
    path('define-loan-parameters-view/', loan_parameters_view, name='define_loan_parameters_view'),
]

urlpatterns += [
    path('loans-view/', loan_list_view, name='loan_list_view'),
    path('loans-view/<int:loan_id>/', loan_detail_view, name='loan_detail_view'),
]

urlpatterns += [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
]
