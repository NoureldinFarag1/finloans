from rest_framework.permissions import BasePermission
from .models import CustomUser

class IsLoanProvider(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == CustomUser.LOAN_PROVIDER

class IsLoanCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == CustomUser.LOAN_CUSTOMER

class IsBankPersonnel(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == CustomUser.BANK_PERSONNEL
