import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import './Products.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if product is bookmarked on component mount
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    setIsBookmarked(savedProducts.some(saved => saved.id === product.id));
  }, [product.id]);

  const handleBookmark = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark
    const savedProducts = JSON.parse(localStorage.getItem('savedProducts')) || [];
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedSaved = savedProducts.filter(saved => saved.id !== product.id);
      localStorage.setItem('savedProducts', JSON.stringify(updatedSaved));
      setIsBookmarked(false);
    } else {
      // Add to bookmarks
      savedProducts.push(product);
      localStorage.setItem('savedProducts', JSON.stringify(savedProducts));
      setIsBookmarked(true);
    }
  };

  return (
    <div className="product-card">
      {/* ... existing code ... */}
      <button 
        className={`bookmark-button ${isBookmarked ? 'active' : ''}`} 
        onClick={handleBookmark}
      >
        <FontAwesomeIcon icon={faBookmark} className="bookmark-icon" />
      </button>
    </div>
  );
};

// ... existing code ...