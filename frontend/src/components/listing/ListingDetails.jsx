import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ListingDetails.css'
import { advertisementService } from '../../services/advertisement.service';
const MAX_IMAGES = 5;

const ListingDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    category_slug: '',
    subcategory: '',
    subcategory_slug: '',
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
  const [loading, setLoading] = useState(true);

  // Add new state for image previews
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch categories on component mount
            const categoriesData = await fetch('/api/categories/').then(res => res.json());
            setCategories(categoriesData);

            // Fetch countries
            const countriesData = await fetch('/api/locations/countries/').then(res => res.json());
            setCountries(countriesData);

            // Fetch condition choices
            const conditionsData = await fetch('/api/condition-choices/').then(res => res.json());
            setConditionChoices(conditionsData);

            // If in edit mode (id exists), fetch the listing data
            if (id) {
                setIsEditMode(true);
                const listingData = await advertisementService.getAdvertisementById(id);
                
                // Transform the data to match form structure
                const transformedData = {
                    title: listingData.title,
                    description: listingData.description,
                    price: listingData.price,
                    category: listingData.category,
                    subcategory: listingData.subcategory,
                    condition: listingData.condition,
                    location: {
                        country: listingData.location?.country || '',
                        state: listingData.location?.state || '',
                        city: listingData.location?.city || '',
                    },
                    images: listingData.images || [],
                };

                setFormData(transformedData);

                // If there's a category, fetch its subcategories
                if (listingData.category) {
                    const subcategoriesData = await fetch(`/api/categories/${listingData.category}/subcategories/`).then(res => res.json());
                    setSubcategories(subcategoriesData);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrors(prev => ({
                ...prev,
                general: 'Error loading form data'
            }));
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id]);

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
    const categoryId = categories.find(cat => cat.slug === selectedCategory)?.id;
    
    setFormData((prev) => ({ 
        ...prev, 
        category: categoryId, 
        category_slug: selectedCategory,
        subcategory: '',
        subcategory_slug: '' 
    }));

    // Fetch subcategories for the selected category
    fetch(`/api/categories/${selectedCategory}/subcategories/`)
        .then((res) => res.json())
        .then((data) => setSubcategories(data))
        .catch((error) => console.error('Error fetching subcategories:', error));
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    const subcategoryId = subcategories.find(subcat => subcat.slug === selectedSubcategory)?.id;
    
    setFormData((prev) => ({ 
        ...prev, 
        subcategory: subcategoryId,
        subcategory_slug: selectedSubcategory 
    }));
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

  // Update handleFileChange to handle single image selection
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a copy of the current images array
    const newImages = [...formData.images];
    newImages[index] = file;
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));

    setErrors((prev) => ({ ...prev, images: '' }));
  };

  // Update handleRemoveImage
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? null : img)
    }));
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
        return;
    }

    try {
        const formDataToSend = new FormData();

        // Add basic fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('condition', formData.condition);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('subcategory', formData.subcategory);

        // Handle location
        const locationData = {
            country: formData.location.country,
            state: formData.location.state,
            city: formData.location.city,
        };
        formDataToSend.append('location', JSON.stringify(locationData));

        // Handle images - only append non-null images
        formData.images.forEach((file) => {
            if (file instanceof File) {
                formDataToSend.append('images', file);
            }
        });

        if (isEditMode && id) {
            console.log("Updating advertisement...");
            await advertisementService.updateAdvertisement(id, formDataToSend);
        } else {
            console.log("Creating new advertisement...");
            // Use the correct endpoint for creating advertisements
            await advertisementService.createAdvertisement(formDataToSend);
        }

        navigate('/manage-listings');
    } catch (error) {
        console.error('Error submitting form:', error);
        setErrors(prev => ({
            ...prev,
            submit: error.response?.data?.message || 'Error submitting form'
        }));
    }
  };

  return (
    <>
        {loading ? (
            <div className="loading-spinner">Loading...</div>
        ) : (
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
                        value={formData.category_slug}
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
                        value={formData.subcategory_slug}
                        onChange={handleSubcategoryChange}
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
                    <div className="image-upload-grid">
                        {[...Array(MAX_IMAGES)].map((_, index) => (
                            <div key={index} className="image-upload-slot">
                                <input
                                    type="file"
                                    id={`image-input-${index}`}
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, index)}
                                    className="hidden-input"
                                />
                                <label htmlFor={`image-input-${index}`} className="image-slot-label">
                                    {formData.images[index] ? (
                                        <div className="image-preview-wrapper">
                                            <img
                                                src={formData.images[index] instanceof File 
                                                    ? URL.createObjectURL(formData.images[index])
                                                    : formData.images[index]}
                                                alt={`Preview ${index + 1}`}
                                                className="image-preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveImage(index);
                                                }}
                                                className="remove-image-btn"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="empty-slot">
                                            <span className="plus-icon">+</span>
                                            <span className="upload-text">Upload Image</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.images && <p className="error-message">{errors.images}</p>}
                </div>

                <button type="submit" className="submit-button">
                    Submit
                </button>

                {errors.submit && <pre className="error-message">{errors.submit}</pre>}
            </form>
        )}
    </>
  );
};

export default ListingDetails;