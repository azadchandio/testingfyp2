import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/auth.service";
import "./global.css";
import { FaFacebook, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      login(response.user, response.access);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="page-container">
        <div className="sections">
          <div className="login">
            <div className="form-container">
              {error && <div className="error-message">{error}</div>}
              <h2 className="titlee">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="floating-label-container">
                  <input
                    type="text"
                    className="floating-input"
                    id="email"
                    placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label htmlFor="email" className="floating-label">
                    Email or username
                  </label>
                </div>
                <div className="floating-label-container password-field">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="floating-input"
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password" className="floating-label">
                    Password
                  </label>
                  <span
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                    aria-label="Toggle password visibility"
                  >
                    {passwordVisible ? "HIDE" : "SHOW"}
                  </span>
                </div>
                <div className="remember-me-section">
                  <label className="remember-me">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <Link to="/forget-password" className="forget-password-link">
                    Forgot password?
                  </Link>
                </div>
                <button type="submit" disabled={loading} className="btn-orange">
                  {loading ? "Logging in ..." : "Login"}
                </button>
              </form>
            </div>
          </div>
          <div className="divider">
            <h2>OR</h2>
          </div>
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
              <button className="apple">
                <FaApple size={35} />
                Login with Apple
              </button>
              <p className="link-text">
                Don't have an Account! <Link to="/register">Register Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func,
  onError: PropTypes.func
};

LoginPage.defaultProps = {
  onLoginSuccess: () => {},
  onError: () => {}
};

export default LoginPage;
