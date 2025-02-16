import React, { useState } from 'react';
import { FiUsers, FiMonitor, FiBarChart2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ setActiveContent }) => {
  const [expandedMenu, setExpandedMenu] = useState('userManagement');

  const handleMenuClick = (menuName) => {
    console.log('Menu clicked:', menuName);
    setExpandedMenu(menuName);
    setActiveContent(menuName);
  };

  const handleSubMenuClick = (content) => {
    setActiveContent(content);
    console.log('Active content changed to:', content);
  };

  return (
    <div className="super-admin-sidebar">
      <div className="super-admin-logo-section">
        <h1 className="super-admin-logo">Auole</h1>
        <p className="super-admin-subtitle">Super Admin Panel</p>
      </div>

      <nav className="super-admin-sidebar-nav">
        {/* User Management Section */}
        <div className="super-admin-nav-section">
          <div 
            className={`super-admin-nav-item ${expandedMenu === 'userManagement' ? 'active' : ''}`}
            onClick={() => handleMenuClick('userManagement')}
          >
            <div className="super-admin-nav-item-header">
              <FiUsers className="super-admin-nav-icon" />
              <span>User Management</span>
              {expandedMenu === 'userManagement' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
          
          {expandedMenu === 'userManagement' && (
            <div className="super-admin-submenu">
              <div 
                className="super-admin-submenu-item"
                onClick={() => handleSubMenuClick('adminAccounts')}
              >
                <span>Admin Accounts</span>
                <span className="super-admin-badge">23</span>
              </div>
              <div 
                className="super-admin-submenu-item"
                onClick={() => handleSubMenuClick('addNewAdmin')}
              >
                <span>Add New Admin</span>
              </div>
              <div 
                className="super-admin-submenu-item"
                onClick={() => handleSubMenuClick('bannedAdmins')}
              >
                <span>Banned Admins</span>
              </div>
              <div 
                className="super-admin-submenu-item"
                onClick={() => handleSubMenuClick('manageBuyersSellers')}
              >
                <span>Manage Buyers/Sellers</span>
                <span className="super-admin-badge"> </span>
              </div>
              <div 
                className="super-admin-submenu-item"
                onClick={() => handleSubMenuClick('bannedBuyersSellers')}
              >
                <span>Banned Buyers/Sellers</span>
              </div>
            </div>
          )}
        </div>

        {/* Monitor Admin Activity Section */}
        <div className="super-admin-nav-section">
          <div 
            className={`super-admin-nav-item ${expandedMenu === 'monitorActivity' ? 'active' : ''}`}
            onClick={() => handleMenuClick('monitorActivity')}
          >
            <div className="super-admin-nav-item-header">
              <FiMonitor className="super-admin-nav-icon" />
              <span>Monitor Admin Activity</span>
              {expandedMenu === 'monitorActivity' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>

        {/* Reports & Analytics Section */}
        <div className="super-admin-nav-section">
          <div 
            className="super-admin-nav-item"
            onClick={() => handleSubMenuClick('reports')}
          >
            <div className="super-admin-nav-item-header">
              <FiBarChart2 className="super-admin-nav-icon" />
              <span>Reports & Analytics</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;