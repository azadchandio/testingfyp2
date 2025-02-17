#classifieds/urls.py

from django.urls import path, include
from .views import  AdvertisementListView ,AdvertisementUpdateView,GetAdvertismenet, OfferViewSet, ChatViewSet, NotificationViewSet, LocationListCreateView, LocationDetailView, LocationSearchView,get_condition_choices,CountryListView,CityListView, StateListView, ImageUploadView
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'offers', OfferViewSet, basename='offer')
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'notifications', NotificationViewSet, basename='notification')     

urlpatterns = [
    
    path('advertisements/', AdvertisementListView, name='advertisements'),
    path('advertisements/<int:pk>/', GetAdvertismenet, name='advertisement'),
    path('advertisements/create/', views.create_advertisement, name='create-advertisement'),

    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.get_user_profile, name='user-profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('kyc/approve/<int:kyc_id>/', views.approve_kyc, name='approve_kyc'),
    path('kyc/submit/', views.submit_kyc, name='submit_kyc'),

    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<slug:slug>/subcategories/', views.SubCategoryListView.as_view(), name='subcategory-list'),
    
    path('advertisements/featured/', views.FeaturedAdvertisementsView.as_view(), name='featured-ads'),
    # path('advertisements/search/', views.SearchAdvertisementsView.as_view(), name='search-ads'),
    path('advertisements/<int:pk>/report/', views.ReportAdvertisementView.as_view(), name='report-ad'),
    path('condition-choices/', get_condition_choices, name='condition-choices'),
    # path('api/advertisements/conditions/', views.get_condition_choices, name='condition-choices'),

    path('user/dashboard/', views.UserDashboardView.as_view(), name='user-dashboard'),
    path('', include(router.urls)),
    path('advertisements/<int:pk>/make-offer/', views.make_offer, name='make-offer'),
    path('advertisements/<int:pk>/toggle-favorite/', views.toggle_favorite, name='toggle-favorite'),
    path('chat/start/<int:ad_id>/', views.start_chat, name='start-chat'),
    path('notifications/mark-read/', views.mark_notifications_read, name='mark-notifications-read'),
    path('messages/unread/count/', views.get_unread_messages_count, name='unread-messages-count'),
    path('notifications/unread/count/', views.get_unread_notifications_count, name='unread-notifications-count'),
    path('advertisements/<int:pk>/stats/', views.get_advertisement_stats, name='advertisement-stats'),
    path('advertisements/<int:pk>/metrics/', views.get_advertisement_metrics, name='advertisement-metrics'),
    path('advertisements/<int:pk>/listing-metrics/', views.get_listing_metrics, name='listing-metrics'),
    path('chats/', views.ChatViewSet.as_view({'get': 'list'}), name='chat-list'),
    path('chats/<int:pk>/messages/', views.ChatViewSet.as_view({
        'get': 'messages',
        'post': 'send_message'
    }), name='chat-messages'),

    path('locations/', LocationListCreateView.as_view(), name='location-list-create'),
    path('locations/<int:pk>/', LocationDetailView.as_view(), name='location-detail'),
    path('locations/search/', LocationSearchView.as_view(), name='location-search'),
    path('locations/countries/', CountryListView.as_view(), name='country-list'),
    path('locations/states/<str:country>/', StateListView.as_view(), name='state-list'),
    path('locations/cities/<str:country>/<str:state>/', CityListView.as_view(), name='city-list'),
    path('advertisements/search/', views.search_advertisements, name='search-advertisements'),
    path('advertisements/<int:pk>/update/', AdvertisementUpdateView.as_view(), name='advertisement-update'),

]
