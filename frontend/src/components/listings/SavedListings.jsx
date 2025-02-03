import React from 'react';
import { Link } from 'react-router-dom';
import './SavedListings.css';

const SavedListings = () => {
  const savedListing = {
    id: 1,
    title: '2018 Vauxhall Grandland',
    category: 'Vehicles',
    price: 'Rs 89,90,000',
    location: 'Hyderabad, Pakistan',
    postedDate: '01 Nov',
    image: '/path-to-car-image.jpg' // Replace with actual image path
  };

  return (
    <div className="saved-listings-wrapper">
      <div className="saved-listings-container">
        <h1 className="listings-heading">
          Saved Listings<span className="dot">.</span>
        </h1>

        <div className="listings-tabs">
          <button className="tab-button active">Saved Listings</button>
        </div>

        <div className="listings-grid">
          <div className="listing-card">
            <div className="listing-image">
              <img src={savedListing.image} alt={savedListing.title} />
            </div>
            <div className="listing-content">
              <div className="listing-header">
                <h2 className="listing-title">
                  <Link to={`/listing/${savedListing.id}`}>
                    {savedListing.title}
                  </Link>
                </h2>
                <span className="listing-category">- In {savedListing.category}</span>
              </div>
              
              <div className="listing-details">
                <span className="listing-price">{savedListing.price}</span>
                <div className="listing-meta">
                  <span className="listing-location">{savedListing.location}</span>
                  <span className="separator">|</span>
                  <span className="listing-date">Posted on {savedListing.postedDate}</span>
                </div>
              </div>

              <button className="remove-button">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedListings; 