from django.contrib import admin
from django.utils.timezone import now
from django.core.exceptions import ValidationError
from django.dispatch import receiver
from django.db.models.signals import pre_save
from .models import User, Category,SubCategory, Location, Advertisement, Image, Favorite, Message, Transaction, KYC

class Useradmin(admin.ModelAdmin):
    list_display = ('id','name','email','is_staff')
admin.site.register(User,Useradmin)

class CategoryAdmin(admin.ModelAdmin):
    list_display=('name','slug')
admin.site.register(Category,CategoryAdmin)

admin.site.register(SubCategory)
admin.site.register(Location)

class Add(admin.ModelAdmin):
    list_display=('title','user',)
admin.site.register(Advertisement,Add)

admin.site.register(Image)
admin.site.register(Favorite)
admin.site.register(Message)
admin.site.register(Transaction)

@admin.register(KYC)
class KYCAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'submitted_at', 'verified_at', 'approved_by_display')
    list_filter = ('status',)
    actions = ['approve_kyc', 'reject_kyc']
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not self.has_change_permission(request, obj):
            if 'approved_by' in form.base_fields:
                form.base_fields['approved_by'].disabled = True
        return form

    def has_change_permission(self, request, obj=None):
    # Grant permission for both staff and superuser
        return request.user.is_staff or request.user.is_superuser


    def has_module_permission(self, request):
        return request.user.is_staff or request.user.is_superuser

    def approve_kyc(self, request, queryset):
        if not self.has_change_permission(request):
            self.message_user(request, "You do not have permission to approve KYC submissions.", level="error")
            return

        for kyc in queryset:
            kyc.status = 'approved'
            kyc.verified_at = now()
            kyc.user.is_verified = True
            kyc.user.verification_type = 'service'
            kyc.user.save()
            kyc.approved_by = request.user
            kyc.save()
        self.message_user(request, "Selected KYC submissions approved.")

    def reject_kyc(self, request, queryset):
        if not self.has_change_permission(request):
            self.message_user(request, "You do not have permission to reject KYC submissions.", level="error")
            return
            
        for kyc in queryset:
            kyc.status = 'rejected'
            kyc.save()
        self.message_user(request, "Selected KYC submissions rejected.")

    def approved_by_display(self, obj):
        return obj.approved_by.name if obj.approved_by else "Not approved"

    approved_by_display.short_description = "Approved By"
    approve_kyc.short_description = "Approve selected KYC submissions"
    reject_kyc.short_description = "Reject selected KYC submissions"

# @receiver(pre_save, sender=Advertisement)
# def check_verification(sender, instance, **kwargs):
#     if instance.requires_verification and not getattr(instance.user, 'is_verified', False):
#         raise ValidationError("User must be verified to post ads in this category.")

    #this code is not allowing advertisement to post idk why