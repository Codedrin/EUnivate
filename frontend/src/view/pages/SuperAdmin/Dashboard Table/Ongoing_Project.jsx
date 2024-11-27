import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { useWorkspace } from '../../../components/SuperAdmin/workspaceContext'; // Import the workspace context
import BoxLoader from '../Loading Style/Box Loading/BoxLoader'; // Add loader for better user experience

const Ongoing_Project = ({ projects, taskDetails, calculateProgress }) => {
    const [loading, setLoading] = useState(false); // Loading state
    const { selectedWorkspace } = useWorkspace();  // Fetch the selected workspace from the context

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);  // Start loading
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;

                if (!accessToken) {
                    console.error('No access token found. Please log in again.');
                    setLoading(false);
                    return;
                }

                // Check if a workspace is selected
                if (!selectedWorkspace) {
                    console.error('No workspace selected.');
                    setLoading(false);
                    return;
                }

                console.log(`Fetching projects for workspace: ${selectedWorkspace.workspaceTitle} (ID: ${selectedWorkspace._id})`);

                // Fetch the ongoing projects related to the selected workspace
                const response = await axios.get('https://eunivate-jys4.onrender.com/api/users/sa-getnewproject', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        workspaceId: selectedWorkspace._id,  // Filter by workspace ID
                    }
                });

                setProjects(response.data);  // Store the fetched projects in the state
                setLoading(false);  // End loading
            } catch (error) {
                console.error('Error fetching projects:', error);
                setLoading(false);
            }
        };

        fetchProjects();  // Call the fetch function when the component mounts or when the workspace changes
    }, [selectedWorkspace]);  // Re-fetch projects when selectedWorkspace changes

    const Tooltip = ({ children, title }) => {
        return (
          <div className="relative group">
            {children}
            <div
              className="absolute hidden group-hover:flex bg-gray-500 text-white text-xs rounded-md p-2 whitespace-nowrap -top-10 left-1/2 transform -translate-x-1/2"
              style={{ zIndex: 10 }}
            >
              {title}
            </div>
          </div>
        );
      };

    return (
        <div className="flex flex-col">
            <h2 className="text-medium font-semibold text-gray-800 mb-2">Ongoing Projects</h2>
            <div className="ongoing-projects">
                {loading ? (
                    <div className="flex justify-center">
                        <BoxLoader />  {/* Show loader while projects are being fetched */}
                    </div>
                ) : projects.length > 0 ? (
                    projects.map((project, index) => (
                        <div key={index} className="bg-white p-2 border border-gray-200 rounded-md shadow-md mb-4 flex items-center space-x-4 justify-between">
                            {project.thumbnail && (
                                <img 
                                    src={project.thumbnail.url} 
                                    alt={project.projectName} 
                                    className="w-20 h-20 object-cover rounded-md" 
                                />
                            )}
                            <div className="flex-grow">
                                <p className="text-gray-800 font-semibold text-sm2">{project.projectName}</p>
                                <div className="flex items-center text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarAlt className="w-3 h-3 " />
                                        <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 ml-5">
                                            <FaPaperclip className="w-3 h-3" />
                                            <p>{taskDetails[project._id]?.attachmentsCount || 0}</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <FaCheckCircle className="w-3 h-3" />
                                            <p>{taskDetails[project._id]?.objectivesCount || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-auto mr-3 -space-x-3">
                                        {project.invitedUsers && project.invitedUsers.slice(0, 3).map((user, index  ) => (
                                    <Tooltip key={index} title={`${user.firstName} ${user.lastName}`}>
                                                    <img
                                                        src={user.profilePicture?.url || user.profilePicture} // Ensure it falls back to a default if no picture
                                                        alt={user.username || 'Profile Picture'}
                                                    className="w-6 h-6 rounded-full object-cover border border-gray-300"
                                                    />
                                            </Tooltip>
                                        ))}
                                        {project.invitedUsers.length > 3 && (
                                            <div className="text-sm text-gray-500">+{project.invitedUsers.length - 3}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1 relative">
                                        <div
                                            className="bg-green-500 h-1 rounded-full"
                                            style={{ width: `${calculateProgress(project._id)}%` }}
                                        ></div>
                                    </div>
                                    <p className="ml-2 text-gray-500">
                                        {`${Math.floor(calculateProgress(project._id))}%`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No ongoing projects</p>
                )}
            </div>
        </div>
    );
};

export default Ongoing_Project;
