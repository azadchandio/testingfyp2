// SelectCategory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SelectCategory.css";

const SelectCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (slug) => {
    navigate(`/listing/subcategory/${slug}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="select-category-wrapper">
      <div className="select-category-container">
        <h1 className="category-heading">
          Select Category<span className="dot">.</span>
        </h1>

        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="category-card"
              onClick={() => handleCategorySelect(category.slug)}
            >
              <div className="category-icon-wrapper">
                <i className={`fa ${category.icon}`} style={{ fontSize: "30px" }}></i>
              </div>
              <div className="category-text">
                <span className="category-name">{category.name}</span>
              </div>
              <span className="arrow-icon">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCategory;