import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaListUl, FaQuestionCircle, FaCog, FaSignOutAlt, FaEnvelope, FaBell } from 'react-icons/fa';
import './UserDropdown.css';
import profile from '../../assets/car.png';
import { advertisementService } from '../../services/advertisement.service';

const UserDropdown = ({ isOpen, onClose }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user from AuthContext

  // Improved user data handling
  const userData = {
    name: user?.name || localStorage.getItem('userName') || 'Guest User',
    avatar: user?.avatar || localStorage.getItem('userAvatar') || profile,
    email: user?.email || localStorage.getItem('userEmail') || ''
  };

  // Add useEffect to fetch unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const [messages, notifications] = await Promise.all([
          advertisementService.getUnreadMessagesCount(),
          advertisementService.getUnreadNotificationsCount()
        ]);
        setUnreadMessages(messages.count);
        setUnreadNotifications(notifications.count);
      } catch (error) {
        console.error('Error fetching unread counts:', error);
      }
    };

    if (user) {
      fetchUnreadCounts();
    }
  }, [user]);

  const menuItems = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: <FaUser />,
      action: () => navigate('/edit-profile')
    },
    {
      id: 'my-listings',
      label: 'My Listings',
      icon: <FaListUl />,
      action: () => navigate('/manage-listings')
    },
    {
      id: 'help-support',
      label: 'Help & Support',
      icon: <FaQuestionCircle />,
      action: () => navigate('/help-support')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog />,
      action: () => navigate('/settings')
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <FaEnvelope />,
      badge: unreadMessages,
      action: () => navigate('/messages')
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <FaBell />,
      badge: unreadNotifications,
      action: () => navigate('/notifications')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <FaSignOutAlt />,
      action: () => {
        logout(); // Use the logout function from AuthContext
        navigate('/login');
        onClose();
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="dropdown-overlay" onClick={onClose}>
      <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
        {/* User Info Section */}
        <div className="user-info">
          <div className="avatar">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              onError={(e) => { e.target.src = profile; }} // Fallback to default profile if image fails
            />
          </div>
          <div className="user-details">
            <p className="greeting">Hi, Welcome</p>
            <h3 className="username">{userData.name}</h3>
            <p className="user-email">{userData.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-items">
          {menuItems.map(item => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="badge">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

UserDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default UserDropdown;