import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventsPage = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/events');
        setWebinars(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching webinars:', error);
        setError('Failed to fetch webinars');
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  if (loading) {
    return <p>Loading webinars...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Upcoming Webinars</h1>
      </header>

      {/* Webinar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar) => (
          <a 
            key={webinar._id} 
            href={webinar.embeddedLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-200 hover:shadow-xl"
          >
            {webinar.image && webinar.image.url ? (
              <img 
                src={webinar.image.url} 
                alt={webinar.webinarName} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <img 
                src="https://via.placeholder.com/400" 
                alt="Placeholder" 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-700">{webinar.webinarName}</h2>
              <p className="text-gray-500 mt-2">{webinar.description}</p>
              <p className="text-xs text-gray-500 mt-2">{webinar.dateAndTime}</p>
              <p className="text-xs text-blue-500 mt-2">
                <a href={webinar.embeddedLink} target="_blank" rel="noopener noreferrer">
                  {webinar.embeddedLink}
                </a>
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
