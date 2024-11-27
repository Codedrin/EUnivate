import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import logomobile from "../../../assets/logomobile.png"; // Correct image import
import { searchOptions } from './Search/SearchContext'; // Import the search options
import TutorialModal from './TutotialModal'; // Import the TutorialModal
import './Css/Search.css';

const AdminNavbar = ({ isAccountDropdownOpen, toggleAccountDropdown }) => {
  const [user, setUser] = useState({ firstName: '', lastName: '', profilePicture: { url: '' } });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [clickedOption, setClickedOption] = useState('');  // Track the clicked search option
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const defaultProfilePicture = 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'; 
  const dropdownRef = useRef();

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

    // Filter the search options based on the query
    if (query) {
      const results = searchOptions.filter(option =>
        option.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  const handleResultClick = (result) => {
    setClickedOption(result.name);  // Set the clicked option
    navigate(result.route);  // Navigate to the route based on the selected result
    setSearchQuery('');
    setFilteredResults([]);
    
    // Optionally stop the blinking after a period (e.g., 2 seconds)
    setTimeout(() => setClickedOption(''), 2000);
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
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

          {/* Dropdown for Search Results */}
          {filteredResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 custom-scrollbar" 
                 style={{ maxHeight: '200px', overflowY: 'scroll' }}> {/* Set max height and enable scrolling */}
              {filteredResults.map((result, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${clickedOption === result.name ? 'bg-yellow-300 animate-blink' : ''}`}
                  onClick={() => handleResultClick(result)}
                >
                  {result.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Mark Icon in Square Box */}
        <div className="relative hidden lg:block"> {/* Add margin for spacing */}
          <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer" onClick={openModal}>
            <FontAwesomeIcon
              icon={faQuestionCircle} // Use the question mark icon
              className="text-gray-500"
            />
          </div>
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
            {/* <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Profile
            </a> */}
            
            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default AdminNavbar;
