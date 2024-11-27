import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

const KanbanG = ({ isOpen, onClose, projectId, selectedTask }) => {
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchUsers();
    }
  }, [isOpen, projectId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/get-assignee?projectId=${projectId}`);
      setMembersList(response.data.invitedUsers); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (!isOpen || !selectedTask) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-end items-center z-50">
      <div className="bg-white p-6 w-96 max-h-[100vh] overflow-auto rounded-lg shadow-lg transform transition-all duration-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{selectedTask.taskName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Assignee */}
        <div className="mb-4 flex justify-start space-x-3">
          <span className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <span>Assigned to:</span>
            <span>{selectedTask.assignee.map(member => member.username).join(', ')}</span>
          </span>
        </div>

        {/* Dates */}
        <div className="mb-4">
          <p><strong>Start Date:</strong> {new Date(selectedTask.startDate).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <p><strong>Priority:</strong> {selectedTask.priority}</p>
        </div>

        {/* Status */}
        <div className="mb-4">
          <p><strong>Status:</strong> {selectedTask.status}</p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p><strong>Description:</strong></p>
          <p>{selectedTask.description}</p>
        </div>

        {/* Attachments */}
        {selectedTask.attachment && selectedTask.attachment.length > 0 && (
          <div className="mb-4">
            <p><strong>Attachments:</strong></p>
            <div className="mt-4 flex overflow-x-auto space-x-2 py-2 justify-center">
              {selectedTask.attachment.map((attachment, index) => (
                <img
                  key={index}
                  src={attachment.url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full sm:w-40 h-48 sm:h-36 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Objectives */}
        {selectedTask.objectives && selectedTask.objectives.length > 0 && (
          <div className="mb-4">
            <p><strong>Objectives:</strong></p>
            <ul className="list-disc pl-5">
              {selectedTask.objectives.map((objective, index) => (
                <li key={index}>
                  {objective.text} - {objective.done ? 'Completed' : 'Not Completed'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default KanbanG;
