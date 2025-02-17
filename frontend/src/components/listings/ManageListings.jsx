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
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [tabCounts, setTabCounts] = useState({
        all: 0,
        active: 0,
        inactive: 0,
        deleted: 0
    });
    const dropdownRef = useRef(null);

    const tabs = [
        { id: 'all', label: 'All Listings', count: tabCounts.all },
        { id: 'active', label: 'Active Listings', count: tabCounts.active },
        { id: 'inactive', label: 'Inactive Listings', count: tabCounts.inactive },
        { id: 'deleted', label: 'Deleted Listings', count: tabCounts.deleted }
    ];

    // Update tab counts based on the current listings
    const updateTabCounts = (currentListings) => {
        const counts = {
            all: currentListings.length,
            active: currentListings.filter(listing => listing.status === 'active').length,
            inactive: currentListings.filter(listing => listing.status === 'inactive').length,
            deleted: currentListings.filter(listing => listing.status === 'deleted').length
        };
        setTabCounts(counts);
    };

    // Fetch user's listings when component mounts
    useEffect(() => {
        const fetchUserListings = async () => {
            if (user?.id) {
                try {
                    const data = await advertisementService.getUserAdvertisements(user.id);
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

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter listings based on active tab
    const getFilteredListings = () => {
        if (activeTab === 'all') return listings;
        return listings.filter(listing => listing.status === activeTab);
    };

    // Handle status update
    const handleStatusUpdate = async (listingId, newStatus) => {
        try {
            setLoading(true);
            await advertisementService.updateListingStatus(listingId, newStatus);
            
            const updatedListings = listings.map(listing => 
                listing.id === listingId 
                    ? { ...listing, status: newStatus }
                    : listing
            );
            
            setListings(updatedListings);
            updateTabCounts(updatedListings);
            setActiveDropdown(null);
            
            alert(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating listing status:', error);
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Failed to update listing status. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                setLoading(true);
                await advertisementService.deleteListing(listingId);
                
                const updatedListings = listings.filter(listing => listing.id !== listingId);
                setListings(updatedListings);
                updateTabCounts(updatedListings);
                setActiveDropdown(null);
                
                alert('Listing deleted successfully');
            } catch (error) {
                console.error('Error deleting listing:', error);
                setError(error.response?.data?.message || 'Failed to delete listing. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle edit
    const handleEdit = (listing) => {
        navigate(`/listing/edit/${listing.id}`);
        setActiveDropdown(null);
    };

    // Update renderActionButton to include both feature and edit buttons
    const renderActionButton = (listing) => {
        const buttons = [];
        
        // Add appropriate feature button based on status
        switch (listing.status) {
            case 'active':
                buttons.push(
                    <button key="feature" className="feature-button">Feature This Listing</button>
                );
                break;
            case 'inactive':
                buttons.push(
                    <button key="republish" className="republish-button">Republish Now</button>
                );
                break;
            case 'deleted':
                buttons.push(
                    <button key="recover" className="recover-button">Recover Now</button>
                );
                break;
        }
        
        // Add edit button
        buttons.push(
            <button 
                key="edit" 
                className="edit-button"
                onClick={() => handleEdit(listing)}
            >
                <FaEdit /> Edit Now
            </button>
        );
        
        return <div className="action-buttons-container">{buttons}</div>;
    };

    // Update renderMoreOptionsDropdown to remove edit option
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
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
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
                            <div className="listing-image" >
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
                                        <span className="listing-category">
                                            - In {listing.category?.name || listing.category_name || 'Uncategorized'}
                                        </span>
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

                                {renderActionButton(listing)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageListings;