import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ category, subCategory }) => {
  const location = useLocation();
  const isDetailsPage = location.pathname.includes('/listing/details/');
  const isSubCategoryPage = location.pathname.includes('/listing/subcategory/');

  return (
    <div className="breadcrumb">
      <Link to="/listing/select-category" className="breadcrumb-link">Categories</Link>
      {(isSubCategoryPage || isDetailsPage) && (
        <>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/listing/subcategory/${category?.id}`} className="breadcrumb-link">
            {category?.name || ''}
          </Link>
        </>
      )}
      {isDetailsPage && subCategory && (
        <>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{subCategory.name}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb