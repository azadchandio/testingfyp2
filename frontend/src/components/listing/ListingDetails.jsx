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
  location: {
    country: '',
    state: '',
    city: ''
  },
  contact_phone: '',
  show_phone: false,
  allow_offers: true,
  negotiable: true,
  images: [],
  category: '',
  subcategory: ''
};

const MAX_IMAGES = 6;

const CONDITION_CHOICES = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [conditionChoices, setConditionChoices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadCategoryData(),
          loadConditionChoices(), // Ensure this is called
          isEditMode && loadListingData(),
          loadLocationData()
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

    // New function to load condition choices
    const loadConditionChoices = async () => {
      try {
        const response = await fetch('/api/condition-choices/');
        if (!response.ok) throw new Error('Failed to fetch conditions');
        const data = await response.json();
    
        // Check if data is an array
        if (Array.isArray(data)) {
          setConditionChoices(data);
        } else {
          // If we get an object format, convert it to array format
          const formattedChoices = Object.entries(data).map(([value, label]) => ({
            value,
            label
          }));
          setConditionChoices(formattedChoices);
        }
      } catch (error) {
        console.error('Error loading conditions:', error);
        // Fallback to default choices if the API fails
        setConditionChoices(CONDITION_CHOICES);
        setErrors(prev => ({ ...prev, loading: 'Failed to load conditions' }));
      }
    };

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
    
    console.log('Category Data:', categoryData);
    console.log('Subcategories Data:', subcategoriesData);
    
    setCategoryName(categoryData.name);
    const subcategory = subcategoriesData.find(sub => sub.id === parseInt(subCategoryId));
    
    if (subcategory) {
      setSubcategoryName(subcategory.name);
      setFormData(prev => ({
        ...prev,
        category: parseInt(categoryId),
        subcategory: parseInt(subCategoryId)
      }));
    }
  } catch (error) {
    console.error('Error loading category data:', error);
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

const loadLocationData = async () => {
  try {
    const response = await fetch('/api/locations/search/');
    if (!response.ok) throw new Error('Failed to fetch locations');
    const data = await response.json();
    console.log('Location Data:', data);
    
    // Extract unique values for dropdowns
    const uniqueCountries = [...new Set(data.map(loc => loc.country))];
    setCountries(uniqueCountries);

    // If editing, also set states and cities for the selected location
    if (formData.location.country) {
      const countryLocations = data.filter(loc => loc.country === formData.location.country);
      const uniqueStates = [...new Set(countryLocations.map(loc => loc.state))];
      setStates(uniqueStates);

      if (formData.location.state) {
        const stateLocations = countryLocations.filter(loc => loc.state === formData.location.state);
        const uniqueCities = [...new Set(stateLocations.map(loc => loc.city))];
        setCities(uniqueCities);
      }
    }
  } catch (error) {
    console.error('Error loading locations:', error);
    setErrors(prev => ({ ...prev, loading: 'Failed to load locations' }));
  }
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'price') {
      // Only allow numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else if (name === 'year') {
      // Only allow numbers
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, country, state: '', city: '' }
    }));

    try {
      const response = await fetch(`/api/locations/search/?country=${country}`);
      if (!response.ok) throw new Error('Failed to fetch states');
      const data = await response.json();
      const uniqueStates = [...new Set(data.map(loc => loc.state))];
      setStates(uniqueStates);
      setCities([]);
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, state, city: '' }
    }));

    try {
      const response = await fetch(`/api/locations/search/?country=${formData.location.country}&state=${state}`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      const uniqueCities = [...new Set(data.map(loc => loc.city))];
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, city }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['title', 'description', 'price', 'contact_phone', 'condition'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Category validation
    if (!formData.category || !formData.subcategory) {
      newErrors.category = 'Category and subcategory are required';
    }

    // Location validation
    if (!formData.location.country) newErrors.country = 'Country is required';
    if (!formData.location.state) newErrors.state = 'State is required';
    if (!formData.location.city) newErrors.city = 'City is required';

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    // Price validation
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("clicked")
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const formDataToSend = new FormData();
  
    try {
      // Get location ID
      const locationResponse = await fetch(
        `/api/locations/search/?country=${formData.location.country}&state=${formData.location.state}&city=${formData.location.city}`
      );
      
      if (!locationResponse.ok) {
        throw new Error('Failed to find location');
      }
  
      const locations = await locationResponse.json();
      if (!locations || locations.length === 0) {
        throw new Error('Location not found. Please select a valid location.');
      }
  
      const locationId = locations[0].id;
  
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images separately
          value.forEach(image => {
            formDataToSend.append('images', image);
          });
        } else if (key === 'location') {
          formDataToSend.append('location', locationId);
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Make the API call
      const apiUrl = isEditMode 
        ? `/api/advertisements/${editId}/`
        : '/api/advertisements/create/';

      const response = await fetch(apiUrl, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create listing');
      }
  
      const data = await response.json();
      console.log('Listing created:', data);
      alert('Your listing has been successfully created!');
      navigate('/');
    } catch (error) {
      console.error('Error saving listing:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error.message || 'Failed to save listing'
      }));
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

            <div className="form-group location-fields">
              <label>Location Details*</label>
              <div className="form-row">
                <div className="form-group">
                  <select
                    className="form-select"
                    value={formData.location.country}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>

                <div className="form-group">
                  <select
                    className="form-select"
                    value={formData.location.state}
                    onChange={handleStateChange}
                    required
                    disabled={!formData.location.country}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                    
                <div className="form-group">
                  <select
                    className="form-select"
                    value={formData.location.city}
                    onChange={handleCityChange}
                    required
                    disabled={!formData.location.state}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>
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

          <div className="form-group">
            <label>Condition*</label>
            <select
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          className="form-select"
          required
        >
          <option value="">Select Condition</option>
          {conditionChoices.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
            {errors.condition && <span className="error-message">{errors.condition}</span>}
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
