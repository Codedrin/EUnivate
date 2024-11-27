import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';
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
} from "../../../constants/assets"; 
import '../../components/SuperAdmin/Css/SideNav.css';

const MemberLayout = ({ isNavOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const workspaceId = params.get('workspaceId');
        const workspaceTitle = params.get('workspaceTitle');

        if (workspaceId && workspaceTitle) {
            setSelectedWorkspace({ _id: workspaceId, workspaceTitle });
            localStorage.setItem('currentWorkspaceId', workspaceId);
            localStorage.setItem('currentWorkspaceTitle', workspaceTitle);
        } else {
            // Retrieve stored workspace if available
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
                setError(`Failed to load workspaces: ${err.message}`);
            }
        };

        fetchWorkspaces();
    }, [location.search, setSelectedWorkspace]);

    const handleWorkspaceSelect = (workspace) => {
        setSelectedWorkspace(workspace);
        setIsDropdownOpen(false);
        localStorage.setItem('currentWorkspaceId', workspace._id);
        localStorage.setItem('currentWorkspaceTitle', workspace.workspaceTitle);
        navigate(`/member/projectmem?workspaceId=${workspace._id}&workspaceTitle=${workspace.workspaceTitle}`);
    };

    return (
        <div
            className={`side-nav-admin fixed top-0 left-0 h-full bg-red-750 shadow-lg transition-transform transform ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:w-[250px] z-30`}
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
                {[{
                    to: "dashboardmem", text: "Dashboard",  icon: dashboard_sidenav_icon, hoverIcon: dashboard_red
                },
                    
                    {
                    to: "projectmem", text: "Project", icon: project_icon, hoverIcon: project_red
                },
                {
                    to: "taskmem", text: "My Task", icon: task_icon, hoverIcon: task_red
                },
                {
                    to: "message", text: "Messages", icon: messages_icon, hoverIcon: messages_red
                },
                {
                    to: "settings_Members", text: "Settings", icon: settings_icon, hoverIcon: settings_red
                }].map((item, index) => (
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
                <p className="font-size">Workspace</p>

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
        </div>
    );
};

export default MemberLayout;
