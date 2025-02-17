import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KYCSuccess.css';

const KYCSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="kyc-wrapper">
      <div className="kyc-container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h1 className="kyc-heading">
            KYC Submitted Successfully<span className="dot">.</span>
          </h1>
          <p className="kyc-subtext">
            Your KYC documents have been submitted successfully. Our team will verify your documents
            and update you soon. This process usually takes 24-48 hours.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCSuccess; 