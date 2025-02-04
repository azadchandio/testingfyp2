import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaBookmark, FaEdit, FaStar, FaEye, FaEnvelope, FaHandshake } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { FaGreaterThan } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { advertisementService } from "../../services/advertisement.service";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // New state for additional listing metrics
  const [listingMetrics, setListingMetrics] = useState({
    views: 0,
    offers: 0,
    messages: 0
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await advertisementService.getAdvertisement(id);
        setProduct(data);

        // Fetch listing metrics only if the current user is the ad owner
        if (isAuthenticated && user?.id === data.user?.id) {
          try {
            const metrics = await advertisementService.getListingMetrics(id);
            setListingMetrics(metrics);
          } catch (metricsError) {
            console.error("Failed to fetch listing metrics:", metricsError);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, isAuthenticated, user]);

  // Handlers for image carousel
  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length === 0) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // New method to handle edit listing
  const handleEditListing = () => {
    navigate(`/edit-listing/${id}`);
  };

  // New method to feature listing
  const handleFeatureListing = async () => {
    try {
      await advertisementService.featureListing(id);
      // Optionally show a success message or update UI
      alert("Listing featured successfully!");
    } catch (error) {
      console.error("Failed to feature listing:", error);
      alert("Failed to feature listing. Please try again.");
    }
  };

  // Handler for sending a message
  const handleSendMessage = () => {
    navigate(`/messages/${id}`);
  };

  // Handler for sending an offer
  const handleSendOffer = () => {
    navigate(`/send-offer/${id}`);
  };

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>{error}</div>;

  // Check if current user is the ad owner
  const isAdOwner = isAuthenticated && user?.id === product.user?.id;

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
            {!isAdOwner && (
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
            )}



            {/* Listing Metrics for Ad Owner */}
            {isAdOwner && (
              <div className="listing-metrics">
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-icon-wrapper">
                      <FaEye className="metric-icon" />
                    </div>
                    <div className="metric-content">
                      <strong>{listingMetrics.views}</strong>
                      <span>Views</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon-wrapper">
                      <FaHandshake className="metric-icon" />
                    </div>
                    <div className="metric-content">
                      <strong>{listingMetrics.offers}</strong>
                      <span>Offers</span>
                    </div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-icon-wrapper">
                      <FaEnvelope className="metric-icon" />
                    </div>
                    <div className="metric-content">
                      <strong>{listingMetrics.messages}</strong>
                      <span>Messages</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Conditional Action Buttons */}
            <div className="action-buttons">
              {isAdOwner ? (
                <>
                  <button className="message-btn feature-btn" onClick={handleFeatureListing}>
                    <FaStar /> Feature This Listing
                  </button>
                  <button className="offer-btn edit-btn" onClick={handleEditListing}>
                    <FaEdit /> Edit Listing
                  </button>
                </>
              ) : (
                <>
                  <button className="message-btn" onClick={handleSendMessage}>
                    <LuMessageSquareMore /> Message Now
                  </button>
                  <button className="offer-btn" onClick={handleSendOffer}>
                    <CiDollar /> Send an Offer
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Seller Information */}
          <div className="seller-info">
            <div className="seller-profile">
              <img
                src={`http://127.0.0.1:8000${product.user?.profile_picture}`}
                alt={product.user?.name}
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