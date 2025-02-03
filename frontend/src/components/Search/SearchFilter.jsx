import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './SearchFilter.css';

const SearchFilter = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        sortBy: 'newest'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <div className="search-filter">
            <form onSubmit={handleSubmit}>
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={filters.keyword}
                        onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                    />
                </div>
                
                <div className="filter-options">
                    <div className="price-range">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        />
                    </div>
                    
                    <select
                        value={filters.condition}
                        onChange={(e) => setFilters({...filters, condition: e.target.value})}
                    >
                        <option value="">All Conditions</option>
                        <option value="new">New</option>
                        <option value="like_new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                    </select>
                    
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
                
                <button type="submit" className="apply-filters">
                    <FaFilter /> Apply Filters
                </button>
            </form>
        </div>
    );
};

SearchFilter.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchFilter; 