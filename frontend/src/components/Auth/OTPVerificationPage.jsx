import React, {useState} from "react";
import './global.css'
import { FaFacebook, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    var verotp=666666
    if(otp == verotp){
      console.log("Verified OTP=", otp);
      navigate('/password-reset')  
    }
    else{
      console.log("Wrong OTP");
    }
    
  };

  return (
    <div className="page-container ">
      <div className="centered-container">
        <div className="form-container " title="OTP Verification">
          <h2 className="titlee">Enter OTP Code</h2>
          <div className="floating-label-container">
            <input
              type="text"
              className="floating-input"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder=" "
              required
              minLength={6}
              maxLength={6}
            />
            <label htmlFor="otp" className="floating-label">
              Enter OTP
            </label>
          </div>

          <button onClick={handleVerify} className="btn-orange">Verify OTP</button>
        </div>
      </div>
      <div className="divider">
        <h2>OR</h2>
      </div>
      <div className="btns">
        <div className="btns">
          <div className="social-login-section">
            <button className="google">
              <FcGoogle size={35} />
              Login with Google
            </button>
            <button className="facebook">
              <FaFacebook size={35} color="#1877F2" />
              Login with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
