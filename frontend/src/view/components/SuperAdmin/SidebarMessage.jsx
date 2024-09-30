
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCircle, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../../../admin.css';

const SidebarMessage = () => {
  return (
    <div className="bg-white right-4 bottom-0 flex flex-col border-r border-gray-300 sidebar-message-content"> {/* Reduced width */}
      {/* About Section */}
      <div className="p-3"> {/* Reduced padding */}
        <h2 className="text-lg font-semibold mb-2 ml-2">About</h2> {/* Reduced font size and margin */}
        <div className="bg-gray-100 p-3 rounded-lg"> {/* Reduced padding */}
          <div className="mb-2"> {/* Reduced margin */}
            <p className="text-sm font-medium text-gray-600 mb-2">Topic</p> {/* Reduced margin */}
            <p className="text-sm text-gray-800">All about monster hunter world game is here.</p>
          </div>
          <div className="mb-2"> {/* Reduced margin */}
            <p className="text-sm font-medium text-gray-600 mb-2">Description</p> {/* Reduced margin */}
            <p className="text-sm text-gray-800">
              In this channel we can collaborate and play monster hunter together with our friends.
            </p>
          </div>
        </div>
        <hr className="border border-gray-200 mt-3" /> {/* Reduced top margin */}
      </div>

      {/* Members Section */}
      <div className="p-3 flex-1 ml-2 overflow-y-auto"> {/* Reduced padding */}
        <div className="flex justify-between items-center mb-3"> {/* Reduced margin */}
          <h2 className="text-lg font-semibold">Member <span className='bg-orange-500 text-white rounded-lg pl-2 pr-2 member-count'>1,042</span></h2> {/* Reduced font size */}
          <FontAwesomeIcon icon={faUserPlus} className="text-gray-500 cursor-pointer" />
        </div>
        <div className="team mb-4"> {/* Reduced margin */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-xl mr-2" /> {/* Reduced icon size and margin */}
              <div>
                <h3 className="text-sm font-semibold">Team name</h3>
                <p className="text-xs text-gray-600">4 members</p> {/* Reduced font size */}
              </div>
            </div>
            <FontAwesomeIcon icon={faCircle} className="text-gray-300 text-xs" /> {/* Reduced icon size */}
          </div>
        </div>

        {/* User List */}
        <div className="mb-2"> {/* Reduced margin */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 text-xl mr-2" /> {/* Reduced icon size and margin */}
              <div>
                <h3 className="text-sm font-semibold">Dan Carlo</h3> {/* Reduced font size */}
                <p className="text-xs text-gray-600">Web Developer</p> {/* Reduced font size */}
              </div>
            </div>
            <FontAwesomeIcon icon={faCircle} className="text-green-500 text-xs" /> {/* Reduced icon size */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMessage;


