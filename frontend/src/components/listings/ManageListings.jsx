import React, { useState } from 'react';
import { FaEye, FaCommentAlt, FaEdit, FaEllipsisV } from 'react-icons/fa';
import './ManageListings.css';
import { useNavigate } from 'react-router-dom';

const ManageListings = () => {
    const navigate = useNavigate();  
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Listings', count: 3 },
    { id: 'active', label: 'Active Listings', count: 1 },
    { id: 'inactive', label: 'Inactive Listings', count: 2 },
    { id: 'deleted', label: 'Deleted Listings', count: 0 }
  ];

  const listings = [
    {
      id: 1,
      title: '2018 Vauxhall Grandland',
      category: 'Vehicles',
      price: 'Rs 89,00,000',
      location: 'Hyderabad, Pakistan',
      postedDate: '01 Nov',
      status: 'active',
      stats: {
        views: 2499,
        offers: 54,
        messages: 12
      }
    },
    {
      id: 1,
      title: '2018 Vauxhall Grandland',
      category: 'Vehicles',
      price: 'Rs 89,00,000',
      location: 'Hyderabad, Pakistan',
      postedDate: '01 Nov',
      status: 'active',
      stats: {
        views: 2499,
        offers: 54,
        messages: 12
      }
    },
    // Add more listings with different statuses
  ];

  const getFilteredListings = () => {
    if (activeTab === 'all') return listings;
    return listings.filter(listing => listing.status === activeTab);
  };

  const renderActionButton = (status) => {
    switch(status) {
      case 'active':
        return <button className="feature-button">Feature This Listing</button>;
      case 'inactive':
        return <button className="republish-button">Republish Now</button>;
      case 'deleted':
        return <button className="recover-button">Recover Now</button>;
      default:
        return null;
    }
  };

  return (
    <div className="manage-listings-wrapper">
      <div className="manage-listings-container">
        <h1 className="listings-heading">
          Manage Your Listings<span className="dot">.</span>
        </h1>

        <div className="listings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="listings-grid">
          {getFilteredListings().map(listing => (
            <div key={listing.id} className="listing-card">
              <div className="listing-image">
                <img src={listing.image} alt={listing.title} />
              </div>
              
              <div className="listing-content">
                <div className="listing-header">
                  <div>
                    <h2 className="listing-title">{listing.title}</h2>
                    <span className="listing-category">- In {listing.category}</span>
                  </div>
                  <div className="listing-status">
                    <span className={`status-badge ${listing.status}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                    <button className="more-options">
                      <FaEllipsisV />
                    </button>
                  </div>
                </div>

                <div className="listing-details">
                  <span className="listing-price">{listing.price}</span>
                  <div className="listing-meta">
                    <span>{listing.location}</span>
                    <span className="separator">|</span>
                    <span>Posted on {listing.postedDate}</span>
                  </div>
                </div>

                <div className="listing-stats">
                  <div className="stat">
                    <FaEye />
                    <span>{listing.stats.views} Views</span>
                  </div>
                  <div className="stat">
                    <FaCommentAlt />
                    <span>{listing.stats.offers} Offers</span>
                  </div>
                  <div className="stat">
                    <FaCommentAlt />
                    <span>{listing.stats.messages} Messages</span>
                  </div>
                  <button 
                  onClick={() => navigate('/listing/details/:categoryId/:subCategory')}
                  className="edit-button" 
                  
                  >
                   <FaEdit />
                    Edit Now
                  </button>
                </div>

                {renderActionButton(listing.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageListings; 