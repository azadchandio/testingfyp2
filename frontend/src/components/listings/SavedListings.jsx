// SavedListings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { bookmarkService } from '../../context/AuthContext';
import './SavedListings.css';

const SavedListings = () => {
  const { user, isAuthenticated } = useAuth();
  const [savedProducts, setSavedProducts] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const loadSavedProducts = () => {
        const userBookmarks = bookmarkService.getUserBookmarks(user.id);
        setSavedProducts(userBookmarks);
      };

      loadSavedProducts();
      window.addEventListener('storage', loadSavedProducts);
      return () => window.removeEventListener('storage', loadSavedProducts);
    }
  }, [isAuthenticated, user?.id]);

  const handleRemove = (productId) => {
    if (!user?.id) return;

    const updatedSaved = savedProducts.filter(product => product.id !== productId);
    bookmarkService.saveUserBookmarks(user.id, updatedSaved);
    setSavedProducts(updatedSaved);
    window.dispatchEvent(new Event('storage'));
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
          {savedProducts.map((product) => (
            <div className="listing-card" key={product.id}>
              <div className="listing-image">
                <img 
                  src={product.images && product.images.length > 0 
                    ? `http://127.0.0.1:8000${product.images[0].image_url}` 
                    : '/default-image.jpg'} 
                  alt={product.title} 
                />
              </div>
              <div className="listing-content">
                <div className="listing-header">
                  <h2 className="listing-title">
                    <Link to={`/product/${product.id}`}>
                      {product.title}
                    </Link>
                  </h2>
                </div>
                
                <div className="listing-details">
                  <span className="listing-price">Rs {product.price.toLocaleString()}</span>
                  <div className="listing-meta">
                    <span className="listing-location">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {product.location?.city}, {product.location?.country}
                    </span>
                  </div>
                </div>

                <button 
                  className="remove-button"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedListings; 