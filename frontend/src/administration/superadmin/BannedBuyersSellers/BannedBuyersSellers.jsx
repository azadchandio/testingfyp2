import React from 'react';
import { BiSearch } from 'react-icons/bi';
import './BannedBuyersSellers.css';

const BannedBuyersSellers = () => {
  const bannedUsersData = [
    {
      id: 1,
      userId: '#10237',
      email: 'user1@gmail.com',
      password: 'P@s*****09',
      name: '[User Name]',
      type: 'Buyer',
      status: 'Banned',
      bannedDate: '2 August 2024',
      bannedTime: '03:59 PM'
    },
    // Add more data as needed
  ];

  return (
    <div className="super-admin-banned-users">
      <div className="super-admin-banned-header">
        <div className="super-admin-title-section">
          <h2>Banned Buyers/Sellers</h2>
          <span className="super-admin-count-badge">23</span>
        </div>
        <div className="super-admin-search-section">
          <div className="super-admin-search-box">
            <BiSearch className="super-admin-search-icon" />
            <input type="text" className="super-admin-search-input" placeholder="Search by User ID" />
          </div>
          <div className="super-admin-search-box">
            <BiSearch className="super-admin-search-icon" />
            <input type="text" className="super-admin-search-input" placeholder="Search by User Name" />
          </div>
        </div>
      </div>

      <div className="super-admin-table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>User ID</th>
              <th>User Login Details</th>
              <th>User Name</th>
              <th>User Type</th>
              <th>User Status</th>
              <th>Banned Date/Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsersData.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td className="super-admin-user-id">{user.userId}</td>
                <td className="super-admin-login-details">
                  <div>{user.email}</div>
                  <div className="super-admin-password">{user.password}</div>
                </td>
                <td>{user.name}</td>
                <td>
                  <span className="super-admin-type-badge">{user.type}</span>
                </td>
                <td>
                  <span className="super-admin-status-badge super-admin-banned">{user.status}</span>
                </td>
                <td className="super-admin-date-time">
                  <div>{user.bannedDate}</div>
                  <div>{user.bannedTime}</div>
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

export default BannedBuyersSellers;