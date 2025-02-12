from rest_framework import serializers
from .models import User, Advertisement, Image, Location, Category, SubCategory, Report, Offer, ChatMessage, ChatRoom, Notification
from django.contrib.auth.password_validation import validate_password


# UserSerializer remains the same
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'is_verified', 'is_staff', 'is_superuser')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

# ImageSerializer remains the same
class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'image_url', 'is_primary']

    def get_image_url(self, obj):
        return obj.image.url  # This will return the full URL of the image

# LocationSerializer to handle the Location model
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['city', 'state', 'country']  # You can add other fields as needed

# AdvertisementSerializer with LocationSerializer
class AdvertisementSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    location = LocationSerializer()
    metrics = serializers.SerializerMethodField()
    listing_metrics = serializers.SerializerMethodField()

    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'description', 'price', 
            'category', 'subcategory', 'location', 
            'condition', 'brand', 'tags', 'featured',
            'status', 'user', 'images', 'created_at',
            'updated_at', 'metrics', 'listing_metrics',
            'show_phone', 'contact_phone', 'allow_offers',
            'negotiable', 'model', 'year'
        ]
        read_only_fields = [
            'views_count', 'messages_count', 
            'offers_count', 'saved_count'
        ]

    def get_metrics(self, obj):
        request = self.context.get('request')
        # Only return metrics if the requester is authenticated and is the owner
        if request and request.user.is_authenticated and request.user == obj.user:
            return {
                'views': obj.views_count,
                'messages': obj.messages_count,
                'offers': obj.offers_count,
                'saves': obj.saved_count
            }
        return None

    def get_listing_metrics(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.user:
            return {
                'views': obj.view_count,
                'messages': ChatRoom.objects.filter(advertisement=obj).count(),
                'offers': Offer.objects.filter(advertisement=obj).count(),
            }
        return None

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        
        if location_data:
            location_instance, _ = Location.objects.get_or_create(**location_data)
            instance.location = location_instance
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'order', 'is_active']

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'is_active', 'category']

class CategoryDetailSerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id','name', 'slug', 'icon', 'subcategories']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['reason', 'description']

class OfferSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Offer
        fields = ['id', 'amount', 'message', 'status', 'user', 'created_at']
        read_only_fields = ['status']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'sender', 'is_read', 'created_at']
        read_only_fields = ['is_read']

class ChatRoomSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    advertisement = AdvertisementSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'buyer', 'seller', 'advertisement', 'last_message', 'created_at']
    
    def get_last_message(self, obj):
        message = obj.chatmessage_set.order_by('-created_at').first()
        return ChatMessageSerializer(message).data if message else None

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'message', 'link', 'is_read', 'created_at']
