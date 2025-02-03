import api from './api';

export const advertisementService = {
    getAllAdvertisements: async () => {
        const response = await api.get('/advertisements/');
        return response.data;
    },

    getAdvertisement: async (id) => {
        const response = await api.get(`/advertisements/${id}/`);
        return response.data;
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

    getUserAdvertisements: async () => {
        const response = await api.get('/advertisements/user/');
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
        const response = await api.get('/advertisements/search/', {
            params: filters
        });
        return response.data;
    }
};