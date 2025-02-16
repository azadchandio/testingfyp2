// src/components/Admin/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaListAlt, 
  FaUserCheck, 
  FaExclamationTriangle
} from 'react-icons/fa';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    pendingKYC: 0,
    totalListings: 0,
    reportedContent: 0
  });

  useEffect(() => {
    if (!user?.is_staff && !user?.is_superuser) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // TODO: Replace with your actual API call
        const stats = {
          totalUsers: 150,
          pendingKYC: 25,
          totalListings: 450,
          reportedContent: 8
        };
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
      }
    };

    fetchAdminStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('kyc')}
              className={`px-4 py-2 rounded ${activeTab === 'kyc' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              KYC Requests
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={statistics.totalUsers}
            icon={<FaUsers className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Pending KYC"
            value={statistics.pendingKYC}
            icon={<FaUserCheck className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
          />
          <StatCard
            title="Total Listings"
            value={statistics.totalListings}
            icon={<FaListAlt className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Reported Content"
            value={statistics.reportedContent}
            icon={<FaExclamationTriangle className="h-6 w-6 text-white" />}
            color="bg-red-500"
          />
        </div>

        {/* Add content for other tabs here */}
      </div>
    </div>
  );
};

export default AdminPanel;