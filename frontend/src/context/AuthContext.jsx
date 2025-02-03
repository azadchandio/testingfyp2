import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
import PropTypes from 'prop-types';

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    loading: false,
    setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            // Optionally verify token and refresh user data
            authService.getProfile()
                .then(userData => {
                    setUser(userData);
                })
                .catch(() => {
                    // If token is invalid, logout
                    logout();
                });
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        authService.logout(); // This will clear localStorage
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            setUser // Expose setUser if you need to update user data
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}; 