import React, { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { BsTrash } from 'react-icons/bs';
import './ManageComplaints.css';

const dummyData = {
  newComplaints: [
    {
      id: 1,
      userName: '[User Name]',
      userMode: 'Buyer',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Pending',
    },
    {
      id: 2,
      userName: '[User Name]',
      userMode: 'Seller',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Pending',
    },
    {
      id: 3,
      userName: '[User Name]',
      userMode: 'Seller',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Pending',
    },
    {
      id: 4,
      userName: '[User Name]',
      userMode: 'Buyer',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Pending',
    },
  ],
  solvedComplaints: [
    {
      id: 1,
      userName: '[User Name]',
      userMode: 'Buyer',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Solved',
    },
    {
      id: 2,
      userName: '[User Name]',
      userMode: 'Seller',
      subject: '[Complaint Subject]',
      createdOn: '02 Aug 2024',
      status: 'Solved',
    },
  ],
};

const ManageComplaints = ({ type, title, count }) => {
  const [searchId, setSearchId] = useState('');
  const [searchSubject, setSearchSubject] = useState('');

  const filteredData = dummyData?.[type]?.filter(item =>
    item.id.toString().includes(searchId) &&
    item.subject.toLowerCase().includes(searchSubject.toLowerCase())
  );

  return (
    <div className="content-area-staff">
      <div className="content-header-staff">
        <div className="title-section-staff">
          <h2>{title}</h2>
          <span className="count">{count}</span>
        </div>
        <div className="search-section-staff">
          <div className="search-box-staff">
            <input 
              type="text" 
              placeholder="Search by Complaint ID" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Search by Subject" 
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container-staff">
        <table className="table-staff">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Complaint ID</th>
              <th>User Name</th>
              <th>User Mode</th>
              <th>Subject</th>
              <th>Created On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="complaint-id">#{item.id}</td>
                <td>{item.userName}</td>
                <td>{item.userMode}</td>
                <td>{item.subject}</td>
                <td>{item.createdOn}</td>
                <td>
                  <span className={`status-badge-staff ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-staff">
                    <button className="action-btn-staff view-staff">
                      <FiEye />
                    </button>
                    <button className="action-btn-staff delete-staff">
                      <BsTrash />
                    </button>
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

export default ManageComplaints;