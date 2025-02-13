import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaBookmark, FaEdit, FaStar, FaEye, FaEnvelope, FaHandshake, FaTimes } from "react-icons/fa";
import { LuMessageSquareMore } from "react-icons/lu";
import { CiDollar } from "react-icons/ci";
import { FaGreaterThan } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { advertisementService } from "../../services/advertisement.service";
import { messageService } from "../../services/message.service";
import "./ProductDetail.css";

const MessageModal = ({ onClose, onSubmit, loading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
  };

  return (
    <div className="message-modal-overlay">
      <div className="message-modal">
        <div className="modal-header">
          <h3>Send Message</h3>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            required
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="send-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch product details
        const productData = await advertisementService.getAdvertisement(id);
        setProduct(productData);
        setLoading(false);

        // Fetch metrics separately - if it fails, it won't affect product display
        try {
          const metricsData = await advertisementService.getListingMetrics(id);
          setMetrics(metricsData);
        } catch (metricsError) {
          console.log('Metrics not available:', metricsError);
          // Don't set error state - just continue without metrics
        }
      } catch (err) {
        setError("Product not found");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    // Navigate to ListingDetails with edit mode
    navigate(`/listing/details/${product.category_id}/${product.subcategory_id}?edit=${id}`);
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

  const handleMessageSubmit = async (message) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSendingMessage(true);
      await messageService.startChat(product.id, message);
      setShowMessageModal(false);
      // Show success notification
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Move isAdOwner check into a function to handle null cases safely
  const checkIsAdOwner = () => {
    if (!user || !product || !product.user) return false;
    return isAuthenticated && user.id === product.user.id;
  };

  // Separate buttons for owner and non-owner with null checks
  const renderActionButtons = () => {
    if (!product) return null; // Don't render buttons if product isn't loaded

    if (!user) {
      // Not logged in - show message button that redirects to login
      return (
        <button 
          className="message-button"
          onClick={() => navigate('/login')}
        >
          <FaEnvelope /> Message Seller
        </button>
      );
    }

    if (checkIsAdOwner()) {
      // Owner sees edit button
      return (
        <div className="owner-actions">
          <button 
            className="edit-button"
            onClick={() => navigate(`/listing/edit/${product.id}`)}
          >
            <FaEdit /> Edit Listing
          </button>
          <button 
            className="feature-button"
            onClick={handleFeatureListing}
          >
            <FaStar /> Feature Listing
          </button>
        </div>
      );
    }

    // Logged in non-owner sees message and offer buttons
    return (
      <div className="buyer-actions">
        <button 
          className="message-button"
          onClick={() => setShowMessageModal(true)}
        >
          <FaEnvelope /> Message Seller
        </button>
        <button 
          className="offer-button"
          onClick={handleSendOffer}
        >
          <CiDollar /> Make Offer
        </button>
      </div>
    );
  };

  // Render seller info with null checks
  const renderSellerInfo = () => {
    if (!product || !product.user) return null;

    return (
      <div className="seller-info">
        <div className="seller-profile">
          <img
            src={product.user.profile_picture 
              ? `http://127.0.0.1:8000${product.user.profile_picture}`
              : '/default-avatar.png'} // Add a default avatar image
            alt={product.user.name || 'Seller'}
            className="seller-avatar"
          />
          <div className="seller-details">
            <p className="section-label">Listing Posted By</p>
            <h3 className="seller-name">{product.user.name || 'Anonymous'}</h3>
            {product.user.contact_phone && (
              <p className="seller-phone">{product.user.contact_phone}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMessageButton = () => {
    if (!isAuthenticated) {
      return (
        <button 
          className="message-button"
          onClick={() => navigate('/login')}
        >
          <FaEnvelope /> Message Seller
        </button>
      );
    }

    if (user?.id !== product?.user?.id) {
      return (
        <button 
          className="message-button"
          onClick={() => setShowMessageModal(true)}
        >
          <FaEnvelope /> Message Seller
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product not found</h2>
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">
          <FaGreaterThan />
        </span>
        <span className="current">{product?.title || 'Loading...'}</span>
      </div>

      {/* Product Detail Container */}
      {product && (
        <div className="product-detail-container">
          <div className="product-main">
            {/* Image Carousel */}
            <div className="product-image-detail">
              {product.images?.length > 0 ? (
                <>
                  <button className="prev-button" onClick={handlePrevImage}>{"<"}</button>
                  <img
                    src={`http://127.0.0.1:8000${product.images[currentImageIndex]?.image_url}`}
                    alt={`${product.title} - ${currentImageIndex + 1}`}
                  />
                  <button className="next-button" onClick={handleNextImage}>{">"}</button>
                </>
              ) : (
                <div className="no-image">No images available</div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-title">{product.title}</h1>
              <div className="product-price">
                Rs {product.price?.toLocaleString() || '0'}
              </div>

              {/* Meta Information */}
              {!checkIsAdOwner() && (
                <div className="product-meta">
                  <div className="meta-top">
                    <div className="location">
                      <FaMapMarkerAlt />
                      <span>
                        {product.location?.city || 'N/A'}, 
                        {product.location?.state || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="posted-time">
                    <FaClock />
                    <span>Posted {new Date(product.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {/* Listing Metrics for Ad Owner */}
              {checkIsAdOwner() && (
                <div className="listing-metrics">
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <FaEye className="metric-icon" />
                      </div>
                      <div className="metric-content">
                        <strong>{metrics?.views || 0}</strong>
                        <span>Views</span>
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <FaHandshake className="metric-icon" />
                      </div>
                      <div className="metric-content">
                        <strong>{metrics?.offers || 0}</strong>
                        <span>Offers</span>
                      </div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-icon-wrapper">
                        <FaEnvelope className="metric-icon" />
                      </div>
                      <div className="metric-content">
                        <strong>{metrics?.messages || 0}</strong>
                        <span>Messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="action-buttons">
                {renderActionButtons()}
              </div>
            </div>

            {/* Seller Information */}
            {renderSellerInfo()}

            {/* Product Description */}
            <div className="product-description">
              <h2 className="section-title">Description</h2>
              <p className="description-text">{product.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          onClose={() => setShowMessageModal(false)}
          onSubmit={handleMessageSubmit}
          loading={sendingMessage}
        />
      )}
    </div>
  );
};

export default ProductDetail;