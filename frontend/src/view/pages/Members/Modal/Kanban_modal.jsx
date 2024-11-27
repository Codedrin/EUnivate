import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';
import UserNameModal from '../../SuperAdmin/KanbanModals/UserNameModal';
import ObjectiveList from '../../SuperAdmin/KanbanModals/ObjectiveList';
import StatusDropdown from '../../SuperAdmin/KanbanModals/StatusDropdown';
import PriorityDropdown from '../../SuperAdmin/KanbanModals/PriorityDropdown';
import AttachmentSection from '../../SuperAdmin/KanbanModals/AttachmentSection';
import Dates from '../../SuperAdmin/KanbanModals/Dates';
import BarLoading from '../../SuperAdmin/Loading Style/Bar Loading/Barloader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Kanban_modal = ({ isOpen, onClose, projectId, onTaskSubmit }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState('');
  const [isUserNameModalOpen, setIsUserNameModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriorityDropdownOpen(false);
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectDetails();
      fetchUsers();
    }
  }, [isOpen, projectId]);

  const fetchProjectDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.accessToken;

      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await axios.get(`http://localhost:5000/api/users/sa-getnewproject/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Set project details logic here if needed
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/get-assignee?projectId=${projectId}`);
      setMembersList(response.data.invitedUsers); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!taskName || !startDate || !dueDate || !status || !priority || !selectedName) {
      toast.error('Please fill in all fields before submitting.');
      setLoading(false);
      return;
    }

    if (new Date(dueDate) < new Date(startDate)) {
      toast.error('Due Date cannot be earlier than Start Date.');
      setLoading(false);
      return;
    }

    try {
      const newTask = {
        taskName,
        objectives,
        assignee: selectedName,
        status,
        priority,
        startDate,
        dueDate,
        description,
        project: projectId,
      };

      const response = await axios.post('http://localhost:5000/api/users/sa-task', newTask);
      onTaskSubmit(response.data);
      toast.success('Task submitted successfully!');
      resetForm();
      onClose();
    } catch (error) {
      setLoading(false);
      console.error('Error saving task:', error);
      toast.error('Failed to save task.');
    }
  };

  const resetForm = () => {
    setTaskName('');
    setDescription('');
    setObjectives([]);
    setSelectedObjective(null);
    setSelectedName('');
    setStatus('');
    setStartDate('');
    setDueDate('');
    setSelectedFiles([]);
  };

  const toggleUserNameVisibility = () => {
    setIsUserNameModalOpen(true);
  };

  const handleNameSelect = (members) => {
    const memberNames = members.map(member => member.username).join(', ');
    setSelectedName(memberNames);  
  };

  const handleClickFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-end items-center z-50">
      <div
        className="bg-white p-6 w-96 max-h-[100vh] overflow-auto rounded-lg shadow-lg transform transition-all duration-500"
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">{taskName}</h2>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full py-2 px-3 text-black font-semibold"
            placeholder="Task Name"
          />
        </div>

        <div className="mb-4 flex justify-start space-x-3">
          <button
            className="flex items-center space-x-2"
            onClick={toggleUserNameVisibility}
          >
            <span>Assignee</span>
            <FaUser className="text-gray-500" />
            <span>{selectedName || 'Assign to'}</span>
          </button>
        </div>

        <Dates
          startDate={startDate}
          dueDate={dueDate}
          setStartDate={setStartDate}
          setDueDate={setDueDate}
        />

        <PriorityDropdown
          priority={priority}
          setPriority={setPriority}
          isDropdownOpen={isPriorityDropdownOpen}
          setIsDropdownOpen={setIsPriorityDropdownOpen}
          dropdownRef={dropdownRef}
        />
        <StatusDropdown
          status={status}
          setStatus={setStatus}
          isDropdownOpen={isStatusDropdownOpen}
          setIsDropdownOpen={setIsStatusDropdownOpen}
          dropdownRef={dropdownRef}
        />

        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full py-2 px-3"
            placeholder="Description"
            rows={4}
          />
        </div>

        <AttachmentSection
          fileInputRef={fileInputRef}
          handleClickFileInput={handleClickFileInput}
          handleFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
        />

        <ObjectiveList
          objectives={objectives}
          selectedObjective={selectedObjective}
          setObjectives={setObjectives}
          setSelectedObjective={setSelectedObjective}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? <BarLoading /> : 'Submit'}
          </button>
        </div>

        {isUserNameModalOpen && (
          <UserNameModal
            isOpen={isUserNameModalOpen}
            onClose={() => setIsUserNameModalOpen(false)}
            membersList={membersList}
            onSelect={handleNameSelect}
          />
        )}
      </div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
      />
    </div>,
    document.body
  );
};

export default Kanban_modal;
