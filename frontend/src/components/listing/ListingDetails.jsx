import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListingDetails.css'
const MAX_IMAGES = 5;

const ListingDetails = ({ editId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    location: {
      country: '',
      state: '',
      city: '',
    },
    images: [],
    condition: '',
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [conditionChoices, setConditionChoices] = useState([]);
  const [states, setStates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories on component mount
    fetch('/api/categories/')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));

    // Fetch countries on mount
    fetch('/api/locations/countries/')
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error('Error fetching countries:', error));

    // Fetch condition choices on mount
    fetch('/api/condition-choices/')
      .then((res) => res.json())
      .then((data) => setConditionChoices(data))
      .catch((error) => console.error('Error fetching condition choices:', error));

    if (editId) {
      setIsEditMode(true);
      fetch(`/api/listings/${editId}/`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error('Error fetching listing details:', error));
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country' || name === 'city' || name === 'state') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({ ...prev, category: selectedCategory, subcategory: '' }));
    // Fetch subcategories for the selected category
    fetch(`/api/categories/${selectedCategory}/subcategories/`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data))
      .catch((error) => console.error('Error fetching subcategories:', error));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryId = countries.find(c => c.name === selectedCountry)?.id;
    
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        country: selectedCountry,
        country_id: countryId,
        state: '',
        state_id: '',
        city: '',
        city_id: '',
      },
    }));

    if (selectedCountry) {
      fetch(`http://127.0.0.1:8000/api/locations/states/${selectedCountry}/`)
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
          setErrors(prev => ({ ...prev, state: '' }));
        })
        .catch((error) => {
          console.error('Error fetching states:', error);
          setStates([]);
        });
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const stateId = states.find(s => s.name === selectedState)?.id;
    
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        state: selectedState,
        state_id: stateId,
        city: '',
        city_id: '',
      },
    }));

    if (selectedState) {
      fetch(`http://127.0.0.1:8000/api/locations/cities/${formData.location.country}/${selectedState}/`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setErrors(prev => ({ ...prev, city: '' }));
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
          setCities([]);
        });
    } else {
      setCities([]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can only upload up to ${MAX_IMAGES} images`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, images: '' }));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!formData.location.country) newErrors.country = 'Country is required';
    if (!formData.location.state) newErrors.state = 'State is required';
    if (!formData.location.city) newErrors.city = 'City is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();

    // Add basic fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('condition', formData.condition);

    // Convert category and subcategory slugs to IDs
    const selectedCategory = categories.find(cat => cat.slug === formData.category);
    const selectedSubcategory = subcategories.find(subcat => subcat.slug === formData.subcategory);

    formDataToSend.append('category', selectedCategory?.id || '');
    formDataToSend.append('subcategory', selectedSubcategory?.id || '');

    // For location, create location object
    const selectedCountry = countries.find(c => c.name === formData.location.country);
    const selectedState = states.find(s => s.name === formData.location.state);
    const selectedCity = cities.find(c => c.name === formData.location.city);

    const locationData = {
      country: selectedCountry?.name || '',
      state: selectedState?.name || '',
      city: selectedCity?.name || '',
    };

    formDataToSend.append('location', JSON.stringify(locationData));

    // Handle images
    formData.images.forEach((file) => {
      formDataToSend.append('images', file);
    });

    // Add authorization header
    const AuthToken = localStorage.getItem('token');
    if (!AuthToken) {
      console.error('No authentication token found');
      return;
    }

    fetch(isEditMode 
      ? `http://127.0.0.1:8000/api/advertisements/${editId}/`
      : 'http://127.0.0.1:8000/api/advertisements/create/', {
      method: isEditMode ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${AuthToken}`,
      },
      body: formDataToSend,  // Send FormData, not JSON
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(JSON.stringify(data));
        });
      }
      return res.json();
    })
    .then(data => {
      console.log('Success:', data);
      navigate('/manage-listings');
    })
    .catch(error => {
      console.error('Error:', error);
      try {
        const errorData = JSON.parse(error.message);
        setErrors(prev => ({
          ...prev,
          submit: JSON.stringify(errorData, null, 2)
        }));
      } catch {
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="form-input"
        />
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="form-input"
        />
        {errors.description && <p className="error-message">{errors.description}</p>}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="form-input"
        />
        {errors.price && <p className="error-message">{errors.price}</p>}
      </div>

      <div className="form-group">
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="form-input"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="error-message">{errors.category}</p>}
      </div>

      <div className="form-group">
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          disabled={!formData.category}
          className="form-input"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcat) => (
            <option key={subcat.id} value={subcat.slug}>
              {subcat.name}
            </option>
          ))}
        </select>
        {errors.subcategory && <p className="error-message">{errors.subcategory}</p>}
      </div>

      <div className="form-group">
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Select Condition</option>
          {conditionChoices.map((cond) => (
            <option key={cond.value} value={cond.value}>
              {cond.label}
            </option>
          ))}
        </select>
        {errors.condition && <p className="error-message">{errors.condition}</p>}
      </div>

      <div className="form-group">
        <select
          name="country"
          value={formData.location.country}
          onChange={handleCountryChange}
          className="form-input"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && <p className="error-message">{errors.country}</p>}
      </div>

      <div className="form-group">
        <select
          name="state"
          value={formData.location.state}
          onChange={handleStateChange}
          disabled={!formData.location.country}
          className="form-input"
        >
          <option value="">
            {!formData.location.country
              ? "Select Country First"
              : "Select State"}
          </option>
          {states.map((state) => (
            <option key={state.id} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
        {errors.state && <p className="error-message">{errors.state}</p>}
      </div>

      <div className="form-group">
        <select
          name="city"
          value={formData.location.city}
          onChange={handleChange}
          disabled={!formData.location.state}
          className="form-input"
        >
          <option value="">
            {!formData.location.state
              ? "Select State First"
              : "Select City"}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.city && <p className="error-message">{errors.city}</p>}
      </div>

      <div className="form-group">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="form-input"
        />
        {errors.images && <p className="error-message">{errors.images}</p>}
      </div>

      <button type="submit" className="submit-button">
        Submit
      </button>

      {errors.submit && <pre className="error-message">{errors.submit}</pre>}
    </form>
  );
};

export default ListingDetails;