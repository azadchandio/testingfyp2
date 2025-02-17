import api from './api';

import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api/advertisements/';

export const advertisementService = {
    getAllAdvertisements: async () => {
        try {
          const response = await axios.get(API_URL);
          return response.data;
        } catch (error) {
          console.error('Error fetching advertisements:', error);
          return [];
        }
      },

    // Fetch advertisements posted by the logged-in user
    getUserAdvertisements: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                params: { user_id: userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user advertisements:', error);
            throw error;
        }
    },
    
    
    getAdvertisement: async (id) => {
        const response = await fetch(`/api/advertisements/${id}/`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Product not found');
            }
            throw new Error('Failed to fetch product details');
        }
        return response.json();
    },

    createAdvertisement: async (formData) => {
        const response = await api.post('/advertisements/create/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },

    searchAdvertisements: async (params) => {
        const response = await api.get('/advertisements/search/', {
            params
        });
        return response.data;
    },

    getFeaturedAds: async () => {
        const response = await api.get('/advertisements/featured/');
        return response.data;
    },

    toggleFavorite: async (id) => {
        const response = await api.post(`/advertisements/${id}/favorite/`);
        return response.data;
    },

    reportAdvertisement: async (id, reason) => {
        const response = await api.post(`/advertisements/${id}/report/`, {
            reason
        });
        return response.data;
    },

    getFavorites: async () => {
        const response = await api.get('/advertisements/favorites/');
        return response.data;
    },

    makeOffer: async (id, amount, message) => {
        const response = await api.post(`/advertisements/${id}/offer/`, {
            amount,
            message
        });
        return response.data;
    },

    getUnreadMessagesCount: async () => {
        const response = await api.get('/messages/unread/count/');
        return response.data;
    },

    getUnreadNotificationsCount: async () => {
        const response = await api.get('/notifications/unread/count/');
        return response.data;
    },

    markMessageRead: async (messageId) => {
        const response = await api.post(`/messages/${messageId}/read/`);
        return response.data;
    },

    markAllNotificationsRead: async () => {
        const response = await api.post('/notifications/mark-all-read/');
        return response.data;
    },

    getAdvertisementStats: async (id) => {
        const response = await api.get(`/advertisements/${id}/stats/`);
        return response.data;
    },

    getMessages: async () => {
        const response = await api.get('/messages/');
        return response.data;
    },

    sendMessage: async (roomId, message) => {
        const response = await api.post(`/messages/${roomId}/`, {
            message
        });
        return response.data;
    },

    searchWithFilters: async (filters) => {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.query) queryParams.append('keyword', filters.query);
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.minPrice) queryParams.append('min_price', filters.minPrice);
            if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
            if (filters.condition) queryParams.append('condition', filters.condition);
            if (filters.sortBy) queryParams.append('sort_by', filters.sortBy);

            const response = await axios.get(`${API_URL}search/?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error searching advertisements:', error);
            return [];
        }
    },

    getListingMetrics: async (id) => {
        try {
            const response = await fetch(`/api/advertisements/${id}/listing-metrics/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Metrics not available');
            }
            return response.json();
        } catch (error) {
            console.log('Failed to fetch metrics:', error);
            return null;
        }
    },

    updateListingStatus: async (listingId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}${listingId}/`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating listing status:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteListing: async (listingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${API_URL}${listingId}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting listing:', error.response?.data || error.message);
            throw error;
        }
    },

    getAdvertisementById: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching advertisement:', error);
            throw error;
        }
    },

    updateAdvertisement: async (id, data) => {
        try {
            console.log("Sending PATCH request with data:", data); // Debug log
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.patch(
                `${API_URL}${id}/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Don't set Content-Type when sending FormData
                        // axios will set it automatically with the correct boundary
                    },
                }
            );
            console.log("PATCH response:", response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error updating advertisement:', error.response || error);
            throw error;
        }
    },
};