import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SubCategory.css';

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
    properties: [
      { id: 'houses', name: 'Houses' },
      { id: 'apartments', name: 'Apartments' },
      { id: 'plots', name: 'Plots' },
      { id: 'shops', name: 'Shops' },
    ],
    electronics: [
      { id: 'gaming-consoles', name: 'Gaming Consoles' },
      { id: 'headphones', name: 'Headphones' },
      { id: 'cameras', name: 'Cameras' },
      { id: 'home-appliances', name: 'Home Appliances' },
    ],
    bikes: [
      { id: 'motorcycles', name: 'Motorcycles' },
      { id: 'scooters', name: 'Scooters' },
      { id: 'bicycles', name: 'Bicycles' },
      { id: 'bike-accessories', name: 'Bike Accessories' },
    ],
    furniture: [
      { id: 'sofas', name: 'Sofas' },
      { id: 'tables', name: 'Tables' },
      { id: 'chairs', name: 'Chairs' },
      { id: 'beds', name: 'Beds' },
    ],
    fashion: [
      { id: 'men-clothing', name: 'Men Clothing' },
      { id: 'women-clothing', name: 'Women Clothing' },
      { id: 'shoes', name: 'Shoes' },
      { id: 'accessories', name: 'Accessories' },
    ],
    computer: [
      { id: 'laptops', name: 'Laptops' },
      { id: 'desktops', name: 'Desktops' },
      { id: 'printers', name: 'Printers' },
      { id: 'computer-accessories', name: 'Computer Accessories' },
    ],
    jobs: [
      { id: 'full-time', name: 'Full-Time Jobs' },
      { id: 'part-time', name: 'Part-Time Jobs' },
      { id: 'internships', name: 'Internships' },
      { id: 'freelance', name: 'Freelance Jobs' },
    ],
    kids: [
      { id: 'toys', name: 'Toys' },
      { id: 'baby-care', name: 'Baby Care' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'school-supplies', name: 'School Supplies' },
    ],
  };
  

const SubCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const handleSubCategorySelect = (subCategoryId) => {
    navigate(`/listing/details/${categoryId}/${subCategoryId}`);
  };

  const subCategories = subCategoriesData[categoryId] || [];

  return (
    <div className="sub-category-wrapper">
      <div className="sub-category-container">
        <h1 className="sub-category-heading">
          Select Sub Category<span className="dot">.</span>
        </h1>
        
        <div className="sub-categories-grid">
          {subCategories.map((subCategory) => (
            <div 
              key={subCategory.id}
              className={`sub-category-card ${subCategory.id === 'mobile-phones' ? 'active' : ''}`}
              onClick={() => handleSubCategorySelect(subCategory.id)}
            >
              <span className="sub-category-name">{subCategory.name}</span>
              <span className="arrow-icon">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;