import React from 'react';
import './VerificationBadge.css';

const VerificationBadge = ({ className = '' }) => {
  return (
    <span className={`verification-badge ${className}`}>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M8 0L9.4 1.4L11.4 0.8L12.2 2.8L14.3 3L14.1 5.1L16 6.4L14.9 8L16 9.6L14.1 10.9L14.3 13L12.2 13.2L11.4 15.2L9.4 14.6L8 16L6.6 14.6L4.6 15.2L3.8 13.2L1.7 13L1.9 10.9L0 9.6L1.1 8L0 6.4L1.9 5.1L1.7 3L3.8 2.8L4.6 0.8L6.6 1.4L8 0Z" 
          fill="#38528F"
        />
        <path 
          d="M6.5 8L7.5 9L9.5 7" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span>Verified User</span>
    </span>
  );
};

export default VerificationBadge; 