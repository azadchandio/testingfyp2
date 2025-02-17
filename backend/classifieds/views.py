from rest_framework import status
from django.shortcuts import get_object_or_404, render
from django.utils.timezone import now
from django.db.models import Q
from django.utils import timezone
from django.db.models import Sum
import json

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer
from .models import User, Advertisement, Image,KYC, Category,SubCategory, Offer, ChatRoom, Notification, Favorite, ChatMessage
from .serializers import AdvertisementSerializer,ImageSerializer, CategorySerializer, SubCategorySerializer, CategoryDetailSerializer, OfferSerializer, ChatMessageSerializer, NotificationSerializer
from rest_framework import generics, filters, viewsets,permissions
from rest_framework.views import APIView
from .serializers import ReportSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Location
from .serializers import LocationSerializer

from rest_framework.parsers import MultiPartParser, FormParser  # ✅ Import here

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Required for handling file uploads

    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_condition_choices(request):
    """
    API view to fetch condition choices for advertisements.
    """
    condition_choices = Advertisement.CONDITION_CHOICES
    formatted_choices = [
        {'value': choice[0], 'label': choice[1]} 
        for choice in condition_choices
    ]
    return Response(formatted_choices)

# Location List and Create View
class CountryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Get distinct countries from Location model
        countries = Location.objects.values('country').distinct().order_by('country')
        country_list = [
            {
                'code': country['country'],
                'name': country['country'],
                'id': index
            } for index, country in enumerate(countries, 1)
        ]
        return Response(country_list)

class CityListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, country, state):
        # Fetch cities based on country and state
        cities = Location.objects.filter(country=country, state=state)
        city_list = [
            {
                'code': city.city,  # Accessing the city attribute directly
                'name': city.city,
                'id': index
            } for index, city in enumerate(cities, 1)
        ]
        return Response(city_list)

class StateListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, country):
        # Get states for a specific country
        states = Location.objects.filter(country=country)\
            .values('state').distinct().order_by('state')
        state_list = [
            {
                'code': state['state'],
                'name': state['state'],
                'id': index
            } for index, state in enumerate(states, 1)
        ]
        return Response(state_list)

# Your existing views can remain...
class LocationListCreateView(generics.ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            return Response(
                {'error': 'You must be logged in to create locations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save(created_by=self.request.user)

# Location Detail, Update, and Delete View
class LocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        if not self.request.user.is_authenticated:
            return Response(
                {'error': 'You must be logged in to update locations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if self.request.user == serializer.instance.created_by or self.request.user.is_staff:
            serializer.save()
        else:
            return Response(
                {'error': 'You do not have permission to update this location.'},
                status=status.HTTP_403_FORBIDDEN
            )

    def perform_destroy(self, instance):
        if not self.request.user.is_authenticated:
            return Response(
                {'error': 'You must be logged in to delete locations.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if self.request.user == instance.created_by or self.request.user.is_staff:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {'error': 'You do not have permission to delete this location.'},
                status=status.HTTP_403_FORBIDDEN
            )

# Location Search View
class LocationSearchView(generics.ListAPIView):
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Location.objects.all()
        city = self.request.query_params.get('city', None)
        state = self.request.query_params.get('state', None)
        country = self.request.query_params.get('country', None)

        if city:
            queryset = queryset.filter(city__icontains=city)
        if state:
            queryset = queryset.filter(state__icontains=state)
        if country:
            queryset = queryset.filter(country__icontains=country)

        return queryset

class AdvertisementUpdateView(generics.UpdateAPIView):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        advertisement = get_object_or_404(Advertisement, id=self.kwargs['pk'])
        if advertisement.user != self.request.user:
            self.permission_denied(
                self.request, 
                message="You do not have permission to edit this advertisement."
            )
        return advertisement

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Handle location data if it's present as a JSON string
        if 'location' in request.data and isinstance(request.data['location'], str):
            try:
                request.data._mutable = True
                request.data['location'] = json.loads(request.data['location'])
                request.data._mutable = False
            except (ValueError, AttributeError):
                pass

        serializer = self.get_serializer(
            instance, 
            data=request.data, 
            partial=partial
        )
        
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def AdvertisementListView(request):
    user_id = request.query_params.get('user_id')  # Get user_id from query parameters
    if user_id:
        advertisements = Advertisement.objects.filter(user_id=user_id)  # Filter by user_id
    else:
        advertisements = Advertisement.objects.all()  # Return all advertisements if no user_id is provided
    serializer = AdvertisementSerializer(advertisements, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def GetAdvertismenet(request, pk):
    advertisement = get_object_or_404(Advertisement, id=pk)
    
    # GET requests are public
    if request.method == 'GET':
        if request.user.is_authenticated and request.user != advertisement.user:
            advertisement.increment_view()
        serializer = AdvertisementSerializer(advertisement)
        return Response(serializer.data)
    
    # For PUT, PATCH and DELETE, require authentication and ownership
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
        
    if advertisement.user != request.user:
        return Response(
            {'error': 'You do not have permission to modify this advertisement'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method in ['PUT', 'PATCH']:
        serializer = AdvertisementSerializer(
            advertisement, 
            data=request.data, 
            context={'request': request},
            partial=request.method == 'PATCH'  # Allow partial updates for PATCH
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        advertisement.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_advertisement(request):
    try:
        images = request.FILES.getlist('images')  # ✅ Get multiple images

        serializer = AdvertisementSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            advertisement = serializer.save(user=request.user)  # ✅ Assign logged-in user

            # ✅ Handle Image Uploads
            image_instances = []
            for index, image in enumerate(images):
                is_primary = index == 0  # ✅ Set first image as primary
                image_instance = Image(advertisement=advertisement, image=image, is_primary=is_primary)
                image_instances.append(image_instance)

            if image_instances:
                Image.objects.bulk_create(image_instances)  # ✅ Bulk create images

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print(f"Error: {e}")  # Debugging
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    # Accept both username and email fields from frontend
    email = request.data.get('email') or request.data.get('username')  # Try both fields
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Please provide both email and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
    except User.DoesNotExist:
        pass
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get user profile data"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_kyc(request, kyc_id):
    if not (request.user.is_staff or request.user.is_superuser):
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        kyc = KYC.objects.get(id=kyc_id)
        kyc.status = 'approved'
        kyc.verified_at = now()
        kyc.approved_by = request.user
        kyc.user.is_verified = True
        kyc.user.verification_type = 'service'
        kyc.user.save()
        kyc.save()
        
        return Response({'message': 'KYC approved successfully'})
    except KYC.DoesNotExist:
        return Response(
            {'error': 'KYC not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['order', 'name']
    ordering = ['order']

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryDetailSerializer
    lookup_field = 'slug'

class SubCategoryListView(generics.ListAPIView):
    serializer_class = SubCategorySerializer

    def get_queryset(self):
        category_slug = self.kwargs['slug']
        return SubCategory.objects.filter(category__slug=category_slug, is_active=True)
    
class FeaturedAdvertisementsView(generics.ListAPIView):
    serializer_class = AdvertisementSerializer

    def get_queryset(self):
        return Advertisement.objects.filter(
            featured=True,
            featured_until__gt=timezone.now(),
            status='active'
        ).order_by('-created_at')

class SearchAdvertisementsView(generics.ListAPIView):
    serializer_class = AdvertisementSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at', 'views_count']

    def get_queryset(self):
        queryset = Advertisement.objects.filter(status='active')
        category = self.request.query_params.get('category', None)
        location = self.request.query_params.get('location', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        condition = self.request.query_params.get('condition', None)

        if category:
            queryset = queryset.filter(
                Q(category__slug=category) | Q(subcategory__slug=category)
            )
        if location:
            queryset = queryset.filter(location__city__icontains=location)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if condition:
            queryset = queryset.filter(condition=condition)

        return queryset

class ReportAdvertisementView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        advertisement_id = self.kwargs.get('pk')
        advertisement = get_object_or_404(Advertisement, id=advertisement_id)
        serializer.save(
            reported_by=self.request.user,
            advertisement=advertisement
        )

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        active_ads = Advertisement.objects.filter(
            user=user, 
            status='active'
        ).count()
        pending_ads = Advertisement.objects.filter(
            user=user, 
            status='pending'
        ).count()
        expired_ads = Advertisement.objects.filter(
            user=user, 
            status='expired'
        ).count()
        total_views = Advertisement.objects.filter(
            user=user
        ).aggregate(Sum('views_count'))['views_count__sum'] or 0

        return Response({
            'active_ads': active_ads,
            'pending_ads': pending_ads,
            'expired_ads': expired_ads,
            'total_views': total_views,
            'is_verified': user.is_verified,
            'joined_date': user.created_at
        })

class OfferViewSet(viewsets.ModelViewSet):
    serializer_class = OfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.filter(
            Q(user=self.request.user) | 
            Q(advertisement__user=self.request.user)
        )

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(
            Q(buyer=self.request.user) | 
            Q(seller=self.request.user)
        )

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_offer(request, pk):
    advertisement = get_object_or_404(Advertisement, pk=pk)
    if advertisement.user == request.user:
        return Response(
            {'error': 'Cannot make offer on your own advertisement'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = OfferSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(
            user=request.user,
            advertisement=advertisement
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pk):
    advertisement = get_object_or_404(Advertisement, pk=pk)
    favorite, created = Favorite.objects.get_or_create(
        user=request.user,
        advertisement=advertisement
    )
    if not created:
        favorite.delete()
        return Response({'status': 'removed'})
    return Response({'status': 'added'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_chat(request, ad_id):
    advertisement = get_object_or_404(Advertisement, id=ad_id)
    
    # Don't allow messaging your own ad
    if advertisement.user == request.user:
        return Response(
            {'error': 'Cannot message your own advertisement'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if chat already exists
    existing_chat = ChatRoom.objects.filter(
        advertisement=advertisement,
        buyer=request.user,
        seller=advertisement.user
    ).first()
    
    if existing_chat:
        # Add new message to existing chat
        ChatMessage.objects.create(
            room=existing_chat,
            sender=request.user,
            message=request.data.get('message')
        )
        serializer = ChatRoomSerializer(existing_chat)
        return Response(serializer.data)
    
    # Create new chat room
    chat_room = ChatRoom.objects.create(
        advertisement=advertisement,
        buyer=request.user,
        seller=advertisement.user
    )
    
    # Create first message
    ChatMessage.objects.create(
        room=chat_room,
        sender=request.user,
        message=request.data.get('message')
    )
    
    # Increment message count
    advertisement.messages_count += 1
    advertisement.save(update_fields=['messages_count'])
    
    # Create notification for seller
    Notification.objects.create(
        user=advertisement.user,
        type='message',
        title='New Message',
        message=f'You have a new message about your listing: {advertisement.title}',
        link=f'/chat/{chat_room.id}'
    )
    
    serializer = ChatRoomSerializer(chat_room)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(is_read=True)
    return Response({'status': 'success'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_messages_count(request):
    count = ChatMessage.objects.filter(
        Q(room__buyer=request.user) | Q(room__seller=request.user),
        is_read=False
    ).exclude(sender=request.user).count()
    
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_notifications_count(request):
    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    
    return Response({'count': count})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_advertisement_stats(request, pk):
    advertisement = get_object_or_404(Advertisement, pk=pk)
    if advertisement.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    stats = {
        'views': advertisement.views_count,
        'saves': advertisement.saved_count,
        'offers': Offer.objects.filter(advertisement=advertisement).count(),
        'messages': ChatRoom.objects.filter(advertisement=advertisement).count(),
        'days_remaining': (advertisement.expires_at - timezone.now()).days if advertisement.expires_at else 0
    }
    
    return Response(stats)

@api_view(['GET'])
def search_advertisements(request):
    queryset = Advertisement.objects.filter(status='active')
    
    # Apply filters
    if 'keyword' in request.GET:
        keyword = request.GET['keyword']
        queryset = queryset.filter(
            Q(title__icontains=keyword) |
            Q(description__icontains=keyword)
        )
    
    if 'location' in request.GET:
        location = request.GET['location']
        queryset = queryset.filter(
            Q(location__city__icontains=location) |
            Q(location__state__icontains=location)
        )
    
    if 'min_price' in request.GET:
        queryset = queryset.filter(price__gte=request.GET['min_price'])
    
    if 'max_price' in request.GET:
        queryset = queryset.filter(price__lte=request.GET['max_price'])
    
    if 'condition' in request.GET:
        queryset = queryset.filter(condition=request.GET['condition'])
    
    # Apply sorting
    sort_by = request.GET.get('sort_by', 'newest')
    if sort_by == 'price_low':
        queryset = queryset.order_by('price')
    elif sort_by == 'price_high':
        queryset = queryset.order_by('-price')
    else:  # newest
        queryset = queryset.order_by('-created_at')
    
    serializer = AdvertisementSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_advertisement_metrics(request, pk):
    advertisement = get_object_or_404(Advertisement, pk=pk)
    
    # Only owner can see metrics
    if advertisement.user != request.user:
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    metrics = {
        'views': advertisement.views_count,
        'messages': advertisement.messages_count,
        'offers': advertisement.offers_count,
        'saves': advertisement.saved_count
    }
    
    return Response(metrics)

@api_view(['GET'])
def get_listing_metrics(request, pk):
    advertisement = get_object_or_404(Advertisement, pk=pk)
    
    # If user is not authenticated or not the owner, return empty metrics
    if not request.user.is_authenticated or request.user != advertisement.user:
        return Response({
            'views': 0,
            'messages': 0,
            'offers': 0
        })
    
    metrics = {
        'views': advertisement.views_count,
        'messages': ChatRoom.objects.filter(advertisement=advertisement).count(),
        'offers': Offer.objects.filter(advertisement=advertisement).count(),
    }
    
    return Response(metrics)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile data"""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        # Handle profile picture separately
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
            user.save()
        
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)