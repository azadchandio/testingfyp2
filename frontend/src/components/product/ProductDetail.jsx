import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaBookmark } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { FaGreaterThan } from "react-icons/fa6";
import { advertisementService } from "../../services/advertisement.service"; // Importing the service
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await advertisementService.getAdvertisement(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>{error}</div>;

  // Handlers for image carousel
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">
          <FaGreaterThan />
        </span>
        <span className="current">{product.title}</span>
      </div>

      {/* Product Detail Container */}
      <div className="product-detail-container">
        {/* Main Content */}
        <div className="product-main">
          {/* Image Carousel */}
          <div className="product-image-detail">
            <button className="prev-button" onClick={handlePrevImage}>
              {"<"}
            </button>
            {product.images?.length > 0 && (
              <img
                src={`http://127.0.0.1:8000${product.images[currentImageIndex]?.image_url}`}
                alt={`${product.title} - ${currentImageIndex + 1}`}
              />
            )}
            <button className="next-button" onClick={handleNextImage}>
              {">"}
            </button>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price">Rs {product.price.toLocaleString()}</div>

            {/* Meta Information */}
            <div className="product-meta">
              <div className="meta-top">
                <div className="location">
                  <FaMapMarkerAlt />
                  <span>
                    {product.location?.city}, {product.location?.state},{" "}
                    {product.location?.country}
                  </span>
                </div>
                <button className="save-button">
                  <FaBookmark />
                </button>
              </div>
              <div className="posted-time">
                <FaClock />
                <span>Posted {product.created_at}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="message-btn">
                <LuMessageSquareMore /> Message Now
              </button>
              <button className="offer-btn">
                <CiDollar /> Send an Offer
              </button>
            </div>
          </div>

          {/* Seller Information */}
          <div className="seller-info">
            <div className="seller-profile">
              <img
                src={`http://127.0.0.1:8000${product.user?.profile_picture}`}
                alt={product.seller?.name}
                className="seller-avatar"
              />
              <div className="seller-details">
                <p className="section-label">Listing Posted By</p>
                <h3 className="seller-name">{product.user?.name}</h3>
                <p className="seller-phone">{product.user?.contact_phone}</p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="product-description">
            <h2 className="section-title">Description</h2>
            <p className="description-text">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
