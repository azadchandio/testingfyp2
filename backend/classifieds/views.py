from rest_framework import status
from django.shortcuts import get_object_or_404, render
from django.utils.timezone import now
from django.db.models import Q
from django.utils import timezone
from django.db.models import Sum

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer
from .models import User, Advertisement, KYC, Category,SubCategory, Offer, ChatRoom, Notification, Favorite, ChatMessage
from .serializers import AdvertisementSerializer, CategorySerializer, SubCategorySerializer, CategoryDetailSerializer, OfferSerializer, ChatMessageSerializer, NotificationSerializer
from rest_framework import generics, filters, viewsets
from rest_framework.views import APIView
from .serializers import ReportSerializer

@api_view(['GET'])
def AdvertisementListView(Request):
    advertisements = Advertisement.objects.all()
    serializer = AdvertisementSerializer(advertisements, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetAdvertismenet(request,pk):
    advertisement = get_object_or_404(Advertisement, id=pk)
    serializer = AdvertisementSerializer(advertisement, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_advertisement(request):
    try:
        serializer = AdvertisementSerializer(data=request.data, context={'request': request})  # ✅ Pass context
        if serializer.is_valid():
            print(f"Authenticated User: {request.user}")
            serializer.save(user=request.user)  # Assign logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Debugging line
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error: {e}")  # Debugging line
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
    if advertisement.user == request.user:
        return Response(
            {'error': 'Cannot start chat with yourself'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    chat_room, created = ChatRoom.objects.get_or_create(
        advertisement=advertisement,
        buyer=request.user,
        seller=advertisement.user
    )
    
    return Response({
        'room_id': chat_room.id,
        'created': created
    })

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