import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Admin/AdminContainer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditEventModal from '../../components/Admin/EditEventsModal';

const EventsAdmin = () => {
  const [webinars, setWebinars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('webinarName');
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/events');
        setWebinars(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/events/${eventId}`);
      setWebinars(webinars.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (webinar) => {
    setSelectedWebinar(webinar);
    setIsModalOpen(true);
  };

  const handleSave = (updatedWebinar) => {
    setWebinars(webinars.map(webinar => 
      webinar._id === updatedWebinar._id ? updatedWebinar : webinar
    ));
    setIsModalOpen(false);
  };

  const filteredWebinars = webinars
  .filter(webinar =>
    webinar.webinarName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webinar.dateAndTime.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortKey === 'webinarName') {
      return a.webinarName.localeCompare(b.webinarName);
    } else if (sortKey === 'dateAndTime') {
      const dateA = new Date(a.dateAndTime);
      const dateB = new Date(b.dateAndTime);
      return dateA - dateB; // Ascending order
    }
    return 0;
  });


  return (
    <Layout>
      {/* Mobile layout */}
      <div className="block md:hidden">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex items-center mb-4">
          <label className="mr-2">Sort by</label>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="webinarName">Name</option>
            <option value="dateAndTime">Date and Time</option>
          </select>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        <div className="mb-4">
          <button 
            className="bg-red-700 text-white py-2 px-4 rounded-lg w-full"
            onClick={() => navigate('/admin-addevents')}
          >
            Add Events
          </button>
        </div>

        <div className="space-y-4">
          {filteredWebinars.map((webinar) => (
            <div key={webinar._id} className="border rounded-lg shadow-lg p-4 bg-white">
              {webinar.image && webinar.image.url ? (
                <img
                  src={webinar.image.url}
                  alt={webinar.webinarName}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              ) : (
                <p className="text-sm text-gray-500 mb-2">No image</p>
              )}
              <h3 className="text-lg font-semibold">{webinar.webinarName}</h3>
              <p className="text-sm text-gray-600 mb-2 truncate">{webinar.description}</p>
              <p className="text-xs text-gray-500 mb-2">{webinar.dateAndTime}</p>
              <p className="text-xs text-blue-500 mb-2">
                <a href={webinar.embeddedLink} target="_blank" rel="noopener noreferrer">
                  {webinar.embeddedLink}
                </a>
              </p>
              
              <div className="flex justify-end space-x-2">
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => handleEdit(webinar)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => handleDelete(webinar._id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="relative w-3/5 flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex items-center ml-4">
          <label className="mr-2">Sort by</label>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="webinarName">Name</option>
            <option value="dateAndTime">Date and Time</option>
          </select>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <button 
          className="bg-red-700 text-white py-2 px-4 rounded-lg ml-4"
          onClick={() => navigate('/admin-addevents')}
        >
          Add Events
        </button>
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg bg-white hidden md:block">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">Webinar Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Date and Time</th>
              <th className="py-3 px-6 text-left">Embedded Link</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredWebinars.map((webinar) => (
              <tr key={webinar._id} className="border-b">
                <td className="py-4 px-6">{webinar.webinarName}</td>
                <td className="py-4 px-6">{webinar.description}</td>
                <td className="py-4 px-6">{webinar.dateAndTime}</td>
                <td className="py-4 px-6">
                  <a href={webinar.embeddedLink} target="_blank" rel="noopener noreferrer">
                    {webinar.embeddedLink}
                  </a>
                </td>
                <td className="py-4 px-6">
                  {webinar.image && webinar.image.url ? (
                    <img
                      src={webinar.image.url}
                      alt={webinar.webinarName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    className="mr-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleEdit(webinar)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => handleDelete(webinar._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <EditEventModal
          webinar={selectedWebinar}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
};

export default EventsAdmin;
