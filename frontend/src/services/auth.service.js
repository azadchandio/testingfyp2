import api from './api';

const register = async (email, name, password, password2) => {
    try {
        // Log the data being sent
        console.log('Registration data being sent:', {
            email,
            name,
            password,
            password2
        });

        const response = await api.post('register/', {
            email,
            name,
            password,
            password2
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log('Server error response:', error.response.data);
            
            // Handle Django validation errors
            if (error.response.data) {
                const errorMessage = Object.entries(error.response.data)
                    .map(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            return `${field}: ${errors.join(', ')}`;
                        }
                        return `${field}: ${errors}`;
                    })
                    .join('\n');
                throw new Error(errorMessage || 'Registration failed');
            }
        }
        throw new Error('Registration failed: ' + (error.message || 'Unknown error'));
    }
};
const login = async (username, password) => {
    try {
        const response = await api.post('login/', {
            username,
            password
        });
        
        // Ensure both access and refresh tokens are stored
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

const getProfile = async () => {
    try {
        const response = await api.get('profile/');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

export const authService = {
    register,
    login,
    getProfile,
    logout
};