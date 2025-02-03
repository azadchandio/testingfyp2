import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaEye, FaTags, FaCommentAlt, FaPencilAlt } from 'react-icons/fa'; 
import './ProductScreen.css';

const ProductScreen = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/advertisements/${productId}/`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const seller = product.user || {};
  const image = Array.isArray(product.image) ? product.image : []; // Ensure images is always an array

  return (
    <div className="body">
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="product-image-section">
            <img src={`http://127.0.0.1:8000${product.images[0].image_url}`} alt={product.title} className="product-image" />
          </div>
          <div className="product-info-section">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">Rs {product.price.toLocaleString()}</p>

            <div className="feature-section">
              <div className="feature-metrics">
                <div className="metric-item">
                  <FaEye size="1.5em" className="metric-icon" />
                  <div>
                    <span className="metric-value">{seller.views}</span>
                    <span className="metric-label"> Views</span>
                  </div>
                </div>
                <div className="metric-item">
                  <FaTags size="1.5em" className="metric-icon" />
                  <div>
                    <span className="metric-value">{seller.offers}</span>
                    <span className="metric-label"> Offers</span>
                  </div>
                </div>
                <div className="metric-item">
                  <FaCommentAlt size="1.5em" className="metric-icon" />
                  <div>
                    <span className="metric-value">{seller.messages}</span>
                    <span className="metric-label"> Messages</span>
                  </div>
                </div>
              </div>

              <button className="feature-button">Feature This Listing</button>
              <button className="edit-button">
                <FaPencilAlt className="edit-icon" /> Edit Now
              </button>
            </div>
          </div>
        </div>
        <div className="seller-info-section">
          <div className="seller-info-card">
            {seller.image && <img src={seller.image} alt={seller.name || 'Seller'} className="seller-image" />}
          </div>
          <div className="seller-details">
          <p>Listing Posted By</p>
          {seller.name && <p className="seller-name">{seller.name}</p>} {/* Access seller.name */}
          {seller.phone_number && <p className="seller-contact">{seller.phone_number}</p>} {/* Access seller.contact */}
        </div>

        </div>

        <div className="product-description">
          <p className="seller-description-title">Description</p>
          {product.description && <p className="seller-description">{product.description}</p>}
        </div>

        <div className="relevant-products">
          <p className="relevant-products-title">Relevant Products</p>
          <div className="relevant-product-list">
            {/* You can fetch and display related products here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
