import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import { advertisementService } from '../../services/advertisement.service';

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
  
  if (!product) return null; // Prevent rendering if product is undefined

  const [formattedTime, setFormattedTime] = useState(formatTime(product.created_at || new Date()));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(product.created_at || new Date()));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [product.created_at]);

  return (
    <div className="product-card" >
      <div className="image-container" onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.images && product.images.length > 0 ? `http://127.0.0.1:8000${product.images[0].image_url}` : '/default-image.jpg'} 
          alt={product.title} 
          className="product-image" 
        />
      </div>
      <div className="content" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="price">Rs {product.price ? product.price.toLocaleString() : 'N/A'}</div>
        <h3 className="title">{product.title || 'No Title'}</h3>
        <div className="info">
          <div className="location">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>
              {product.location?.city || 'Unknown City'}, 
              {product.location?.state || 'Unknown State'}, 
              {product.location?.country || 'Unknown Country'}
            </span>
          </div>
          <div className="time">
            <FontAwesomeIcon icon={faClock} />
            <span>{formattedTime}</span>
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
        const data = await advertisementService.getAllAdvertisements();
        console.log('Fetched Products:', data); // Debugging line
        setProducts(data);
      } catch (error) {
        console.log('Error fetching advertisements:', error);
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
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};

export default Products;
