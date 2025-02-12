import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';

const SearchBar = () => {
  // State to manage the search input value
  const [searchQuery, setSearchQuery] = useState('');

  // State to manage the selected location
  const [selectedLocation, setSelectedLocation] = useState('Pakistan');

  // Function to handle the search action
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Example: Navigate to a search results page
      window.location.href = `/search?query=${encodeURIComponent(
        searchQuery
      )}&location=${encodeURIComponent(selectedLocation)}`;
    } else {
      alert('Please enter a search term.');
    }
  };

  // Function to handle the Enter key press in the search input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-content">
          {/* Location Dropdown */}
          <div className="location-wrapper-searchbar">
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <select
              className="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="Canada">Canada</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Search Input */}
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Anything"
              className="search-input-searchbar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress} // Trigger search on Enter key press
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