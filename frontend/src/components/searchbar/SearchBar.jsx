import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/locations/');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Format location for display
  const formatLocation = (location) => {
    return `${location.city}${location.state ? `, ${location.state}` : ''}`;
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-content">
          <div className="location-wrapper-searchbar">
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <select
              className="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option 
                  key={location.id} 
                  value={location.city}
                >
                  {formatLocation(location)}
                </option>
              ))}
            </select>
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Anything"
              className="search-input-searchbar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-button" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;