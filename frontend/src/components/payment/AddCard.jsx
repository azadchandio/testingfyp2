import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCard.css';

const AddCard = () => {
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState({
    cardHolder: 'DEMO USER',
    cardNumber: '0000 0000 0000 0000',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment confirmation
    navigate('/payment-success');
  };

  return (
    <div className="add-card-wrapper">
      <div className="add-card-container">
        <h1 className="add-card-heading">
          Add Card Details<span className="dot">.</span>
        </h1>

        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-row">
            <div className="form-group">
              <label>Card Holder Name*</label>
              <input
                type="text"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
                placeholder="DEMO USER"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Card Number*</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date*</label>
              <input
                type="text"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM / YYYY"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>CVV*</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="form-input"
                maxLength="3"
              />
            </div>
          </div>

          <button type="submit" className="confirm-button">
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCard; 