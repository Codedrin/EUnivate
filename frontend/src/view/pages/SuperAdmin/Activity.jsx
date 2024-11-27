import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import { format } from 'date-fns'; // For date formatting
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';

const Activity = () => {
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [taskDetails, setTaskDetails] = useState({});
    const [userName, setUserName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const { selectedWorkspace } = useWorkspace(); 
    const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png';

    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    useEffect(() => {
        if (!selectedWorkspace) return;

        const fetchProjectsAndTasks = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;

                setUserName(`${user.firstName} ${user.lastName}`);
                setProfilePicture(user.profilePicture?.url || user.profilePicture || defaultProfilePictureUrl);

                // Fetch projects based on the selected workspace
                const projectResponse = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: { workspaceId: selectedWorkspace._id }
                });

                setProjects(projectResponse.data);

                const taskDetailsPromises = projectResponse.data.map(async (project) => {
                    const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const tasks = taskResponse.data.data;
                    return { projectId: project._id, tasks };
                });

                const details = await Promise.all(taskDetailsPromises);
                const taskDetailsMap = details.reduce((acc, { projectId, tasks }) => {
                    acc[projectId] = tasks;
                    return acc;
                }, {});
                setTaskDetails(taskDetailsMap);
            } catch (error) {
                console.error('Error fetching projects and tasks:', error);
            }
        };

        fetchProjectsAndTasks();
    }, [selectedWorkspace]);

    const getTaskChanges = (task) => {
        let changesByUser = {};

        task.history.forEach((change) => {
            const parsedChanges = JSON.parse(change.changes);
            const username = change.modifiedBy?.username || 'Unknown User';
            const userPicture = change.modifiedBy?.profilePicture?.url || change.modifiedBy?.profilePicture || defaultProfilePictureUrl;

            if (!changesByUser[username]) {
                changesByUser[username] = { profilePicture: userPicture, changes: [] };
            }

            Object.keys(parsedChanges).forEach((key) => {
                let changeType = '';
                let newValue = parsedChanges[key];

                switch (key) {
                    case 'taskName':
                        changeType = 'changed task name to';
                        break;
                    case 'description':
                        changeType = 'added new description';
                        break;
                    case 'objectives':
                        changeType = 'updated objectives';
                        newValue = parsedChanges[key].map((objective, index) => (
                            <li key={index}>
                                <span>{objective.text}</span>
                                {objective.done ? (
                                    <span className="text-green-500 ml-2">(Completed)</span>
                                ) : (
                                    <span className="text-red-500 ml-2">(Not Completed)</span>
                                )}
                            </li>
                        ));
                        break;
                    case 'priority':
                        changeType = 'changed the priority to';
                        break;
                    case 'status':
                        changeType = 'changed the status to';
                        break;
                    case 'startDate':
                        changeType = 'changed start date to';
                        newValue = format(new Date(parsedChanges[key]), 'MMM d, yyyy hh:mm a');
                        break;
                    case 'dueDate':
                        changeType = 'changed due date to';
                        newValue = format(new Date(parsedChanges[key]), 'MMM d, yyyy hh:mm a');
                        break;
                    case 'attachment':
                        changeType = 'added new attachment';
                        newValue = Array.isArray(parsedChanges[key])
                            ? parsedChanges[key].map((attachment, index) => (
                                <div key={index}>
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                        {attachment.publicId}
                                    </a>
                                </div>
                            ))
                            : (
                                <a href={parsedChanges[key].url} target="_blank" rel="noopener noreferrer">
                                    {parsedChanges[key].url}
                                </a>
                            );
                        break;
                    case 'assignee':
                        changeType = 'assigned to';
                        newValue = Array.isArray(parsedChanges[key])
                            ? parsedChanges[key].map((assignee) => assignee.username).join(', ')
                            : 'Other User';
                        break;
                    default:
                        changeType = 'made an update';
                        break;
                }

                changesByUser[username].changes.push({
                    type: changeType,
                    newValue,
                    modifiedAt: change.modifiedAt
                });
            });
        });

        return changesByUser;
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-lg md:text-2xl font-medium text-gray-800 hidden md:block">Activity</h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            <div className="bg-white p-4 md:p-6 border border-gray-300 rounded-lg shadow-sm">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="mb-6">
                            <div className="flex items-center">
                                <h2 className="text-lg md:text-2xs text-gray-800">{project.projectName}</h2>
                                <div className="text-gray-500 text-xs md:text-sm flex items-center ml-2">
                                    <span>&#8226;</span>
                                    <span className="ml-2">
                                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>
                            <ul className="mt-2 relative">
                                {taskDetails[project._id] && taskDetails[project._id].length > 0 ? (
                                    taskDetails[project._id].map((task) => {
                                        const taskChanges = getTaskChanges(task);
                                        const changeGroups = Object.entries(taskChanges).flatMap(([username, { profilePicture, changes }]) =>
                                            changes.map((change) => ({
                                                ...change,
                                                profilePicture,
                                                username // Use the actual username here
                                            }))
                                        );

                                        return (
                                            <div key={task._id} className="mb-6">
                                                <div className="mb-2">
                                                    <span className="text-lg md:text-2xl font-semibold">{task.taskName}</span>
                                                </div>

                                                {changeGroups.map((change, index) => (
                                                    <li key={index} className="mb-4 flex items-start">
                                                        <div className="flex items-center">
                                                            <span className="text-violet-500 text-xl md:text-2xl">&#8226;</span>
                                                            <img
                                                                src={change.profilePicture || defaultProfilePictureUrl}
                                                                alt="Profile"
                                                                className="w-6 h-6 md:w-8 md:h-8 rounded-full ml-2"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col ml-3">
                                                            <div className="text-sm md:text-base text-gray-700">
                                                                <span className="font-medium mr-1">{change.username}</span>
                                                                <span className="text-gray-500">{change.type}</span>
                                                                <span className="text-blue-500 ml-1">{change.newValue}</span>
                                                            </div>
                                                            <span className="text-xs md:text-sm text-gray-500">
                                                                {format(new Date(change.modifiedAt), 'MMM dd, yyyy hh:mm a')}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-lg text-gray-500">No tasks available</p>
                                )}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-500">No projects available</p>
                )}
            </div>
        </div>
    );
};

export default Activity;
