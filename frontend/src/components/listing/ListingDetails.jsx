import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './ListingDetails.css';

// Categories data
const categories = {
  mobiles: 'Mobiles',
  vehicles: 'Vehicles',
  properties: 'Properties Rent & Sell',
  electronics: 'Electronics & Gadgets',
  bikes: 'Bikes',
  furniture: 'Furniture & Decor',
  fashion: 'Fashion & Clothing',
  computer: 'Computer & Laptop',
  jobs: 'Jobs',
  kids: 'Kids Toys'
};

const subCategoriesData = {
  mobiles: [
    { id: 'mobile-phones', name: 'Mobile Phones' },
    { id: 'tablets', name: 'Tablets' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'smart-watches', name: 'Smart Watches' },
  ],
  vehicles: [
    { id: 'cars', name: 'Cars' },
    { id: 'buses', name: 'Buses' },
    { id: 'trucks', name: 'Trucks' },
    { id: 'spare-parts', name: 'Spare Parts' },
  ],
  // ... add other subcategories as needed
};

const ListingDetails = () => {
  const navigate = useNavigate();
  const { categoryId, subCategoryId } = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    brand: '',
    condition: '',
    title: '',
    description: '',
    price: '',
    tags: '',
    phone: '',
    name: '',
    showPhone: false,
    images: []
  });

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        if (categoryId && subCategoryId) {
          const categoryName = categories[categoryId] || '';
          const subCategories = subCategoriesData[categoryId] || [];
          const subCategory = subCategories.find(sub => sub.id === subCategoryId);
          const subCategoryName = subCategory ? subCategory.name : '';

          setFormData(prev => ({
            ...prev,
            category: categoryName,
            subCategory: subCategoryName
          }));
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId, subCategoryId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Price validation
    const price = parseFloat(formData.price.replace(/,/g, ''));
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    // Handle image upload logic
    const file = e.target.files[0];
    if (file) {
      // Add your image upload logic here
      console.log('Image uploaded:', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/listing/published');
    }
  };

  const handleBack = () => {
    navigate(`/listing/subcategory/${categoryId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="listing-details-wrapper">
      <div className="listing-details-container">
        <Breadcrumb 
          category={{ id: categoryId, name: formData.category }}
          subCategory={{ id: subCategoryId, name: formData.subCategory }}
        />
        
        <button onClick={handleBack} className="back-button">
          ← Back to Categories
        </button>

        <h1 className="listing-heading">
          Enter Your Listing Details<span className="dot">.</span>
        </h1>

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-row">
            <div className="form-group">
              <label>Category*</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="form-group">
              <label>Sub Category*</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Images*</label>
            <div className="image-upload-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="image-upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id={`image-${index}`}
                    hidden
                  />
                  <label htmlFor={`image-${index}`}>
                    <FiUpload className="upload-icon" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand*</label>
              <select 
                name="brand" 
                value={formData.brand} 
                onChange={handleInputChange}
                className={errors.brand ? 'error' : ''}
              >
                <option value="">Select Brand</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Other">Other</option>
              </select>
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>

            <div className="form-group">
              <label>Condition*</label>
              <select 
                name="condition" 
                value={formData.condition} 
                onChange={handleInputChange}
                className={errors.condition ? 'error' : ''}
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
              {errors.condition && <span className="error-message">{errors.condition}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Listing Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter listing title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write here"
              rows="6"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price*</label>
              <div className="price-input">
                <span className="currency">Rs</span>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className={errors.price ? 'error' : ''}
                />
              </div>
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Related Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Add tags (comma separated)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Your Phone*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Your Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="showPhone"
              checked={formData.showPhone}
              onChange={handleInputChange}
              id="showPhone"
            />
            <label htmlFor="showPhone">Show my phone number on this listing.</label>
          </div>

          <button type="submit" className="publish-button">
            Publish Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListingDetails;