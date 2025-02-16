import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header-staff">
      <div className="header-title-staff">
        <h1>Welcome to Admin Panel</h1>
        <span>(Only For Admins)</span>
      </div>
      <div className="header-actions-staff">
        <div className="notifications-staff">
          <i className="icon-notification-staff"></i>
        </div>
        <div className="profile-pic-staff">
          <img src="/path-to-profile-pic.jpg" alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Header;