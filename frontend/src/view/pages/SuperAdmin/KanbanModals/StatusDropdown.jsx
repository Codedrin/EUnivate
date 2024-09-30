import React, { useState } from 'react';

const StatusDropdown = ({ status, setStatus, dropdownRef }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsStatusDropdownOpen(false);
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  return (
    <div className="mb-4 flex items-center space-x-4">
      <label className="block text-gray-700 text-sm font-semibold">Status</label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleStatusDropdown}
          className="text-gray-700 px-4 py-2 border-gray-300 rounded flex items-center space-x-2"
        >
          <span>{status || 'Select Status'}</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isStatusDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-0 bg-white border left-0 border-gray-300 rounded shadow-lg mt-1 w-48 z-10"
          >
            {['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleStatusChange(item)}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;
