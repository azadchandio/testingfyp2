// Products.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { advertisementService } from '../../services/advertisement.service';
import { bookmarkService } from '../../context/AuthContext';
import './Products.css';

const formatTime = (dateString) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - postDate;
  const oneMinute = 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (timeDifference < oneMinute) return "Just now";
  if (timeDifference < oneHour) return `${Math.floor(timeDifference / oneMinute)} min ago`;
  if (timeDifference < oneDay) return `${Math.floor(timeDifference / oneHour)} hr ago`;
  return `${Math.floor(timeDifference / oneDay)} days ago`;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formattedTime, setFormattedTime] = useState(formatTime(product?.created_at || new Date()));
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const checkBookmarkStatus = () => {
        const userBookmarks = bookmarkService.getUserBookmarks(user.id);
        setIsBookmarked(userBookmarks.some(saved => saved.id === product.id));
      };

      checkBookmarkStatus();
      window.addEventListener('storage', checkBookmarkStatus);
      return () => window.removeEventListener('storage', checkBookmarkStatus);
    }
  }, [isAuthenticated, user?.id, product.id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(product?.created_at || new Date()));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [product.created_at]);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const userBookmarks = bookmarkService.getUserBookmarks(user.id);
      let updatedBookmarks;
      
      if (isBookmarked) {
        updatedBookmarks = userBookmarks.filter(saved => saved.id !== product.id);
      } else {
        if (!userBookmarks.some(saved => saved.id === product.id)) {
          updatedBookmarks = [...userBookmarks, product];
        } else {
          updatedBookmarks = userBookmarks;
        }
      }
      
      bookmarkService.saveUserBookmarks(user.id, updatedBookmarks);
      window.dispatchEvent(new Event('storage'));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
  };
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="image-container" onClick={handleCardClick}>
        <img 
          src={product.images && product.images.length > 0 ? `http://127.0.0.1:8000${product.images[0].image_url}` : '/default-image.jpg'} 
          alt={product.title} 
          className="product-image" 
        />
        <button 
          className={`bookmark-button ${isBookmarked ? 'active' : ''}`} 
          onClick={handleBookmark}
          type="button"
        >
          <FontAwesomeIcon 
            icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} 
            className="bookmark-icon"
            style={{ color: isBookmarked ? '#3B5998' : '#9ca3af' }}
          />
        </button>
      </div>
      <div className="content" onClick={handleCardClick}>
        <div className="price">Rs {product.price ? product.price.toLocaleString() : 'N/A'}</div>
        <h3 className="title">{product.title || 'No Title'}</h3>
        <div className="info">
          <div className="location">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>
              {product.location?.city || 'Unknown City'}, 
              {product.location?.state || 'Unknown State'}
            </span>
          </div>
          <div className="time">
            <FontAwesomeIcon icon={faClock} />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await advertisementService.getAllAdvertisements();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="products-container">
      <h2 className="products-title">Latest Products<span className="title-dot">.</span></h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;