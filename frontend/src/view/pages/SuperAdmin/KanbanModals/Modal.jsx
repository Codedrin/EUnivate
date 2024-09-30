import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';
import UserNameModal from './UserNameModal';
import ObjectiveList from './ObjectiveList';
import StatusDropdown from './StatusDropdown';
import PriorityDropdown from './PriorityDropdown';
import AttachmentSection from './AttachmentSection';
import Dates from './Dates';
import BarLoading from '../Loading Style/Bar Loading/Barloader';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast notifications


const Modal = ({ isOpen, onClose, projectId, onTaskSubmit }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [project, setProject] = useState({});
  const [selectedName, setSelectedName] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
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

  // Fetch project details when modal is open
  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectDetails();
    }
  }, [isOpen, projectId]);

  // Fetch members list when modal is open
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

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
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/get-assignee?projectId=${projectId}`);
      setMembersList(response.data.invitedUsers); // Assuming the response structure
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const handleSaveattachment = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'EunivateImage');
    formData.append('cloud_name', 'dzxzc7kwb');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzxzc7kwb/image/upload',
        formData
      );
      return { publicId: response.data.public_id, url: response.data.secure_url };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    // Validation checks
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
  
    // Upload selected files to Cloudinary
    let uploadedImages = [];
    for (const file of selectedFiles) {
      try {
        const result = await handleSaveattachment(file);
        uploadedImages.push({
          publicId: result.publicId,
          url: result.url
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload one or more images.');
        setLoading(false);
        return;
      }
    }
  
    try {
      const assigneeIds = selectedName.split(', ').map(name => {
        const user = membersList.find(member => member.username === name);
        return user?.id;
      });
  
      const newTask = {
        taskName,
        objectives, // Now passed as an array of objects
        assignee: assigneeIds,
        status,
        priority,
        startDate,
        dueDate,
        attachment: uploadedImages,
        description,
        questionUpdate: question,
        project: projectId,
      };
  
      const response = await axios.post('http://localhost:5000/api/users/sa-task', newTask);
      console.log('Task created:', response.data);
      onTaskSubmit(newTask);
      toast.success('Task submitted successfully!');
  
      // Clear the fields
      setTaskName('');
      setDescription('');
      setObjectives([]);
      setSelectedObjective(null);
      setSelectedName('');
      setStatus('');
      setStartDate('');
      setDueDate('');
      setQuestion('');
      setSelectedFiles([]);
      onClose();
  
    } catch (error) {
      setLoading(false);
      console.error('Error saving task:', error);
      toast.error('Failed to save task.');
    }
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

  const handleImageChange = (index, event) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index] = event.target.files[0];
    setSelectedFiles(updatedFiles);
  };

  const handleImageDelete = (file) => {
    const updatedFiles = selectedFiles.filter((f) => f !== file);
    setSelectedFiles(updatedFiles);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-end items-center z-50">
      <div
        className={`bg-white p-6 w-96 max-h-[100vh] overflow-auto rounded-lg shadow-lg transform transition-all duration-500 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mb-4">
          <h2>{project?.projectName}</h2>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="appearance-none rounded w-full py-2 px-3 text-xl text-black font-semibold leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Write a task name"
          />
        </div>

        <div className="mb-4 flex justify-start space-x-3">
          <button
            className="flex items-center space-x-2 bg-transparent border-none outline-none focus:outline-none"
            onClick={toggleUserNameVisibility}
          >
            <span className="text-gray-700 text-sm font-semibold">Assignee</span>
            <FaUser className="text-gray-500 text-lg bg-transparent rounded-lg border" />
            <span className='text-sm text-gray-500'>{selectedName || 'Assign to'}</span>
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

        <div className="mb-4 flex justify-start items-center">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="appearance-none rounded border w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Description"
            rows={4}
          />
        </div>

        <AttachmentSection
          fileInputRef={fileInputRef}
          handleClickFileInput={handleClickFileInput}
          handleFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
        />

        <ObjectiveList
          objectives={objectives}
          selectedObjective={selectedObjective}
          setObjectives={setObjectives}
          setSelectedObjective={setSelectedObjective}
        />

        <div className="mb-4 flex justify-start items-center">
          <input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="appearance-none rounded border w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ask question or post an update"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
  <button
    onClick={handleSubmit}
    className="bg-red-600 w-full text-white px-4 py-2 rounded hover:bg-red-700 flex justify-center items-center"
    disabled={loading}
  >
    {loading ? <BarLoading  /> : 'Submit'}
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
        position="top-left" // Set the position for the toast notifications
        autoClose={5000} // Duration before the toast auto-closes
        hideProgressBar={false} // Show the progress bar
        newestOnTop={false} // Show newest toast on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>,
    document.body
  );
};

export default Modal;
