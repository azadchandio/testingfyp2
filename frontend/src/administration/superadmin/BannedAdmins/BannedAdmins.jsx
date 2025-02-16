import React from 'react';
import { BiSearch } from 'react-icons/bi';
import './BannedAdmins.css';

const BannedAdmins = () => {
  const bannedAdminsData = [
    {
      id: 1,
      adminId: '#10237',
      email: 'admin1@gmail.com',
      password: 'P@s*****09',
      name: '[Admin Name]',
      status: 'Banned',
      bannedDate: '2 August 2024',
      bannedTime: '03:59 PM'
    },
    // Add more data to match the image
  ];

  return (
    <div className="super-admin-banned-admins">
      <div className="super-admin-banned-header">
        <div className="super-admin-title-section">
          <h2>Banned Admins</h2>
          <span className="super-admin-count-badge">23</span>
        </div>
        <div className="super-admin-search-section">
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

      <div className="super-admin-table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Admin ID</th>
              <th>Admin Login Details</th>
              <th>Admin Name</th>
              <th>Admin Status</th>
              <th>Banned Date/Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannedAdminsData.map((admin, index) => (
              <tr key={admin.id}>
                <td>{index + 1}</td>
                <td className="super-admin-admin-id">{admin.adminId}</td>
                <td className="super-admin-login-details">
                  <div>{admin.email}</div>
                  <div className="super-admin-password">{admin.password}</div>
                </td>
                <td>{admin.name}</td>
                <td>
                  <span className="super-admin-status-badge super-admin-banned">{admin.status}</span>
                </td>
                <td className="super-admin-date-time">
                  <div>{admin.bannedDate}</div>
                  <div>{admin.bannedTime}</div>
                </td>
                <td>
                  <button className="super-admin-unban-btn">Unban Now</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannedAdmins;