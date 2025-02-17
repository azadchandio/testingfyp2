import React, { useState, useEffect } from "react";
import './global.css'
import './Editprofile.css'
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import axios from 'axios';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [profileImg, setProfileImg] = useState("");

  // Handle input changes
  const handleChange = (setter) => (event) => setter(event.target.value);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('profile/');
        const userData = response.data;
        
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone_number || "");
        setShowPhone(userData.show_phone || false);
        setGender(userData.gender || "");
        setDob(userData.date_of_birth || "");
        
        // Set profile image URL if it exists
        if (userData.profile_picture) {
          setProfileImg(`http://127.0.0.1:8000${userData.profile_picture}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);

      try {
        const response = await api.patch('profile/update/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        if (response.data.profile_picture) {
          setProfileImg(`http://127.0.0.1:8000${response.data.profile_picture}`);
        }
      } catch (err) {
        setError("Failed to upload image");
        console.error('Image upload error:', err);
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const response = await api.patch('profile/update/', 
        { profile_picture: null }
      );
      setProfileImg("");
    } catch (err) {
      setError("Failed to remove photo");
      console.error('Remove photo error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_number', phone);
      formData.append('show_phone', showPhone);
      formData.append('gender', gender);
      formData.append('date_of_birth', dob);

      const response = await api.patch('profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setUser(response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-Content-Container">
      {error && <div className="error-message">{error}</div>}
      
      <h2 className="titlee">Edit Profile</h2>
      <div className="edit-profile-container">
        <div className="profile-section">
          <div className="profile-image">
            <img 
              src={profileImg || "/api/placeholder/150/150"} 
              alt="Profile" 
              className="profile-photo" 
            />
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
            <button className="remove-photo" onClick={handleRemovePhoto}>
              Remove Photo
            </button>
          </div>
        </div>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        {/* Rest of the form remains the same */}
        <div className="sections">
          <div className="floating-label-container">
            <input
              type="text"
              id="name"
              className="floating-input"
              placeholder=" "
              value={name}
              onChange={handleChange(setName)}
            />
            <label htmlFor="name" className="floating-label">
              Name
            </label>
          </div>
        </div>

        <div className="sections">
          <div className="floating-label-container">
            <input
              type="email"
              id="email"
              className="floating-input"
              placeholder=" "
              value={email}
              onChange={handleChange(setEmail)}
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
              onChange={handleChange(setDob)}
            />
            <label htmlFor="dob" className="floating-label">
              Date of Birth
            </label>
          </div>
        </div>

        <div className="sections">
          <div className="floating-label-container">
            <input
              type="text"
              id="phone"
              className="floating-input"
              placeholder=" "
              value={phone}
              onChange={handleChange(setPhone)}
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
              onChange={handleChange(setGender)}
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

        <div className="sections">
          <div className="centered-container">
            <label className="remember-me">
              <input 
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
              />
              Show my Phone Number on my Profile
            </label>
          </div>

          <div className="centered-container">
            <button type="submit" className="btn-editprofile">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;