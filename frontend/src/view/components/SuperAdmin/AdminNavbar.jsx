import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logomobile from "../../../assets/logomobile.png"; // Correct image import

const AdminNavbar = ({ isAccountDropdownOpen, toggleAccountDropdown }) => {
  const [user, setUser] = useState({ firstName: '', lastName: '', profilePicture: { url: '' } });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();
  const defaultProfilePicture = 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'; 
  const dropdownRef = useRef();

  // Sample data for search results (replace this with your actual data source)
  const sampleData = [
    'Task Management',
    'User Profiles',
    'Project Overview',
    'Reports',
    'Settings',
    'Notifications',
    'Analytics',
    'Integrations',
    'User Roles',
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isAccountDropdownOpen) {
          toggleAccountDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/superadmin/settings');
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the sample data based on the query
    if (query) {
      const results = sampleData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleResultClick = (result) => {
    // Handle click on a result (e.g., navigate to a specific page)
    console.log('Selected:', result);
    setSearchQuery('');
    setFilteredResults([]);
    // Add your navigation logic here if needed
  };

  return (
    <>
      {/* Mobile Image */}
      <div className="lg:hidden inset-x-0 top-0 ml-16">
        <img
          src={logomobile} // Use the imported image here
          alt="Centered Image"
          className="w-40 h-18 mx-auto"
        />
      </div>

      {/* Admin Navbar */}
      <div className="flex items-center space-x-9 p-0 relative ">
        {/* Search Bar with Icon */}
        <div className="relative hidden lg:block"> {/* Hide on mobile */}
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          
          {/* Dropdown for Search Results */}
          {filteredResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filteredResults.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={dropdownRef} className="relative flex items-center cursor-pointer" onClick={toggleAccountDropdown}>
          {user.profilePicture ? (
            <img 
              src={user.profilePicture.url || user.profilePicture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <img 
              src={defaultProfilePicture} 
              alt="Default Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className="hidden lg:block ml-2 font-medium text-gray-800"> {/* Hide name on mobile */}
            {user.firstName} {user.lastName}
          </div>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className="ml-1 text-gray-600 hidden lg:block" // Hide on mobile
          />

          {/* Account Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg ${
              isAccountDropdownOpen ? 'block' : 'hidden'
            }`}
            style={{ top: '100%', zIndex: 10000 }} 
          >
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Profile
            </a>
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
