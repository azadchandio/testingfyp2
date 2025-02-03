import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBullhorn } from 'react-icons/fa'; // Replace FaMegaphone with FaBullhorn
import './ListingPublished.css';

const ListingPublished = () => {
  const navigate = useNavigate();

  return (
    <div className="published-wrapper">
      <div className="published-container">
        <div className="published-content">
          <div className="megaphone-icon">
            <FaBullhorn /> {/* Replace FaMegaphone with FaBullhorn */}
          </div>
          
          <h1 className="published-heading">
            Your Listing Published<span className="exclamation">!</span>
          </h1>
          
          <p className="published-message">
            Your Listing Published Successfully. Can you now make it featured
            to make it sell faster.
          </p>
          
          <div className="action-buttons">
            <button 
              className="view-listing-btn"
              onClick={() => navigate('/manage-listings')}
            >
              View Listing
            </button>
            
            <button 
              className="feature-listing-btn"
              onClick={() => navigate('/feature-listing')}
            >
              Get It Make Featured Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPublished;
