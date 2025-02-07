#classifieds/urls.py

from django.urls import path, include
from .views import  AdvertisementListView ,GetAdvertismenet, OfferViewSet, ChatViewSet, NotificationViewSet
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
    path('profile/', views.get_user_profile, name='profile'),
    path('kyc/approve/<int:kyc_id>/', views.approve_kyc, name='approve_kyc'),

    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<slug:slug>/subcategories/', views.SubCategoryListView.as_view(), name='subcategory-list'),
    
    path('advertisements/featured/', views.FeaturedAdvertisementsView.as_view(), name='featured-ads'),
    path('advertisements/search/', views.SearchAdvertisementsView.as_view(), name='search-ads'),
    path('advertisements/<int:pk>/report/', views.ReportAdvertisementView.as_view(), name='report-ad'),

    path('user/dashboard/', views.UserDashboardView.as_view(), name='user-dashboard'),
    path('', include(router.urls)),
    path('advertisements/<int:pk>/make-offer/', views.make_offer, name='make-offer'),
    path('advertisements/<int:pk>/toggle-favorite/', views.toggle_favorite, name='toggle-favorite'),
    path('chat/start/<int:ad_id>/', views.start_chat, name='start-chat'),
    path('notifications/mark-read/', views.mark_notifications_read, name='mark-notifications-read'),
    path('messages/unread/count/', views.get_unread_messages_count, name='unread-messages-count'),
    path('notifications/unread/count/', views.get_unread_notifications_count, name='unread-notifications-count'),
    path('advertisements/<int:pk>/stats/', views.get_advertisement_stats, name='advertisement-stats'),
]
