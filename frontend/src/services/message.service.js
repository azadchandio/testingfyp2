export const messageService = {
    startChat: async (advertisementId, message) => {
        try {
            const response = await fetch(`/api/chat/start/${advertisementId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            return response.json();
        } catch (error) {
            console.error('Error starting chat:', error);
            throw error;
        }
    },

    getChats: async () => {
        const response = await fetch('/api/chats/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch chats');
        return response.json();
    },

    getChatMessages: async (chatId) => {
        const response = await fetch(`/api/chats/${chatId}/messages/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    sendMessage: async (chatId, message) => {
        const response = await fetch(`/api/chats/${chatId}/messages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },
}; 