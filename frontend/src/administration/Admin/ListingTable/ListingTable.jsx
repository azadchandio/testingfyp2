import React, { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { BsTrash } from 'react-icons/bs';
import './ListingTable.css';

// Add status-specific styling
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'featured':
      return 'status-featured';
    case 'active':
      return 'status-active';
    case 'inactive':
      return 'status-inactive';
    case 'banned':
      return 'status-banned';
    default:
      return '';
  }
};

const dummyData = {
  featured: [
    {
      id: 1,
      listingId: '#10237',
      listedBy: {
        name: 'Peter Howl',
        phone: '+12*******89'
      },
      listingTitle: 'Modern Apartment in Downtown',
      listingStatus: 'Featured',
      postedDate: '2 August 2024 03:59 PM'
    },
    {
      id: 2,
      listingId: '#10236',
      listedBy: {
        name: 'Sarah Johnson',
        phone: '+12*******45'
      },
      listingTitle: 'Luxury Villa with Pool',
      listingStatus: 'Featured',
      postedDate: '2 August 2024 02:30 PM'
    },
    {
      id: 3,
      listingId: '#10235',
      listedBy: {
        name: 'Mike Anderson',
        phone: '+12*******67'
      },
      listingTitle: 'Beachfront Condo',
      listingStatus: 'Featured',
      postedDate: '1 August 2024 11:20 AM'
    }
  ],
  active: [
    {
      id: 1,
      listingId: '#10234',
      listedBy: {
        name: 'Emma Wilson',
        phone: '+12*******23'
      },
      listingTitle: 'Cozy Studio Apartment',
      listingStatus: 'Active',
      postedDate: '1 August 2024 10:15 AM'
    },
    {
      id: 2,
      listingId: '#10233',
      listedBy: {
        name: 'David Brown',
        phone: '+12*******78'
      },
      listingTitle: 'Family Home with Garden',
      listingStatus: 'Active',
      postedDate: '1 August 2024 09:45 AM'
    },
    {
      id: 3,
      listingId: '#10232',
      listedBy: {
        name: 'Lisa Martinez',
        phone: '+12*******34'
      },
      listingTitle: 'Penthouse with City View',
      listingStatus: 'Active',
      postedDate: '31 July 2024 04:30 PM'
    },
    {
      id: 4,
      listingId: '#10231',
      listedBy: {
        name: 'James Wilson',
        phone: '+12*******90'
      },
      listingTitle: 'Mountain View Cabin',
      listingStatus: 'Active',
      postedDate: '31 July 2024 02:15 PM'
    }
  ],
  inactive: [
    {
      id: 1,
      listingId: '#10230',
      listedBy: {
        name: 'Robert Taylor',
        phone: '+12*******56'
      },
      listingTitle: 'Historic Downtown Loft',
      listingStatus: 'Inactive',
      postedDate: '30 July 2024 03:45 PM'
    },
    {
      id: 2,
      listingId: '#10229',
      listedBy: {
        name: 'Jennifer Lee',
        phone: '+12*******12'
      },
      listingTitle: 'Suburban Family House',
      listingStatus: 'Inactive',
      postedDate: '30 July 2024 01:30 PM'
    },
    {
      id: 3,
      listingId: '#10228',
      listedBy: {
        name: 'Thomas Moore',
        phone: '+12*******43'
      },
      listingTitle: 'Lakefront Property',
      listingStatus: 'Inactive',
      postedDate: '29 July 2024 11:20 AM'
    }
  ],
  banned: [
    {
      id: 1,
      listingId: '#10227',
      listedBy: {
        name: 'Daniel White',
        phone: '+12*******65'
      },
      listingTitle: 'Suspicious Luxury Listing',
      listingStatus: 'Banned',
      postedDate: '28 July 2024 04:15 PM'
    },
    {
      id: 2,
      listingId: '#10226',
      listedBy: {
        name: 'Rachel Green',
        phone: '+12*******87'
      },
      listingTitle: 'Flagged Property Listing',
      listingStatus: 'Banned',
      postedDate: '28 July 2024 02:30 PM'
    },
    {
      id: 3,
      listingId: '#10225',
      listedBy: {
        name: 'Kevin Black',
        phone: '+12*******54'
      },
      listingTitle: 'Reported Rental Unit',
      listingStatus: 'Banned',
      postedDate: '27 July 2024 01:45 PM'
    },
    {
      id: 4,
      listingId: '#10224',
      listedBy: {
        name: 'Maria Garcia',
        phone: '+12*******32'
      },
      listingTitle: 'Blocked Premium Listing',
      listingStatus: 'Banned',
      postedDate: '27 July 2024 11:20 AM'
    }
  ]
};

const ListingsTable = ({ type, title, count }) => {
  const [searchId, setSearchId] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const filteredData = dummyData?.[type]?.filter(item =>
    item.listingId.toLowerCase().includes(searchId.toLowerCase()) &&
    item.listingTitle.toLowerCase().includes(searchTitle.toLowerCase())
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
              placeholder="Search by Listing ID" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Search by Listing Title" 
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-container-staff">
        <table className="table-staff">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Listing ID</th>
              <th>Listed By</th>
              <th>Listing Title</th>
              <th>Listing Status</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="listing-id">{item.listingId}</td>
                <td>
                  <div className="listed-by-staff">
                    <span className="name-staff">{item.listedBy.name}</span>
                    <span className="phone-staff">{item.listedBy.phone}</span>
                  </div>
                </td>
                <td>{item.listingTitle}</td>
                <td>
                  <span className={`status-badge-staff ${getStatusStyle(item.listingStatus)}`}>
                    {item.listingStatus}
                  </span>
                </td>
                <td>{item.postedDate}</td>
                <td>
                  <div className="action-buttons-staff">
                    <button className="action-btn-staff view-staff">
                      <FiEye />
                    </button>
                    <button className="action-btn-staff delete-staff">
                      <BsTrash />
                    </button>
                    <button className="action-btn-staff moderate-staff">Moderate</button>
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

export default ListingsTable;
