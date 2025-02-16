import React, { useState } from 'react';
import './KYCVerification.css';

const KYCVerification = () => {
  const [formData, setFormData] = useState({
    country: 'Pakistan',
    documentType: 'Computerized National Identity Card (CNIC)',
    frontImage: null,
    backImage: null,
    confirmCheck: false
  });

  const handleImageUpload = (side, file) => {
    setFormData(prev => ({
      ...prev,
      [side]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="kyc-wrapper">
      <div className="kyc-container">
        <h1 className="kyc-heading">
          KYC Verification<span className="dot">.</span>
        </h1>
        <p className="kyc-subtext">
          Upload a Proof of your Identity. We are just asking for the First Time.
          <br />
          Your Data will be remains secure.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <select 
                value={formData.country}
                onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
              >
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Official Document Type</label>
              <select 
                value={formData.documentType}
                onChange={(e) => setFormData(prev => ({...prev, documentType: e.target.value}))}
              >
                <option value="Computerized National Identity Card (CNIC)">
                  Computerized National Identity Card (CNIC)
                </option>
              </select>
            </div>
          </div>

          <div className="upload-containers">
            <div className="upload-box">
              <div className="upload-icon">
                <img src="/path-to-upload-icon.svg" alt="Upload" />
              </div>
              <h3>Front Side of Original CNIC</h3>
              <p>Upload a Front Side of your Original CNIC. Supports 5MB File</p>
              <p className="file-type">Max in JPG & PNG.</p>
              <button type="button" className="browse-button">
                Drop or Browse File
              </button>
            </div>

            <div className="upload-box">
              <div className="upload-icon">
                <img src="/path-to-upload-icon.svg" alt="Upload" />
              </div>
              <h3>Back Side of Original CNIC</h3>
              <p>Upload a Back Side of your Original CNIC. Supports 5MB File</p>
              <p className="file-type">Max in JPG & PNG.</p>
              <button type="button" className="browse-button">
                Drop or Browse File
              </button>
            </div>
          </div>

          <div className="confirmation-check">
            <input 
              type="checkbox"
              checked={formData.confirmCheck}
              onChange={(e) => setFormData(prev => ({...prev, confirmCheck: e.target.checked}))}
            />
            <label>I Confirm that I uploaded valid government-issued ID. This ID include my picture, signature, name, date of birth and Address.</label>
          </div>

          <button type="submit" className="submit-button">
            Confirm & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification;