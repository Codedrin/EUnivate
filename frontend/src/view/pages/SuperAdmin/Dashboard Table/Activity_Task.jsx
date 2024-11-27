import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { useWorkspace } from '../../../components/SuperAdmin/workspaceContext';  // Import workspace context

const Activity_Task = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const [userName, setUserName] = useState('');
    const [taskDetails, setTaskDetails] = useState({});
    const [projects, setProjects] = useState([]);
    const { selectedWorkspace } = useWorkspace();  // Get the selected workspace
    const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'; // Default image URL

    // Fetch user data and task details for each project
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserName(`${storedUser.firstName} ${storedUser.lastName}`);
            setProfilePicture(storedUser.profilePicture?.url || storedUser.profilePicture || defaultProfilePictureUrl);
        }

        const fetchProjectsAndTasks = async () => {
            if (!selectedWorkspace) return;  // Only proceed if a workspace is selected

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;

                if (!accessToken) {
                    console.error('No access token found. Please log in again.');
                    return;
                }

                // Fetch projects for the selected workspace
                const projectResponse = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        workspaceId: selectedWorkspace._id,  // Filter projects by workspace ID
                    }
                });

                setProjects(projectResponse.data);

                // Fetch tasks for each project
                const taskDetailsPromises = projectResponse.data.map(async (project) => {
                    const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const tasks = response.data.data;
                    return { projectId: project._id, tasks };
                });

                const details = await Promise.all(taskDetailsPromises);
                const taskDetailsMap = details.reduce((acc, { projectId, tasks }) => {
                    acc[projectId] = tasks;
                    return acc;
                }, {});

                setTaskDetails(taskDetailsMap);  // Set the task details for each project
            } catch (error) {
                console.error('Error fetching projects and tasks:', error);
            }
        };

        fetchProjectsAndTasks();
    }, [selectedWorkspace]);  // Re-fetch projects and tasks when the selected workspace changes

    const getTaskChanges = (task) => {
        let changesByUser = {};

        task.history.forEach((change) => {
            const parsedChanges = JSON.parse(change.changes);
            const username = change.modifiedBy?.username || 'Unknown User';
            const userProfilePicture = change.modifiedBy?.profilePicture?.url || change.modifiedBy?.profilePicture || defaultProfilePictureUrl;

            if (!changesByUser[username]) {
                changesByUser[username] = {
                    profilePicture: userProfilePicture,
                    changes: []
                };
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
        <div className="w-full h-full">
            <h2 className="text-medium font-semibold text-gray-800 mb-2">Activity</h2>
            <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm h-full overflow-y-auto">
                {allTasks.length > 0 ? (
                    allTasks.map((task) => {
                        const changesByUser = getTaskChanges(task);

                        return (
                            <div key={task._id} className="mb-4">
                                <div className="text-gray-800 font-medium text-sm mb-2">
                                    {task.taskName}
                                </div>

                                {/* Display changes grouped by user */}
                                {Object.entries(changesByUser).map(([username, userChanges], idx) => (
                                    <div key={idx} className="mt-4">
                                        <div className="flex items-center">
                                            <img
                                                src={userChanges.profilePicture}
                                                alt="Profile"
                                                className="w-6 h-6 rounded-full object-cover mr-2"
                                            />
                                            <span className="text-gray-600 text-sm font-semibold">
                                                {username}
                                            </span>
                                        </div>
                                        <ul className="pl-10">
                                            {userChanges.changes.map((change, idx) => (
                                                <li key={idx} className="text-sm text-gray-500 mb-2">
                                                    {change.type}{' '}
                                                    <span className="text-blue-500">
                                                        {typeof change.newValue === 'object' ? (
                                                            <ul>{change.newValue}</ul>
                                                        ) : (
                                                            change.newValue
                                                        )}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">No activity available</p>
                )}
            </div>
        </div>
    );
};

export default Activity_Task;
