import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureListing.css';

const FeatureListing = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState('15 Days');
  const [viewersPerDay, setViewersPerDay] = useState('25');

  return (
    <div className="feature-listing-wrapper">
      <div className="feature-listing-container">
        <h1 className="feature-heading">
          Feature Your Listing<span className="dot">.</span>
        </h1>

        <div className="listing-selection">
          <p className="selection-label">Listing to get Featured*</p>
          <div className="selected-listing">
            <img 
              src="/path-to-car-image.jpg" 
              alt="Vauxhall Grandland" 
              className="listing-image"
            />
            <div className="listing-details">
              <h3 className="listing-title">Vauxhall Grandland</h3>
              <p className="listing-price">Rs 89,00,000</p>
            </div>
          </div>
        </div>

        <div className="feature-options">
          <div className="option-group">
            <label>Select Total Days</label>
            <div className="custom-select">
              <select 
                value={selectedDays}
                onChange={(e) => setSelectedDays(e.target.value)}
              >
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
              </select>
            </div>
          </div>

          <div className="option-group">
            <label>Select Viewers per Day*</label>
            <div className="custom-select">
              <select 
                value={viewersPerDay}
                onChange={(e) => setViewersPerDay(e.target.value)}
              >
                <option value="25">25 / day</option>
                <option value="50">50 / day</option>
                <option value="75">75 / day</option>
              </select>
            </div>
          </div>
        </div>

        <div className="cost-summary">
          <p className="cost-label">Total Ad Costing:</p>
          <p className="cost-amount">$20.00</p>
        </div>

        <button 
          className="payment-button"
          onClick={() => navigate('/payment')}
        >
          Continue To Payment
        </button>
      </div>
    </div>
  );
};

export default FeatureListing; 