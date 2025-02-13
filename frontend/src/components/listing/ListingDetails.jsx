import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { advertisementService } from "../../services/advertisement.service";
import './ListingDetails.css';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  price: '',
  brand: '',
  condition: '',
  model: '',
  year: '',
  location: '',
  contact_phone: '',
  show_phone: false,
  allow_offers: true,
  negotiable: true,
  images: [],
  category: '',
  subcategory: ''
};

const MAX_IMAGES = 6;

const ListingDetails = () => {
  const navigate = useNavigate();
  const { categoryId, subCategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadCategoryData(),
          isEditMode && loadListingData()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors(prev => ({ ...prev, loading: 'Failed to load data' }));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId, subCategoryId, editId, isEditMode]);

  const loadCategoryData = async () => {
    try {
      const [categoryResponse, subcategoryResponse] = await Promise.all([
        fetch(`/api/categories/${categoryId}/`),
        fetch(`/api/categories/${categoryId}/subcategories/`)
      ]);

      if (!categoryResponse.ok || !subcategoryResponse.ok) {
        throw new Error('Failed to fetch category data');
      }

      const categoryData = await categoryResponse.json();
      const subcategoriesData = await subcategoryResponse.json();
      
      setCategoryName(categoryData.name);
      const subcategory = subcategoriesData.find(sub => sub.id === parseInt(subCategoryId));
      
      if (subcategory) {
        setSubcategoryName(subcategory.name);
        setFormData(prev => ({
          ...prev,
          category: categoryId,
          subcategory: subCategoryId
        }));
      }
    } catch (error) {
      throw new Error('Error loading category data: ' + error.message);
    }
  };

  const loadListingData = async () => {
    try {
      const listingData = await advertisementService.getAdvertisement(editId);
      setFormData(prev => ({
        ...prev,
        ...listingData,
        price: listingData.price?.toString() || '',
        year: listingData.year?.toString() || '',
        images: []
      }));
    } catch (error) {
      throw new Error('Error loading listing data: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_IMAGES) {
      setErrors(prev => ({ ...prev, images: `You can only upload up to ${MAX_IMAGES} images` }));
      return;
    }

    // Clean up previous preview URLs
    previewImages.forEach(url => URL.revokeObjectURL(url));

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
    setFormData(prev => ({ ...prev, images: files }));
    
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'description', 'price', 'contact_phone', 'location'];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    const price = parseFloat(formData.price.replace(/,/g, ''));
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach(image => formDataToSend.append('images', image));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const endpoint = isEditMode 
        ? `/api/advertisements/${editId}/update/`
        : '/api/advertisements/create/';
        
      const response = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to save listing');
      }

      const data = await response.json();
      navigate(`/product/${data.id}`);
    } catch (error) {
      console.error('Error saving listing:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save listing' }));
    } finally {
      setLoading(false);
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
          category={{ id: categoryId, name: categoryName }}
          subCategory={{ id: subCategoryId, name: subcategoryName }}
        />
        
        <button onClick={handleBack} className="back-button">
          ← Back to Categories
        </button>

        <h1 className="listing-heading">
          {isEditMode ? 'Edit Your Listing' : 'Enter Your Listing Details'}
          <span className="dot">.</span>
        </h1>

        {errors.loading && (
          <div className="error-message global-error">{errors.loading}</div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          {/* Category and Subcategory fields */}
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={categoryName}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Subcategory</label>
            <input
              type="text"
              value={subcategoryName}
              disabled
              className="disabled-input"
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Upload Images* (Max {MAX_IMAGES})</label>
            <div className="image-upload-container">
              <label className="image-upload-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden-input"
                />
                <div className="upload-label">
                  <FiUpload size={24} />
                  <span>Click to upload images</span>
                </div>
              </label>
              {errors.images && <span className="error-message">{errors.images}</span>}
              <div className="image-previews">
                {previewImages.map((url, index) => (
                  <div key={index} className="preview-box">
                    <img src={url} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-group">
            <label>Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter listing title"
              maxLength={100}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your item"
              maxLength={2000}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Price and Location */}
          <div className="form-row">
            <div className="form-group">
              <label>Price*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          {/* Brand and Model */}
          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand"
              />
            </div>

            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Enter model"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-group">
            <label>Contact Phone*</label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            {errors.contact_phone && <span className="error-message">{errors.contact_phone}</span>}
          </div>

          {/* Checkboxes */}
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="show_phone"
                checked={formData.show_phone}
                onChange={handleInputChange}
              />
              Show phone number in listing
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="allow_offers"
                checked={formData.allow_offers}
                onChange={handleInputChange}
              />
              Allow offers
            </label>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleInputChange}
              />
              Price is negotiable
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Listing' : 'Create Listing')}
          </button>
          
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
        </form>
      </div>
    </div>
  );
};

export default ListingDetails;
