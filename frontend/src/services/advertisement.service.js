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

    createAdvertisement: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'images') {
                data.images.forEach(image => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, data[key]);
            }
        });
        const response = await api.post('/advertisements/', formData);
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

    // getUserAdvertisements: async () => {
    //     const response = await api.get('/advertisements/user/');
    //     return response.data;
    // },

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
        const response = await api.get('/advertisements/search/', {
            params: filters
        });
        return response.data;
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

    updateAdvertisement: async (id, data) => {
        const response = await fetch(`/api/advertisements/${id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update advertisement');
        return response.json();
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
};