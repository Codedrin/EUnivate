import React, { useState } from 'react';
import { FaFlag } from 'react-icons/fa';

const PriorityDropdown = ({ priority, setPriority, dropdownRef }) => {
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    setIsPriorityDropdownOpen(false);
  };

  const togglePriorityDropdown = () => {
    setIsPriorityDropdownOpen(!isPriorityDropdownOpen);
  };

  return (
    <div className="mb-4 flex items-center space-x-4">
                 <label className="block text-gray-700 text-sm font-semibold">Priority</label>
                 <div className="flex items-center space-x-3 relative">
                   <div>
                     <FaFlag 
                      className={`text-xl ${priority === 'easy' ? 'text-green-500' : priority === 'medium' ? 'text-yellow-500' : priority === 'hard' ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </div>
                  <button
                    onClick={togglePriorityDropdown}
                    className={`text-gray-700 ${priority ? '' : 'text-gray-500'} flex items-center space-x-2`}
                  >
                    
                    <span className="text-gray-700">{priority || 'Level'}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                  </button>
                  {isPriorityDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full right-0 mt-2 w-40 left-0 bg-white shadow-lg border border-gray-300 rounded z-50"
                    >
                      <button
                        onClick={() => handlePriorityChange('easy')}
                        className="w-full px-4 py-2 text-green-500 hover:bg-gray-100 text-left flex items-center space-x-2"
                      >
                        <FaFlag className="text-xl text-green-500" />
                        <span>Easy</span>
                      </button>
                      <button
                        onClick={() => handlePriorityChange('medium')}
                        className="w-full px-4 py-2 text-yellow-500 hover:bg-gray-100 text-left flex items-center space-x-2"
                      >
                        <FaFlag className="text-xl text-yellow-500" />
                        <span>Medium</span>
                      </button>
                      <button
                        onClick={() => handlePriorityChange('hard')}
                        className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-left flex items-center space-x-2"
                      >
                        <FaFlag className="text-xl text-red-500" />
                        <span>Hard</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
  );
};

export default PriorityDropdown;
