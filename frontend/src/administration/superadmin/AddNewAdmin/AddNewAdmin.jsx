import React, { useState } from 'react';
import './AddNewAdmin.css';

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="super-admin-add-admin-container">
      <h2 className="super-admin-form-title">Create New Admin Login Details</h2>
      
      <form onSubmit={handleSubmit} className="super-admin-admin-form">
        <div className="super-admin-form-fields">
          <div className="super-admin-input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="super-admin-input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
          </div>
        </div>

        <button type="submit" className="super-admin-create-btn">
          Create Now
        </button>
      </form>
    </div>
  );
};

export default AddNewAdmin;