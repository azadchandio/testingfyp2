import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css'

const SearchBar = () => {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-content">
          {/* Location Dropdown */}
          <div className="location-wrapper">
            <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
            <select className="location-select">
              <option value="">Pakistan</option>
              {/* Add more options as needed */}
            </select>
          </div>

          {/* Search Input */}
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Anything"
              className="search-input"
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
              {/* <span>Search</span> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar