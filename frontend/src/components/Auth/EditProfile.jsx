import React, { useState } from "react";
import './global.css'
import './Editprofile.css'
import defaultProfileImg from "../../assets/one.jpeg";

const EditProfile = () => {
  // Create state variables for each form field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showPhone, setShowPhone] = useState(true);

  // Handle input changes
  const handleChange = (setter) => (event) => setter(event.target.value);




  // Initialize state with a fallback in case the image fails to load
  const [profileImg, setProfileImg] = useState(() => defaultProfileImg || '');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="main-Content-Container">
      {/* Image and buttons section */}
      <h2 className="titlee">Edit Profile</h2>
      <div className="edit-profile-container">
      <div className="profile-section">
        <div className="profile-image">
          <img src={profileImg} alt="Profile" className="profile-photo" />
        </div>
        <div className="product-actions">
          <input
            type="file"
            accept="image/*"
            id="upload-photo"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button className="upload-photo" onClick={() => document.getElementById('upload-photo').click()}>
            Upload New Photo
          </button>
          <button className="remove-photo" onClick={() => setProfileImg(defaultProfileImg)}>
            Remove Photo
          </button>
        </div>
      </div>
    </div>

      {/* Form section */}
      <form className="form-container">
        {/* Row 1 */}
        <div className="sections">
          <div className="floating-label-container">
            <input
              type="text"
              id="firstName"
              className="floating-input"
              placeholder=" "
              value={firstName}
              onChange={handleChange(setFirstName)} // Bind to state
            />
            <label htmlFor="firstName" className="floating-label">
              First Name
            </label>
          </div>
          <div className="floating-label-container">
            <input
              type="text"
              id="lastName"
              className="floating-input"
              placeholder=" "
              value={lastName}
              onChange={handleChange(setLastName)} // Bind to state
            />
            <label htmlFor="lastName" className="floating-label">
              Last Name
            </label>
          </div>
        </div>

        {/* Row 2 */}
        <div className="sections">
          <div className="floating-label-container">
            <input
              type="email"
              id="email"
              className="floating-input"
              placeholder=" "
              value={email}
              onChange={handleChange(setEmail)} // Bind to state
            />
            <label htmlFor="email" className="floating-label">
              Email Address
            </label>
          </div>
          <div className="floating-label-container">
            <input
              type="date"
              id="dob"
              className="floating-input"
              value={dob}
              onChange={handleChange(setDob)} // Bind to state
            />
            <label htmlFor="dob" className="floating-label">
              Date of Birth
            </label>
          </div>
        </div>

        {/* Row 3 */}
        <div className="sections">
          <div className="floating-label-container">
            <input
              type="text"
              id="phone"
              className="floating-input"
              placeholder=" "
              value={phone}
              onChange={handleChange(setPhone)} // Bind to state
              maxLength={11}
              minLength={10}
            />
            <label htmlFor="phone" className="floating-label">
              Phone Number
            </label>
          </div>
          <div className="floating-label-container">
            <select
              id="gender"
              className="floating-input"
              value={gender}
              onChange={handleChange(setGender)} // Bind to state
            >
              <option value="" disabled hidden></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label htmlFor="gender" className="floating-label">
              Gender
            </label>
          </div>
        </div>

        {/* Row 4 */}
        <div className="sections">
          <div className="floating-label-container">
            <select
              id="country"
              className="floating-input"
              value={country}
              onChange={handleChange(setCountry)} // Bind to state
            >
              <option value="" disabled hidden></option>
              <option value="Pakistan">Pakistan</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
            <label htmlFor="country" className="floating-label">
              Country
            </label>
          </div>

          <div className="floating-label-container">
            <select
              id="city"
              className="floating-input"
              value={city}
              onChange={handleChange(setCity)} // Bind to state
            >
              <option value="" disabled hidden></option>
              <option value="Sindh, Hyderabad">Sindh, Hyderabad</option>
              <option value="Punjab, Lahore">Punjab, Lahore</option>
              <option value="Sindh, Karachi">Karachi</option>
            </select>
            <label htmlFor="city" className="floating-label">
              State, City
            </label>
          </div>
        </div>

        {/* Row 5 */}
        <div className="sections">
          <div className="centered-container">
          <label className="remember-me">
                  <input type="checkbox" />
                  Show my Phone Number on my Profile
                </label>
          </div>

          {/* Submit Button */}
          <div className="centered-container">
            <button type="submit" className="btn-editprofile">
              Save Changes
            </button>
            <div />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
