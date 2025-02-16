import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import AdminAccounts from '../AdminAccounts/AdminAccounts'; // You'll need to create these components
import AddNewAdmin from '../AddNewAdmin/AddNewAdmin';
import BannedAdmins from '../BannedAdmins/BannedAdmins';
import ManageBuyersSellers from '../ManageBuyersSellers/ManageBuyersSellers';
import BannedBuyersSellers from '../BannedBuyersSellers/BannedBuyersSellers';
import MonitorActivity from '../MonitorActivity/MonitorActivity';
import Reports from '../ReportsAnalytics/ReportsAnalytics';
import { FiBell } from 'react-icons/fi';
import './SuperAdminPanel.css';

const SuperAdminPanel = () => {
  const [activeContent, setActiveContent] = useState('adminAccounts');

  console.log('Current activeContent:', activeContent);

  const renderContent = () => {
    console.log('Rendering content for:', activeContent);
    switch(activeContent) {
      case 'adminAccounts':
        return <AdminAccounts />;
      case 'addNewAdmin':
        return <AddNewAdmin />;
      case 'bannedAdmins':
        return <BannedAdmins />;
      case 'manageBuyersSellers':
        return <ManageBuyersSellers />;
      case 'bannedBuyersSellers':
        return <BannedBuyersSellers />;
      case 'monitorActivity':
        return <MonitorActivity />;
      case 'reports':
        return <Reports />;
      default:
        return <AdminAccounts />;
    }
  };

  return (
    <div className="super-admin-container">
      <Sidebar setActiveContent={setActiveContent} />
      <div className="super-admin-main-content">
        <header className="super-admin-main-header">
          <h1 className="super-admin-welcome-text">
            Welcome to Super Admin Panel 
            <span className="super-admin-owner-tag">(Only For Owners)</span>
          </h1>
          <div className="super-admin-header-actions">
            <div className="super-admin-notification-badge">
              <FiBell className="super-admin-bell-icon" />
              <span className="super-admin-badge">1</span>
            </div>
            <div className="super-admin-profile-avatar"></div>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
};

export default SuperAdminPanel;