import React from 'react';
import VerificationBadge from '../common/VerificationBadge';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <div className="user-profile">
        {user.profile_picture_url ? (
          <img 
            src={user.profile_picture_url} 
            alt={user.name} 
            className="profile-image"
          />
        ) : (
          <div className="profile-placeholder">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="user-details">
          <div className="user-name-wrapper">
            <h3>{user.name}</h3>
            {user.is_verified && <VerificationBadge />}
          </div>
          <p className="user-email">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 