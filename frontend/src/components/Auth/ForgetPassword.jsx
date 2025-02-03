import React, { useState } from "react";
import './global.css'
import { useNavigate } from 'react-router-dom';
const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const handleSendOTP = () => {

    if (!email) {
      alert("Please enter your email or phone.");
      return;
    }else{
      navigate('/otp-varification')
      console.log('navigate')
    }
    console.log("Email Submitted: ", email);
    setEmail("");
  };

  return (
    <div className="page-container centered-container">
      <div className="form-container">
        <h2 className="titlee">Reset Password</h2>
        <div className="floating-label-container">
          <input
            type="text"
            id="emailorphone"
            className="floating-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
          />
          <label htmlFor="emailorphone" className="floating-label">
            Email or Phone
          </label>
        </div>
        <button onClick={handleSendOTP} className="btn-orange">
          Send Code
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
