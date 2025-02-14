import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaCommentAlt, FaEdit, FaEllipsisV, FaTrash, FaPause, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { advertisementService } from '../../services/advertisement.service';
import './ManageListings.css';

const ManageListings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state
    const [activeTab, setActiveTab] = useState('all');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const tabs = [
        { id: 'all', label: 'All Listings', count: 0 },
        { id: 'active', label: 'Active Listings', count: 0 },
        { id: 'inactive', label: 'Inactive Listings', count: 0 },
        { id: 'deleted', label: 'Deleted Listings', count: 0 }
    ];

    // Fetch user's listings when the component mounts or the user changes
    useEffect(() => {
      const fetchUserListings = async () => {
          if (user?.id) {
              try {
                  console.log('Fetching listings for user:', user.id); // Debugging
                  const data = await advertisementService.getUserAdvertisements(user.id); // Pass user.id
                  console.log('Listings fetched:', data); // Debugging
                  setListings(data);
                  updateTabCounts(data);
              } catch (error) {
                  console.error('Error fetching listings:', error);
                  setError('Failed to fetch listings. Please try again later.');
              } finally {
                  setLoading(false);
              }
          }
        };
        fetchUserListings();
  
  }, [user]);

    // Update tab counts based on the fetched listings
    const updateTabCounts = (listings) => {
      const counts = {
          all: listings.length,
          active: listings.filter(listing => listing.status === 'active').length,
          inactive: listings.filter(listing => listing.status === 'inactive').length,
          deleted: listings.filter(listing => listing.status === 'deleted').length
      };
  
      tabs.forEach(tab => {
          tab.count = counts[tab.id];
      });
  };

    // Filter listings based on the active tab
    const getFilteredListings = () => {
        if (activeTab === 'all') return listings;
        return listings.filter(listing => listing.status === activeTab);
    };

    // Add click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add these new functions to handle status updates
    const handleStatusUpdate = async (listingId, newStatus) => {
        try {
            setLoading(true);
            const updatedListing = await advertisementService.updateListingStatus(listingId, newStatus);
            
            // Update the local state with the response from the server
            setListings(prevListings => 
                prevListings.map(listing => 
                    listing.id === listingId 
                        ? { ...listing, ...updatedListing }
                        : listing
                )
            );
            
            // Update tab counts with the new listings
            setListings(prevListings => {
                updateTabCounts(prevListings);
                return prevListings;
            });
            
            setActiveDropdown(null);
            
            // Show success message
            alert(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating listing status:', error);
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Failed to update listing status. Please try again.';
            setError(errorMessage);
            // Show error in UI
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                setLoading(true);
                await advertisementService.deleteListing(listingId);
                
                // Remove the listing from local state
                setListings(prevListings => 
                    prevListings.filter(listing => listing.id !== listingId)
                );
                
                // Update tab counts
                updateTabCounts(listings.filter(listing => listing.id !== listingId));
                setActiveDropdown(null);
                
                // Show success message
                alert('Listing deleted successfully');
            } catch (error) {
                console.error('Error deleting listing:', error);
                setError(error.response?.data?.message || 'Failed to delete listing. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Render action buttons based on listing status
    const renderActionButton = (status) => {
        switch (status) {
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

    // Replace the more-options button and add dropdown menu
    const renderMoreOptionsDropdown = (listing) => (
        <div className="more-options-container-managelisting" ref={dropdownRef}>
            <button 
                className="more-options-managelisting"
                onClick={() => setActiveDropdown(activeDropdown === listing.id ? null : listing.id)}
            >
                <FaEllipsisV />
            </button>
            
            {activeDropdown === listing.id && (
                <div className="dropdown-menu-managelisting">
                    {listing.status === 'active' ? (
                        <button 
                            className="dropdown-item-managelisting"
                            onClick={() => handleStatusUpdate(listing.id, 'inactive')}
                        >
                            <FaPause /> Deactivate Listing
                        </button>
                    ) : (
                        <button 
                            className="dropdown-item-managelisting"
                            onClick={() => handleStatusUpdate(listing.id, 'active')}
                        >
                            <FaPlay /> Activate Listing
                        </button>
                    )}
                    <button 
                        className="dropdown-item-managelisting delete"
                        onClick={() => handleDelete(listing.id)}
                    >
                        <FaTrash /> Delete Listing
                    </button>
                </div>
            )}
        </div>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>; // Display error message
    }

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
                                <img 
                                    src={listing.images && listing.images.length > 0 
                                        ? `http://127.0.0.1:8000${listing.images[0].image_url}` 
                                        : '/default-image.jpg'} 
                                    alt={listing.title} 
                                />
                            </div>

                            <div className="listing-content">
                                <div className="listing-header">
                                    <div>
                                        <h2 className="listing-title">{listing.title}</h2>
                                        <span className="listing-category">- In {listing.category}</span>
                                    </div>
                                    <div className="listing-status">
                                        <span className={`status-badge ${listing.status}`}>
                                            {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                                        </span>
                                        {renderMoreOptionsDropdown(listing)}
                                    </div>
                                </div>

                                <div className="listing-details">
                                    <span className="listing-price">Rs {listing.price}</span>
                                    <div className="listing-meta">
                                        <span>{listing.location?.city || 'N/A'}</span>
                                        <span className="separator">|</span>
                                        <span>Posted on {new Date(listing.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="listing-stats">
                                <div className="stat">
                                    <FaEye />
                                    <span>{listing.stats?.views || 0} Views</span>
                                </div>
                                <div className="stat">
                                    <FaCommentAlt />
                                    <span>{listing.stats?.offers || 0} Offers</span>
                                </div>
                                <div className="stat">
                                    <FaCommentAlt />
                                    <span>{listing.stats?.messages || 0} Messages</span>
                                </div>
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