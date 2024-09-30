import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const UserNameModal = ({ isOpen, onClose, membersList, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  // Filter the list based on the search term
  const filteredMembers = membersList.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (member) => {
    setSelectedMembers((prevSelected) => {
      if (prevSelected.includes(member)) {
        return prevSelected.filter((m) => m !== member);
      } else {
        return [...prevSelected, member];
      }
    });
  };

  const handleConfirm = () => {
    onSelect(selectedMembers);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg relative flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Select Assignees</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={16} />
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="appearance-none rounded border w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search by username"
          />
        </div>
        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`p-2 cursor-pointer rounded-md mb-2 ${ // Added 'mb-2' for spacing
                  selectedMembers.includes(member) ? 'bg-red-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => handleSelect(member)}
              >
                {member.username}
              </div>
            ))
          ) : (
            <p>No members found.</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 ml-2 rounded hover:bg-red-600"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserNameModal;
