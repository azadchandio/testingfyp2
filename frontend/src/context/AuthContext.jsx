// AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
import PropTypes from 'prop-types';

// First create the bookmark service
const getBookmarkKey = (userId) => `bookmarks_${userId}`;

const bookmarkService = {
    getUserBookmarks: (userId) => {
        try {
            const key = getBookmarkKey(userId);
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (error) {
            console.error('Error getting bookmarks:', error);
            return [];
        }
    },

    saveUserBookmarks: (userId, bookmarks) => {
        try {
            const key = getBookmarkKey(userId);
            localStorage.setItem(key, JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    },

    clearUserBookmarks: (userId) => {
        try {
            const key = getBookmarkKey(userId);
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error clearing bookmarks:', error);
        }
    }
};

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    loading: true,
    isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                
                if (token && storedUser) {
                    // Validate token by fetching profile
                    const userData = await authService.getProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                // Token is invalid or expired
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {

        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            isAuthenticated,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

// Also export the bookmark service so it can be used in other components
export { bookmarkService };