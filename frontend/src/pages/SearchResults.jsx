import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import SearchFilter from '../components/Search/SearchFilter';
import { advertisementService } from '../services/advertisement.service';
import ProductCard from '../components/prodcuts/Products';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await advertisementService.searchWithFilters(filters);
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="search-results-container">
      <div className="search-results-content">
        <div className="filters-section">
          <SearchFilter 
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        <div className="results-section">
          <div className="results-header">
            <h2>Search Results for "{filters.query}"</h2>
            <span>{products.length} listings found</span>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 