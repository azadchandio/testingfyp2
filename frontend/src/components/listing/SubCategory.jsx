import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './SubCategory.css';

const SubCategory = () => {
  const navigate = useNavigate();
  const { slug: categoryId } = useParams(); // Rename slug to categoryId for clarity
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${categoryId}/subcategories/`);
        setSubCategories(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to load subcategories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  const handleSubCategorySelect = (subCategory) => {
    // Navigate using ID parameters to match the route in App.js
    navigate(`/listing/details/${categoryId}/${subCategory.id}`);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="sub-category-wrapper">
      <div className="sub-category-container">
        <h1 className="sub-category-heading">
          Select Sub Category<span className="dot">.</span>
        </h1>
        
        <div className="sub-categories-grid">
          {Array.isArray(subCategories) && subCategories.length > 0 ? (
            subCategories.map((subCategory) => (
              <div 
                key={subCategory.id}
                className="sub-category-card"
                onClick={() => handleSubCategorySelect(subCategory)}
              >
                <span className="sub-category-name">{subCategory.name}</span>
                <span className="arrow-icon">›</span>
              </div>
            ))
          ) : (
            <div className="no-subcategories">No Subcategories Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;