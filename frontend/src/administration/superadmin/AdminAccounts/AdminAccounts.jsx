import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import './AdminAccounts.css';

const AdminAccounts = () => {
  const adminData = [
    {
      id: 1,
      adminId: '#10237',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Active',
      joinedDate: '2 August 2024',
      joinedTime: '03:59 PM'
    },
    {
      id: 2,
      adminId: '#10236',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Active',
      joinedDate: '2 August 2024',
      joinedTime: '03:59 PM'
    },
    {
      id: 3,
      adminId: '#10236',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Active',
      joinedDate: '2 August 2024',
      joinedTime: '03:59 PM'
    },
    {
      id: 4,
      adminId: '#10236',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Active',
      joinedDate: '2 August 2024',
      joinedTime: '03:59 PM'
    },
    {
      id: 5,
      adminId: '#10236',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Active',
      joinedDate: '2 August 2024',
      joinedTime: '03:59 PM'
    },
    // Add more items to match the image
  ];

  return (
    <div className="super-admin-section">
      <div className="super-admin-section-header">
        <div className="super-admin-title-container">
          <h2>Admin Accounts</h2>
          <span className="super-admin-count-badge">23</span>
        </div>
        <div className="super-admin-search-container">
          <div className="super-admin-search-box">
            <BiSearch className="super-admin-search-icon" />
            <input type="text" className="super-admin-search-input" placeholder="Search by Admin ID" />
          </div>
          <div className="super-admin-search-box">
            <BiSearch className="super-admin-search-icon" />
            <input type="text" className="super-admin-search-input" placeholder="Search by Admin Name" />  
          </div>
        </div>
      </div>

      <div className="super-admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Admin ID</th>
              <th>Admin Login Details</th>
              <th>Admin Name</th>
              <th>Admin Status</th>
              <th>Joined Date/Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminData.map((admin, index) => (
              <tr key={admin.id}>
                <td>{index + 1}</td>
                <td className="super-admin-admin-id">{admin.adminId}</td>
                <td className="super-admin-login-details">
                  <span>{admin.email}</span>
                  <span>{admin.password}</span>
                </td>
                <td>{admin.name}</td>
                <td>
                  <span className="super-admin-status-badge">Active</span>
                </td>
                <td className="super-admin-date-time">
                  <span>{admin.joinedDate}</span>
                  <span>{admin.joinedTime}</span>
                </td>
                <td>
                  <div className="super-admin-action-buttons">
                    <button className="super-admin-view-btn">
                      <FiEye />
                    </button>
                    <button className="super-admin-ban-btn">Ban Now</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAccounts;