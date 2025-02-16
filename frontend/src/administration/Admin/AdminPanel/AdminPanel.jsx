import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import Sidebar from '../Sidebar/Sidebar';
import ListingsTable from '../ListingTable/ListingTable';
import ManageComplaints from '../ManageComplaints/ManageComplaints'; // Import the new component
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeContent, setActiveContent] = useState('featuredListings');

  const renderContent = () => {
    switch(activeContent) {
      case 'featuredListings':
        return <ListingsTable type="featured" title="Featured Listings" count="23" />;
      case 'activeListings':
        return <ListingsTable type="active" title="Active Listings" count="32" />;
      case 'inactiveListings':
        return <ListingsTable type="inactive" title="Inactive Listings" count="32" />;
      case 'bannedListings':
        return <ListingsTable type="banned" title="Banned Listings" count="12" />;
        case 'newComplaints':
          return <ManageComplaints type="newComplaints" />;
        case 'solvedComplaints':
          return <ManageComplaints type="solvedComplaints" />;
        default:
          return <ListingsTable type="featuredListings" title="Featured Listings" count={23} />;
      }
  };

  return (
    <div className="admin-container-staff">
      <Sidebar setActiveContent={setActiveContent} activeContent={activeContent} />
      <div className="main-content-staff">
        <div className="header-admin-staff">
          <h1 className="welcome-text-staff">
            Welcome to Admin Panel
            <span className="subtitle-staff">(Only For Admins)</span>
          </h1>
          <div className="header-actions-staff">
            <div className="notification-staff">
              <FiBell className="bell-icon-staff" />
              <span className="notif-badge-staff">1</span>
            </div>
            <div className="profile-pic-staff"></div>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;