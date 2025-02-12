from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now, timezone
from django.core.exceptions import ValidationError
from django.db.models import Q


# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# User Model
class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    verification_type = models.CharField(max_length=50, null=True, blank=True)
    email_verification_token = models.CharField(max_length=255, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    # Required for Django admin
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='classified_users'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True,
        related_name='classified_users'
    )

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new and self.is_staff:
            from django.contrib.auth.models import Permission
            from django.contrib.contenttypes.models import ContentType
            
            content_type = ContentType.objects.get_for_model(KYC)
            
            change_kyc = Permission.objects.get(
                codename='change_kyc',
                content_type=content_type,
            )
            view_kyc = Permission.objects.get(
                codename='view_kyc',
                content_type=content_type,
            )
            
            self.user_permissions.add(change_kyc, view_kyc)

    def __str__(self):
        return self.name

    def is_staff_or_superuser(self):
        return self.is_staff or self.is_superuser

    def approve_kyc(self):
        if self.is_staff_or_superuser():
            self.is_verified = True
            self.verification_type = 'service'
            self.save()
            return True
        return False

    def has_perm(self, perm, obj=None):
        if self.is_superuser:
            return True
        if self.is_staff:
            # Staff can approve KYC and manage basic content
            if perm in ['classifieds.change_kyc', 'classifieds.view_kyc']:
                return True
        return False

    def has_module_perms(self, app_label):
        if self.is_superuser:
            return True
        if self.is_staff and app_label == 'classifieds':
            return True
        return False

    @property
    def can_approve_kyc(self):
        return self.is_staff or self.is_superuser

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        permissions = [
            ("can_approve_kyc", "Can approve KYC submissions"),
        ]

# Category Model
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, null=True)  # FontAwesome icon name
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}, {self.slug}"

class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('category', 'slug')

    def __str__(self):
        return f"{self.name}, {self.slug}"    

# Location Model
class Location(models.Model):
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.city}, {self.state}, {self.country}"

# Advertisement Model
from django.utils import timezone

def get_default_expires_at():
    return timezone.now() + timezone.timedelta(days=30)

class Advertisement(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('sold', 'Sold'),
        ('expired', 'Expired')
    ]
    
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    brand = models.CharField(max_length=100, null=True, blank=True)
    tags = models.CharField(max_length=200, null=True, blank=True)
    
    # Metrics fields
    views_count = models.IntegerField(default=0)
    messages_count = models.IntegerField(default=0)
    offers_count = models.IntegerField(default=0)
    saved_count = models.IntegerField(default=0)
    reported_count = models.IntegerField(default=0)
    
    # Additional metrics fields
    # view_count = models.IntegerField(default=0)
    # message_count = models.IntegerField(default=0)
    # offer_count = models.IntegerField(default=0)
    
    # Status and dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    featured_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    # Contact Information
    show_phone = models.BooleanField(default=False)
    contact_phone = models.CharField(max_length=15, null=True, blank=True)
    allow_offers = models.BooleanField(default=True)
    negotiable = models.BooleanField(default=True)
    
    # Vehicle/Property specific fields (optional)
    model = models.CharField(max_length=100, null=True, blank=True)
    year = models.IntegerField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['location', 'status']),
        ]

    def __str__(self):
        return self.title

    def increment_view(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])

    def increment_message(self):
        self.messages_count += 1
        self.save(update_fields=['messages_count'])

    def increment_offer(self):
        self.offers_count += 1
        self.save(update_fields=['offers_count'])

    def increment_save(self):
        self.saved_count += 1
        self.save(update_fields=['saved_count'])

    def clean(self):
        # Validate contact information
        if self.show_phone and not self.contact_phone:
            raise ValidationError({
                'contact_phone': 'Contact phone is required when show_phone is enabled.'
            })
        
        # Validate vehicle/property fields if applicable
        if self.category.name.lower() in ['vehicles', 'properties']:
            if not self.model:
                raise ValidationError({
                    'model': 'Model is required for vehicle and property listings.'
                })
            if not self.year:
                raise ValidationError({
                    'year': 'Year is required for vehicle and property listings.'
                })

# Image Model
class Image(models.Model):
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='advertisement_images/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.image}"

# Favorite Model
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

# Message Model
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE, null=True, blank=True)
    subject = models.CharField(max_length=200, null=True, blank=True)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

# Transaction Model
class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_gateway = models.CharField(max_length=100, null=True, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)

# KYC Model
class KYC(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    KYC_TYPE_CHOICES = [
        ('id_card', 'ID Card'),
        ('passport_photo', 'Passport Photo'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    id_card_front = models.ImageField(upload_to='kyc_documents/front/')
    id_card_back = models.ImageField(upload_to='kyc_documents/back/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    kyc_type = models.CharField(max_length=100, choices=KYC_TYPE_CHOICES, null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)
    approved_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        related_name='approved_kycs',
        on_delete=models.SET_NULL,
        limit_choices_to=Q(is_staff=True) | Q(is_superuser=True)
    )

    def __str__(self):
        return f"KYC for {self.user.email}: {self.status}"

    def clean(self):
        if self.status == 'approved' and self.approved_by and not (self.approved_by.is_staff or self.approved_by.is_superuser):
            raise ValidationError({'approved_by': 'Only staff and superusers can approve KYC submissions.'})

# Report Model
class Report(models.Model):
    REASON_CHOICES = [
        ('spam', 'Spam'),
        ('offensive', 'Offensive Content'),
        ('fake', 'Fake Advertisement'),
        ('illegal', 'Illegal Content'),
        ('other', 'Other')
    ]
    
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='resolved_reports')

class Offer(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn')
    ]
    
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ChatRoom(models.Model):
    advertisement = models.ForeignKey(Advertisement, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, related_name='buyer_chats', on_delete=models.CASCADE)
    seller = models.ForeignKey(User, related_name='seller_chats', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    TYPE_CHOICES = [
        ('offer', 'New Offer'),
        ('message', 'New Message'),
        ('status', 'Status Update'),
        ('expiry', 'Listing Expiry'),
        ('report', 'Listing Reported')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.CharField(max_length=200, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
