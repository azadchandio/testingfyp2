import { useState } from "react";
import "./global.css";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { name, email, password, password2 } = formData;
      console.log('Attempting registration with:', { email, name });
      
      const response = await authService.register(email, name, password, password2);
      console.log('Registration successful:', response);
      
      if (response.user) {
        setUser(response.user);
      }
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="page-container">
        <div className="sections">
          <div className="login">

            <form onSubmit={handleSubmit} className="form-container">
              <h2 className="titlee">REGISTER NOW</h2>
              {error && <div className="error-message">{error}</div>}

              <div className="floating-label-container">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="floating-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="name" className="floating-label">Name</label>
              </div>

              <div className="floating-label-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="floating-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email" className="floating-label">Email</label>
              </div>

              <div className="floating-label-container password-field">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="floating-input"
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password" className="floating-label">Password</label>
                <span className="toggle-password" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? "HIDE" : "SHOW"}
                </span>
              </div>

              <div className="floating-label-container password-field">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="password2"
                  name="password2"
                  className="floating-input"
                  placeholder=" "
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password2" className="floating-label">Confirm Password</label>
                <span className="toggle-password" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  {confirmPasswordVisible ? "HIDE" : "SHOW"}
                </span>
              </div>

              <button type="submit" className="btn-orange" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="link-text">
                Already have an Account? <Link to="/login">Login Now</Link>
              </p>
              <p className="link-text">
                <input type="checkbox" className="checkbox" required /> Agree to our <a href="/terms">Terms and Services</a>
              </p>
            </form>
          </div>
          <div className="divider">
            <h2>OR</h2>
          </div>
          <div className="btns">
            <div className="social-login-section">
              <button className="google">
                <FcGoogle size={35} /> Sign up with Google
              </button>
              <button className="facebook">
                <FaFacebook size={35} color="#1877F2" /> Sign up with Facebook
              </button>
              <button className="apple">
                <FaApple size={35} /> Sign up with Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;