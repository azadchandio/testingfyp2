import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingApprovals: 0
  });

  // Redirect if user is not admin
  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="admin-dashboard">
        <div className="admin-card">
          <h2>Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalListings}</div>
              <div className="stat-label">Total Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeListings}</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pendingApprovals}</div>
              <div className="stat-label">Pending Approvals</div>
            </div>
          </div>
          <div className="admin-actions">
            <button className="admin-button">View All Users</button>
            <button className="admin-button">Manage Listings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 