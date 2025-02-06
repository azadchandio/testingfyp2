// SubCategory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './SubCategory.css';

const SubCategory = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${slug}/subcategories/`);
        setSubCategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [slug]);

  const handleSubCategorySelect = (subCategorySlug) => {
    // Updated to use slugs consistently
    navigate(`/listing/details/${slug}/${subCategorySlug}`);
  };

  if (loading) {
    return <div>Loading...</div>;
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
                onClick={() => handleSubCategorySelect(subCategory.slug)}
              >
                <span className="sub-category-name">{subCategory.name}</span>
                <span className="arrow-icon">›</span>
              </div>
            ))
          ) : (
            <div>No Subcategories Found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;