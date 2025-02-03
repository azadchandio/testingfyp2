import React, {useState} from "react";
import './global.css'
import { useNavigate } from 'react-router-dom';

const PasswordResetPage = () => {

 const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const navigate = useNavigate();
 
   const handleReset = () => {
     if (password === confirmPassword) {
       alert("Password Reset Successful!");
        setPassword(""); 
        setConfirmPassword("");
        navigate('/Login') 
     } else {
       console.log("Passwords do not match!");
        setPassword(""); 
        setConfirmPassword("");
     }
   };

  return (
    <div className="page-container ">
      <div className="centered-container">
      <div className="form-container">
      <h2 className="titlee">Reset Password</h2>

      <div className="floating-label-container">
        <input
          type="password"
          className="floating-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=" "
          id="new-password"
        />
        <label htmlFor="new-password" className="floating-label">
          New Password
        </label>
      </div>

      <div className="floating-label-container">
        <input
          type="password"
          className="floating-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder=" "
          id="confirm-password"
        />
        <label htmlFor="confirm-password" className="floating-label">
          Confirm Password
        </label>
      </div>

      <button onClick={handleReset} className="btn-orange">
        Update Password
      </button>
    </div>
      </div>
    </div>
  );
}

export default PasswordResetPage;
