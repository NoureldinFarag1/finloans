from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Loan, LoanProvider, LoanCustomer, BankPersonnel

# Register your models here.

class CustomUserAdmin(UserAdmin):
    ('Role', {'fields': ('role',)}),

class LoanAdmin(admin.ModelAdmin):
    list_display = ('id', 'provider', 'customer', 'amount', 'interest_rate', 'start_date', 'end_date', 'approved')
    list_filter = ('approved', 'start_date', 'end_date')
    search_fields = ('provider__user__username', 'customer__user__username')

class LoanProviderAdmin(admin.ModelAdmin):
    list_display = ('user', 'available_funds')
    search_fields = ('user__username',)

class LoanCustomerAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)

class BankPersonnelAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(LoanProvider, LoanProviderAdmin)
admin.site.register(LoanCustomer, LoanCustomerAdmin)
admin.site.register(BankPersonnel, BankPersonnelAdmin)