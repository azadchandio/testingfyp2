import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as needed
import UserDropdown from './UserDropdown';
import { FaRegCommentDots, FaBell, FaPlusCircle, FaSignInAlt } from 'react-icons/fa'; // Import React Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBookmark } from '@fortawesome/free-solid-svg-icons'; // Import Bookmark icon
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use the AuthContext to get authentication state
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Use the logout method from AuthContext
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-header" onClick={()=> navigate('/')}>
              Auole <span className='logo-dot'>.</span>
          </div>

          {/* Right Side Icons and Buttons */}
          <div className="header-icons">
            {/* Bookmark (Saved Listings) icon */}
            <div className="icon" onClick={() => navigate('/saved-listings')}>
              <FontAwesomeIcon icon={faBookmark} className="icon-style" /> 
            </div>

            {/* Message icon */}
            <div className="icon" onClick={() => navigate('/messages')}>
              <FaRegCommentDots className="icon-style" /> 
            </div>

            {/* Notification icon */}
            <div className="icon" onClick={() => navigate('/notifications')}>
              <FaBell className="icon-style" /> 
            </div>

            {/* Sell Now button */}
            <button className="sell_now_btn" onClick={() => navigate('/listing/select-category')}>
              <FaPlusCircle className="icon-style" /> Sell Now
            </button>

            {isAuthenticated ? (
              <div className="user-section">
                <button
                  className="account-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user?.name || 'User'} {/* Display user name */}
                  <svg width="18" height="12" viewBox="0 0 26 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13L25 1" stroke="white" strokeWidth="2.5" />
                  </svg>
                </button>
                <UserDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
            <button className="register_btn" onClick={() => navigate('/register')}>
              <FaSignInAlt className="icon-style" /> Login
            </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
