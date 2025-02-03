// SelectCategory.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaMobile, 
  FaCar, 
  FaBuilding,
  FaGamepad,
  FaMotorcycle,
  FaCouch,
  FaTshirt,
  FaLaptop,
  FaBriefcase,
  FaBaby
} from 'react-icons/fa';
import './SelectCategory.css';

const categories = [
  { id: 'mobiles', icon: <FaMobile />, name: 'Mobiles' },
  { id: 'vehicles', icon: <FaCar />, name: 'Vehicles' },
  { id: 'properties', icon: <FaBuilding />, name: 'Properties Rent & Sell' },
  { id: 'electronics', icon: <FaGamepad />, name: 'Electronics & Gadgets' },
  { id: 'bikes', icon: <FaMotorcycle />, name: 'Bikes' },
  { id: 'furniture', icon: <FaCouch />, name: 'Furniture & Decor' },
  { id: 'fashion', icon: <FaTshirt />, name: 'Fashion & Clothing' },
  { id: 'computer', icon: <FaLaptop />, name: 'Computer & Laptop' },
  { id: 'jobs', icon: <FaBriefcase />, name: 'Jobs' },
  { id: 'kids', icon: <FaBaby />, name: 'Kids Toys' }
];

const SelectCategory = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    navigate(`/listing/subcategory/${categoryId}`);
  };

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
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="category-icon-wrapper">
                {category.icon}
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