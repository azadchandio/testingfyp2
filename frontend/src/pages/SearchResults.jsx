import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchResults.css";
import { CiDollar } from 'react-icons/ci';
import { advertisementService } from "../services/advertisement.service";

const SearchResults = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const categories = [
    { value: "Car", label: "Car" },
    { value: "Bike", label: "Bike" },
    { value: "Electronics", label: "Electronics" },
    { value: "Personal Items", label: "Personal Items" },
  ];

  const cities = {
    Pakistan: ["Hyderabad", "Karachi", "Lahore", "Islamabad"],
    India: ["Mumbai", "Delhi", "Bangalore"],
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialQuery = params.get('query');
    const initialLocation = params.get('location');
    
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialLocation) setSelectedCity(initialLocation);
    
    fetchProducts();
  }, [selectedCategories, priceRange, selectedCountry, selectedCity, searchQuery, location]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await advertisementService.searchWithFilters({
        categories: selectedCategories.map((cat) => cat.value),
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        country: selectedCountry,
        city: selectedCity,
        query: searchQuery,
      });
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="body">
      <div className="listings-container-search">
        <aside className="filter-section-search">
          <div className="filter-group-search">
            <h2>Sort by Category</h2>
            <Select
              isMulti
              options={categories}
              value={selectedCategories}
              onChange={handleCategoryChange}
              placeholder="Select categories..."
              className="category-select-search"
            />
          </div>

          <div className="filter-group-search">
            <h2>Sort by Price</h2>
            <div className="price-range-search">
              <div className="price-input-search">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  placeholder="Min"
                />
                <span className="currency-search">PKR</span>
              </div>
              <div className="price-input-search">
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  placeholder="Max"
                />
                <span className="currency-search">PKR</span>
              </div>
            </div>
          </div>

          <div className="filter-group-search">
            <h2>Location</h2>
            <div className="location-selects-search">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity("");
                }}
                className="location-select-search"
              >
                <option value="">All Countries</option>
                {Object.keys(cities).map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="location-select-search"
                disabled={!selectedCountry}
              >
                <option value="">All Cities</option>
                {(cities[selectedCountry] || []).map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group-search">
            <h2>Search by Name</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="search-input-search"
            />
          </div>
        </aside>

        <div className="products-section-search">
          {loading ? (
            <div className="loading-search">Loading...</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="product-card-search"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.images && product.images.length > 0 
                    ? `http://127.0.0.1:8000${product.images[0].image_url}`
                    : '/default-image.jpg'}
                  alt={product.title}
                  className="product-image-search"
                />
                <div className="product-info-search">
                  <h3>{product.title}</h3>
                  <div className="product-price-search">Rs {product.price}</div>
                  <div className="product-details-search">
                    <div className="location-search">
                      <span>
                        {product.location?.city || 'N/A'}, 
                        {product.location?.state || 'N/A'}
                      </span>
                    </div>
                    <div className="time">
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="product-actions-search">
                  <button className="message-now-search">Message Now</button>
                  <button className="send-offer-search">
                    <CiDollar size="1.5em" />
                    Send an Offer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
