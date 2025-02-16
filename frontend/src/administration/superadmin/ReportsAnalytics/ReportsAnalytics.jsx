import React from 'react';
import { FiDownload } from 'react-icons/fi';
import './ReportsAnalytics.css';

const ReportsAnalytics = () => {
  const statsCards = [
    { title: 'Total Listings', value: '89,767' },
    { title: 'Total Ads Sales', value: '$34,908' },
    { title: 'Total Sellers', value: '132' },
    { title: 'Total Buyers', value: '545' }
  ];

  const admins = [
    { name: '[Admin Name]', image: '/path-to-image.jpg' },
    { name: '[Admin Name]', image: '/path-to-image.jpg' },
    { name: '[Admin Name]', image: '/path-to-image.jpg' },
    { name: '[Admin Name]', image: '/path-to-image.jpg' },
    { name: '[Admin Name]', image: '/path-to-image.jpg' },
    { name: '[Admin Name]', image: '/path-to-image.jpg' }
  ];

  return (
    <div className="super-admin-analytics-container">
      <div className="super-admin-analytics-header">
        <h2>Reports & Analytics</h2>
        <button className="super-admin-export-btn">
          <FiDownload />
          Export Reports to .PDF
        </button>
      </div>

      <div className="super-admin-stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="super-admin-stat-card">
            <div className="super-admin-stat-title">{stat.title}</div>
            <div className="super-admin-stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="super-admin-analytics-grid">
        <div className="super-admin-admins-section">
          <h3>All Admins</h3>
          <div className="super-admin-admins-grid">
            {admins.map((admin, index) => (
              <div key={index} className="super-admin-admin-card">
                <img src={admin.image} alt={admin.name} className="super-admin-admin-avatar" />
                <div className="super-admin-admin-name">{admin.name}</div>
                <button className="super-admin-inactive-btn">Inactive</button>
              </div>
            ))}
          </div>
        </div>

        <div className="super-admin-users-overview">
          <h3>Users Overview</h3>
          <div className="super-admin-chart-container">
            <div className="super-admin-donut-chart">
              <div className="super-admin-chart-center">
                <span className="super-admin-total-users">30,000</span>
                <span className="super-admin-label">All Users</span>
              </div>
            </div>
            <div className="super-admin-chart-legend">
              <div className="super-admin-legend-item">
                <span className="super-admin-legend-color super-admin-usa"></span>
                <span>USA</span>
              </div>
              <div className="super-admin-legend-item">
                <span className="super-admin-legend-color super-admin-uk"></span>
                <span>UK</span>
              </div>
              <div className="super-admin-legend-item">
                <span className="super-admin-legend-color super-admin-canada"></span>
                <span>Canada</span>
              </div>
              <div className="super-admin-legend-item">
                <span className="super-admin-legend-color super-admin-europe"></span>
                <span>Europe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;