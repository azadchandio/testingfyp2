import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './KYCVerification.css';

const KYCVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    country: 'Pakistan',
    documentType: 'Computerized National Identity Card (CNIC)',
    frontImage: null,
    backImage: null,
    confirmCheck: false
  });

  // Preview states
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const handleImageUpload = (side, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG files are allowed');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (side === 'frontImage') {
        setFrontPreview(previewUrl);
      } else {
        setBackPreview(previewUrl);
      }

      setFormData(prev => ({
        ...prev,
        [side]: file
      }));
      setError('');
    }
  };

  const handleDrop = (side, event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleImageUpload(side, fakeEvent);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.frontImage || !formData.backImage) {
      setError('Please upload both front and back images');
      return;
    }

    if (!formData.confirmCheck) {
      setError('Please confirm the document validity');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('id_card_front', formData.frontImage);
      submitData.append('id_card_back', formData.backImage);
      submitData.append('kyc_type', formData.documentType);

      console.log('Submitting KYC data:', {
        frontImage: formData.frontImage?.name,
        backImage: formData.backImage?.name,
        documentType: formData.documentType
      });

      console.log('FormData contents:');
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.post('/kyc/submit/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        navigate('/kyc-success');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
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
            <div 
              className="upload-box"
              onDrop={(e) => handleDrop('frontImage', e)}
              onDragOver={handleDragOver}
            >
              {frontPreview ? (
                <div className="preview-container">
                  <img src={frontPreview} alt="Front Preview" className="preview-image" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={() => {
                      setFrontPreview(null);
                      setFormData(prev => ({...prev, frontImage: null}));
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <img src="/upload-icon.svg" alt="Upload" className="upload-icon" />
                  <h3>Front Side of Original CNIC</h3>
                  <p>Upload a Front Side of your Original CNIC. Supports 5MB File</p>
                  <p className="file-type">Max in JPG & PNG.</p>
                  <label htmlFor="frontImage" className="browse-button">
                    Drop or Browse File
                  </label>
                </>
              )}
            </div>

            <div 
              className="upload-box"
              onDrop={(e) => handleDrop('backImage', e)}
              onDragOver={handleDragOver}
            >
              {backPreview ? (
                <div className="preview-container">
                  <img src={backPreview} alt="Back Preview" className="preview-image" />
                  <button 
                    type="button" 
                    className="remove-image"
                    onClick={() => {
                      setBackPreview(null);
                      setFormData(prev => ({...prev, backImage: null}));
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <img src="/upload-icon.svg" alt="Upload" className="upload-icon" />
                  <h3>Back Side of Original CNIC</h3>
                  <p>Upload a Back Side of your Original CNIC. Supports 5MB File</p>
                  <p className="file-type">Max in JPG & PNG.</p>
                  <label htmlFor="backImage" className="browse-button">
                    Drop or Browse File
                  </label>
                </>
              )}
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

          {error && <div className="error-message">{error}</div>}

          <input 
            type="file"
            id="frontImage"
            onChange={(e) => handleImageUpload('frontImage', e)}
            accept="image/jpeg,image/png"
            style={{ display: 'none' }}
          />
          <input 
            type="file"
            id="backImage"
            onChange={(e) => handleImageUpload('backImage', e)}
            accept="image/jpeg,image/png"
            style={{ display: 'none' }}
          />

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Confirm & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYCVerification;