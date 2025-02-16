import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BsListCheck } from 'react-icons/bs';
import { BiMessageError } from 'react-icons/bi';
import './Sidebar.css';

const Sidebar = ({ setActiveContent, activeContent }) => {
  const [expandedMenu, setExpandedMenu] = useState('manageListings');
  const [expandedComplaints, setExpandedComplaints] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubMenuClick = (contentName) => {
    setActiveContent(contentName);
  };

  return (
    <div className="sidebar-staff">
      <div className="logo-section-staff">
        <h2 className="logo-staff" onClick={() => navigate('/')}>Auole.</h2>
        <span className="panel-type-staff">Admin Panel</span>
      </div>

      <div className="menu-section-staff">
        {/* Manage Listings Dropdown */}
        <div className="menu-group-staff">
          <div className="menu-header-staff" onClick={() => setExpandedMenu('manageListings')}>
            <BsListCheck className="menu-icon-staff" />
            <span>Manage Listings</span>
            <MdKeyboardArrowDown className={`arrow-icon-staff ${expandedMenu === 'manageListings' ? 'rotated' : ''}`} />
          </div>
          {expandedMenu === 'manageListings' && (
            <div className="submenu-staff">
              <div 
                className={`submenu-item-staff ${activeContent === 'featuredListings' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('featuredListings')}
              >
                <span>Featured Listings</span>
                <span className="badge-staff">23</span>
              </div>
              <div 
                className={`submenu-item-staff ${activeContent === 'activeListings' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('activeListings')}
              >
                <span>Active Listings</span>
                <span className="badge-staff">32</span>
              </div>
              <div 
                className={`submenu-item-staff ${activeContent === 'inactiveListings' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('inactiveListings')}
              >
                <span>Inactive Listings</span>
                <span className="badge-staff">32</span>
              </div>
              <div 
                className={`submenu-item-staff ${activeContent === 'bannedListings' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('bannedListings')}
              >
                <span>Banned Listings</span>
                <span className="badge-staff">14</span>
              </div>
            </div>
          )}
        </div>

        {/* Manage Complaints Dropdown */}
        <div className="menu-group-staff">
          <div className="menu-header-staff" onClick={() => setExpandedComplaints(!expandedComplaints)}>
            <BiMessageError className="menu-icon-staff" />
            <span>Manage Complaints</span>
            <MdKeyboardArrowDown className={`arrow-icon-staff ${expandedComplaints ? 'rotated' : ''}`} />
          </div>
          {expandedComplaints && (
            <div className="submenu-staff">
              <div 
                className={`submenu-item-staff ${activeContent === 'newComplaints' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('newComplaints')}
              >
                <span>New Complaints</span>
                <span className="badge-staff">23</span>
              </div>
              <div 
                className={`submenu-item-staff ${activeContent === 'solvedComplaints' ? 'active' : ''}`}
                onClick={() => handleSubMenuClick('solvedComplaints')}
              >
                <span>Solved Complaints</span>
                <span className="badge-staff ">32</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
