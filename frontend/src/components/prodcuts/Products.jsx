import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import './Products.css';
import { useNavigate } from 'react-router-dom';

// Format time function outside of the component
const formatTime = (dateString) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - postDate; // in milliseconds

  // 1 minute = 60 seconds * 1000 milliseconds
  const oneMinute = 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (timeDifference < oneMinute) {
    return "Just now"; // If posted less than 1 minute ago
  } else if (timeDifference < oneHour) {
    // Show time in minutes (if within the last hour)
    const minutesAgo = Math.floor(timeDifference / oneMinute);
    return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < oneDay) {
    // Show time in hours (if within the last 24 hours)
    const hoursAgo = Math.floor(timeDifference / oneHour);
    return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
  } else {
    // Show the full date (if older than 24 hours)
    const daysAgo = Math.floor(timeDifference / oneDay);
    if (daysAgo === 1) {
      return `1 day ago`;
    } else {
      return `${daysAgo} days ago`;
    }
  }
};

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const [formattedTime, setFormattedTime] = useState(formatTime(product.created_at)); // State for formatted time

  // Update the formatted time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(product.created_at)); // Update the time every minute
    }, 60000); // Update every 60 seconds (1 minute)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [product.created_at]);

  const navigate = useNavigate();
  let count = 1;

  const goToProductScreen = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={goToProductScreen}>
      <div className="image-container">
        <img
          src={`http://127.0.0.1:8000${product.image[0].image_url}`} // Use the image_url from the API response
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="content">
        <div className="price">{formatPrice(product.price)}</div>
        <h3 className="title">{product.title}</h3>
        <div className="info">
          <div className="location">
            <FontAwesomeIcon icon={faLocationDot} />
            {/* Render the location details */}
            <span>{product.location?.city}, {product.location?.state}, {product.location?.country}</span>
          </div>
          <div className="time">
            <FontAwesomeIcon icon={faClock} />
            <span>{formattedTime}</span> {/* Use the formatted time */}
          </div>
        </div>
      </div>

      <button className="bookmark-button">
        <FontAwesomeIcon icon={faBookmark} className="bookmark-icon" />
      </button>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/advertisements/');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching advertisements:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="products-container">
      <h2 className="products-title">
        Latest Products<span className="title-dot">.</span>
      </h2>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
