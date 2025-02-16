import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { FiPrinter } from 'react-icons/fi';
import './MonitorActivity.css';

const MonitorActivity = () => {
  const activityData = [
    {
      id: 1,
      adminId: '#10237',
      adminName: '[Admin Name]',
      activitySubject: '[Activity Subject]',
      activityDate: '2 August 2024',
      activityTime: '03:59 PM'
    },
    {
      id: 2,
      adminId: '#10236',
      adminName: '[Admin Name]',
      activitySubject: '[Activity Subject]',
      activityDate: '2 August 2024',
      activityTime: '03:59 PM'
    },
    // Add more items to match the image
  ];

  return (
    <div className="super-admin-monitor-activity">
      <div className="super-admin-activity-header">
        <div className="super-admin-title-section">
          <h2>All Admins Activities</h2>
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
              <th>Admin Name</th>
              <th>Activity Subject</th>
              <th>Activity Date/Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activityData.map((activity, index) => (
              <tr key={activity.id}>
                <td>{index + 1}</td>
                <td className="super-admin-admin-id">{activity.adminId}</td>
                <td>{activity.adminName}</td>
                <td>{activity.activitySubject}</td>
                <td className="super-admin-date-time">
                  <div>{activity.activityDate}</div>
                  <div>{activity.activityTime}</div>
                </td>
                <td>
                  <button className="super-admin-print-btn">
                    <FiPrinter className="super-admin-print-icon" />
                    Print Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitorActivity;