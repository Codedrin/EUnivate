import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useWorkspace } from './workspaceContext';
import '../../components/SuperAdmin/Css/SideNav.css'; // Ensure this file exists

import {
  dashboard_logo,
  dashboard_sidenav_icon,
  activity_red,
  dashboard_red,
  messages_red,
  people_red,
  project_red,
  settings_red,
  task_red,
  activity_icon,
  messages_icon,
  people_icon,
  project_icon,
  settings_icon,
  task_icon,
} from '../../../constants/assets';

const SideNav = ({ isNavOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [workspaces, setWorkspaces] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setIsDropdownOpen(false);

    // Store workspace details in localStorage
    localStorage.setItem('currentWorkspaceId', workspace._id);
    localStorage.setItem('currentWorkspaceTitle', workspace.workspaceTitle);

    navigate(`/superadmin/dashboard?workspaceId=${workspace._id}&workspaceTitle=${workspace.workspaceTitle}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const workspaceId = params.get('workspaceId');
    const workspaceTitle = params.get('workspaceTitle');

    if (workspaceId && workspaceTitle) {
      setSelectedWorkspace({ _id: workspaceId, workspaceTitle });
    } else {
      // Check if there's a workspace saved in localStorage
      const storedWorkspaceId = localStorage.getItem('currentWorkspaceId');
      const storedWorkspaceTitle = localStorage.getItem('currentWorkspaceTitle');

      if (storedWorkspaceId && storedWorkspaceTitle) {
        setSelectedWorkspace({ _id: storedWorkspaceId, workspaceTitle: storedWorkspaceTitle });
      }
    }

    const fetchWorkspaces = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.accessToken) {
        setError('User is not authenticated.');
        return;
      }

            try {
                const response = await axios.get('https://eunivate-jys4.onrender.com/api/users/workspaces', {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });

        if (response.status === 200) {
          setWorkspaces(response.data);
        } else {
          setError('Failed to load workspaces');
        }
      } catch (err) {
        setError();
      }
    };

    fetchWorkspaces();
  }, [location.search, setSelectedWorkspace]);

  const closeModal = () => {
    setIsModalOpen(false);
    setWorkspaceTitle('');
    setError('');
    setAlertMessage('');
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceTitle.trim()) {
        setError('Workspace title is required');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = user ? user.accessToken : null;

    if (!accessToken) {
        setError('No access token found. Please log in again.');
        return;
    }

    try {
        const response = await axios.post(
            'https://eunivate-jys4.onrender.com/api/users/workspace',
            { workspaceTitle },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.status === 201) {
            const newWorkspace = response.data;
            localStorage.setItem('currentWorkspaceId', newWorkspace._id);

            setAlertMessage('Workspace created successfully!');
            closeModal();
            setWorkspaces([...workspaces, newWorkspace]);

            navigate(`/superadmin/dashboard?workspaceId=${newWorkspace._id}&workspaceTitle=${newWorkspace.workspaceTitle}`);
        }
    } catch (err) {
        const errorMessage = err.response?.data?.error || 'An error occurred while creating the workspace';
        
        if (errorMessage.includes('duplicate key error')) {
            alert('A workspace with this title already exists. Please choose a different title.');
        } else {
            console.error('Error creating workspace:', errorMessage);
            setError(errorMessage);
        }
    }
};


    return (
        <div
            className={`side-nav-admin fixed top-0 left-0 h-full bg-red-750 shadow-lg transition-transform transform ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:w-[250px] z-30 w-[250px]`}  
        >
            <div className="dashboard-logo flex items-center p-4">
                <img
                    src={dashboard_logo}
                    alt="EUnivate Logo"
                    className="h-7 mr-3"
                />
                <h2 className="text-lg font-bold text-white mt-3">EUnivate</h2>
            </div>

            <ul className="list-none p-0">
                {[
                    { to: "dashboard", text: "Dashboard", icon: dashboard_sidenav_icon, hoverIcon: dashboard_red },
                    { to: "project", text: "Project", icon: project_icon, hoverIcon: project_red },
                    { to: "task", text: "My Task", icon: task_icon, hoverIcon: task_red },
                    { to: "activity", text: "Activity", icon: activity_icon, hoverIcon: activity_red },
                    { to: "people", text: "People", icon: people_icon, hoverIcon: people_red },
                    { to: "messages", text: "Messages", icon: messages_icon, hoverIcon: messages_red },
                    { to: "settings", text: "Settings", icon: settings_icon, hoverIcon: settings_red },
                ].map((item, index) => (
                    <li className="mb-2" key={index}>
                        <Link
                            to={item.to}
                            className="group relative flex items-center p-2 bg-red-750 hover:bg-red-700 rounded-md transition-all"
                        >
                            <img
                                src={item.icon}
                                alt={`${item.text} Icon`}
                                className="absolute h-5 group-hover:hidden"
                            />
                            <img
                                src={item.hoverIcon}
                                alt={`${item.text} Icon Red`}
                                className="absolute h-5 hidden group-hover:block -translate-y-1"
                            />
                            <span className="ml-10 text-red-750 group-hover:text-red-750">
                                {item.text}
                            </span>
                        </Link>
                    </li>
                ))} 
            </ul>

            <div className="absolute bottom-0 left-0 w-full p-4 text-white text-center">
                <p className="font-size">Workspace 
                    <button onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} className="faPlusWorkspace"/>
                    </button>
                </p>   

                <div className="workspaceSelect relative inline-block">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="workspaceDropdown flex items-center justify-between bg-transparent text-white">
                        <span>{selectedWorkspace ? selectedWorkspace.workspaceTitle : 'Select Workspace'}</span>
                        <FontAwesomeIcon icon={isDropdownOpen ? faChevronUp : faChevronDown} className="faChevronWS" />
                    </button>

                    {isDropdownOpen && (
    <ul className="workspaceList absolute z-10 bottom-full mb-2 bg-white text-black shadow max-h-48 overflow-y-scroll rounded hide-scrollbar">
        {workspaces.length > 0 ? (
            workspaces.map((workspace) => (
                <li
                    key={workspace._id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className="p-2 hover:bg-gray-400 cursor-pointer"
                >
                    {workspace.workspaceTitle}
                </li>
            ))
        ) : (
            <li className="p-2 text-gray-500">No workspaces available</li>
        )}
    </ul>
)}

                </div>
            </div>

            {/* Modal for adding a new workspace */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex ">
                    <div
                        className="addWorkspaceModal ml-1 bg-white p-2 rounded-md shadow-lg absolute bottom-20 h-50 w-60 z-60"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-1 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                            aria-label="Close Modal"
                        >
                            &times;
                        </button>

                        {/* Error Message */}
                        {error && <p className="text-red-500 mb-2">{error}</p>}

                        {/* Workspace Creation Form */}
                        <form onSubmit={handleCreateWorkspace}>
                            <label className="block m-1 text-gray-700">Add Workspace</label>
                            <input
                                type="text"
                                placeholder="Enter workspace title"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                                value={workspaceTitle}
                                onChange={(e) => setWorkspaceTitle(e.target.value)}
                                required
                            />

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mr-10 px-5 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;
