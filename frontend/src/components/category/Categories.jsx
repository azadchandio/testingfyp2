import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import categoriesData from './categoires.json';
import './Categories.css';

const Categories = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  return (
    <div className="categories-containerr">
      {/* Category Title */}
      <h2 className="categories-titlee">
        Category<span className="title-dott">.</span>
      </h2>

      {/* Main Categories */}
      <div className="categories-gridd">
        {categoriesData.mainCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => {
              if (category.id === 'all') setShowAllCategories(true);
            }}
            className="category-cardd"
          >
            <div className="category-icon-wrapperr">
              {category.id === 'all' ? (
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.82324 7.64683C2.82324 5.11282 4.87747 3.05859 7.41148 3.05859H12.5095C15.0435 3.05859 17.0978 5.11282 17.0978 7.64683V12.7449C17.0978 15.2789 15.0435 17.3331 12.5095 17.3331H7.41148C4.87747 17.3331 2.82324 15.2789 2.82324 12.7449V7.64683Z" fill="#F57D26"/>
                  <path d="M2.82324 7.64683C2.82324 5.11282 4.87747 3.05859 7.41148 3.05859H12.5095C15.0435 3.05859 17.0978 5.11282 17.0978 7.64683V12.7449C17.0978 15.2789 15.0435 17.3331 12.5095 17.3331H7.41148C4.87747 17.3331 2.82324 15.2789 2.82324 12.7449V7.64683Z" fill="#F57D26"/>
                  <rect x="20.6665" y="3.05859" width="14.2745" height="14.2745" rx="4.58824" fill="#38528F"/>
                  <rect x="2.82324" y="20.9019" width="14.2745" height="14.2745" rx="4.58824" fill="#38528F"/>
                  <circle cx="27.8038" cy="28.0391" r="7.13726" fill="#F57D26"/>
                </svg>
              ) : (
                <FontAwesomeIcon
                  icon={Icons[category.icon]}
                  className={`category-iconn ${category.color ? 'orange' : ''}`}
                />
              )}
            </div>
            <div className="category-textt">
              <div className="category-namee">{category.name}</div>
              {category.subtext && (
                <div className="category-subtextt">{category.subtext}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Categories Popup */}
      {showAllCategories && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3 className="popup-title">
                All Categories<span className="title-dot">.</span>
              </h3>
              <button
                onClick={() => setShowAllCategories(false)}
                className="close-button"
              >
                <FontAwesomeIcon icon={Icons.faTimes} />
              </button>
            </div>

            <div className="popup-grid">
              {Object.entries(categoriesData.subCategories).map(
                ([category, items]) => (
                  <div key={category} className="category-section">
                    <h4 className="section-title">{category}</h4>
                    <ul className="subcategory-list">
                      {items.map((item, index) => (
                        <li key={index} className="subcategory-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
