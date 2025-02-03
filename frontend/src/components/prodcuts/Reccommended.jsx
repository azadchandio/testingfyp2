import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faLocationDot, faClock } from '@fortawesome/free-solid-svg-icons';
import productsData from './products.json';
import './Reccommended.css'; // Import the external CSS file

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <div className="product-reccommended-card">
      {/* Image Container */}
      <div className="image-reccommended-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-reccommended-image"
        />
      </div>

      {/* Content Container */}
      <div className="content-reccommended-container">
        {/* Price */}
        <div className="product-reccommended-price">
          {formatPrice(product.price)}
        </div>

        {/* Title */}
        <h3 className="product-reccommended-title">
          {product.title}
        </h3>

        {/* Location and Time */}
        <div className="product-reccommended-info">
          <div className="info-reccommended-item">
            <FontAwesomeIcon icon={faLocationDot} className="icon" />
            <span>{product.location}</span>
          </div>

          <div className="info-reccommended-item">
            <FontAwesomeIcon icon={faClock} className="icon" />
            <span>{product.timePosted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reccommended = () => {
  return (
    <div className="recommended-container">
      {/* Section Title */}
      <h2 className="section-reccommended-title">
        Recommended Products<span className="highlight">.</span>
      </h2>

      {/* Products Grid */}
      <div className="products-reccommended-grid">
        {productsData.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Reccommended;
