import React, { useState } from "react";
import './global.css'
import { Link } from "react-router-dom";

export default function PersonalDataForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Personal Data Submitted: ", formData);
  };

  return (
    <div className="page-container ">
    <div className="form-container">
      <h2 className="titlee">Add Your Personal Information</h2>
      <div className="form-row">
        <div className="floating-label-container">
          <input
            type="text"
            className="floating-input"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label htmlFor="firstName" className="floating-label">
            First Name
          </label>
        </div>
        <div className="floating-label-container">
          <input
            type="text"
            className="floating-input"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label htmlFor="lastName" className="floating-label">
            Last Name
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="floating-label-container">
          <input
            type="date"
            className="floating-input"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            placeholder=" "
            required
          />
          <label htmlFor="dob" className="floating-label">
            Date of Birth
          </label>
        </div>
        <div className="floating-label-container">
          <select
            className="floating-input"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            placeholder=" "
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <label htmlFor="gender" className="floating-label">
            Gender
          </label>
        </div>
      </div>
      <div className="centered-container">
      <button className="btn-orange" onClick={handleSubmit}>
        Save & Continue
      </button></div>
      <p className="privacy-text">
        Your Information will remain secured. Read our{" "}
        <Link to="https://www.google.com/">Privacy Policy</Link>.
      </p>
    </div>
  </div>
  );
}
