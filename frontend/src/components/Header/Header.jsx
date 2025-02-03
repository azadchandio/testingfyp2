import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Check login status on component mount and listen for changes to localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      console.log('User from localStorage:', user); // Log to verify data
      setIsLoggedIn(true);
      setUserName(user.name || 'User'); // Set userName from stored user data
    } else {
      setIsLoggedIn(false);
      setUserName(''); // Reset userName if no data is found
    }
  }, []); // This will run only on initial load (if needed, add dependencies)

  const handleLogin = (userData) => {
    // Simulate login with real user data (replace this with actual login logic)
    console.log('Logging in user:', userData); // Check the user data being passed in
    localStorage.setItem('token', 'your_token_here'); // Replace with actual login logic
    localStorage.setItem('user', JSON.stringify(userData)); // Store real user data
  
    // Update state to reflect the login
    setIsLoggedIn(true);
    setUserName(userData.name || 'User');
  
    // Redirect to home or dashboard page after login
    navigate('/');
  };

  const handleLogout = () => {
    // Handle logout logic here, clear the localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update state to reflect the logout
    setIsLoggedIn(false);
    setUserName(''); // Reset username on logout

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <Link to="/" title="home">
              logo
            </Link>
          </div>

          {/* Right Side Icons and Buttons */}
          <div className="header-icons">
            {/* Listing icon */}
            <div className="icon">
              <Link to="/saved-listings">listings</Link>
            </div>

            {/* Message icon */}
            <div className="icon">message</div>

            {/* Notification icon */}
            <div className="icon">notification</div>

            {/* Sell Now button */}
            <button className="sell_now_btn">
              <Link to="/listing/select-category">sell now</Link>
            </button>

            {isLoggedIn ? (
              <div className="user-section">
                <button
                  className="account-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {userName} {/* This should now correctly display the username */}
                  <svg width="18" height="12" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13L25 1" stroke="white" strokeWidth="2.5" />
                  </svg>
                </button>
                <UserDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={handleLogout} // Pass logout function to dropdown
                />
              </div>
            ) : (
              <button className="register_btn" onClick={handleLogin}>
                <Link to="/register" title="Register now">
                  register/login
                </Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
