import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePaymentSubmit = () => {
    navigate('/add-card');
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-container">
        <h1 className="payment-heading">
          Select Your Payment Method<span className="dot">.</span>
        </h1>

        <div className="payment-methods">
          <div 
            className={`payment-method-card ${selectedMethod === 'stripe' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('stripe')}
          >
            <div className="method-select">
              <input 
                type="radio" 
                checked={selectedMethod === 'stripe'} 
                onChange={() => setSelectedMethod('stripe')}
              />
              <span className="method-name">Stripe</span>
            </div>
            <img 
              src="/path-to-stripe-logo.png" 
              alt="Stripe" 
              className="payment-logo stripe-logo"
            />
          </div>

          <div 
            className={`payment-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('card')}
          >
            <div className="method-select">
              <input 
                type="radio" 
                checked={selectedMethod === 'card'} 
                onChange={() => setSelectedMethod('card')}
              />
              <span className="method-name">MasterCard / VISA / Union Pay</span>
            </div>
            <div className="card-logos">
              <img src="/path-to-mastercard.png" alt="Mastercard" />
              <img src="/path-to-visa.png" alt="Visa" />
              <img src="/path-to-unionpay.png" alt="Union Pay" />
            </div>
          </div>
        </div>

        <button 
          className="continue-button"
          onClick={handlePaymentSubmit}
          disabled={!selectedMethod}
        >
          Continue To Add Card
        </button>
      </div>
    </div>
  );
};

export default Payment; 