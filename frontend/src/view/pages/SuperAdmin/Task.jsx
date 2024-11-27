import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import { FaFlag, FaCheckCircle } from 'react-icons/fa';
import BoxLoader from './Loading Style/Box Loading/BoxLoader';
import TaskModal from './Task Modal/TaskModal';
import abt1Image from '../../../assets/Filter.png';  // Update the path if needed
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext'; // Import your workspace context

const Task = () => {
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const { selectedWorkspace } = useWorkspace(); // Use the workspace context to get the selected workspace

    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short' }; 
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Fetch tasks with objectives and assignees
    useEffect(() => {
        const fetchTasks = async () => {
          setLoading(true);
          console.log('Fetching tasks...');
          try {
            const user = JSON.parse(localStorage.getItem('user'));
            const accessToken = user ? user.accessToken : null;
      
            if (!accessToken) {
              console.error('No access token found. Please log in again.');
              setLoading(false);
              return;
            }
      
            if (!selectedWorkspace) {
              console.error('No workspace selected.');
              setLoading(false);
              return;
            }
      
            // Fetch projects associated with the selected workspace
            const projectResponse = await axios.get('https://eunivate-backend-56iw.onrender.com/api/users/sa-getnewproject', {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { workspaceId: selectedWorkspace._id },
            });
      
            console.log('Project Response:', projectResponse.data);
      
            const tasksList = [];
      
            await Promise.all(
              projectResponse.data.map(async (project) => {
                try {
                  // Fetch tasks for the current project
                  const taskResponse = await axios.get(`https://eunivate-backend-56iw.onrender.com/api/users/sa-tasks/${project._id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                  });
      
                  // Log the task response for debugging
                  console.log(`Task Response for Project ${project.projectName}:`, taskResponse.data);
      
                  // Check if taskResponse.data.data is an array
                  if (taskResponse.data && Array.isArray(taskResponse.data.data)) {
                    const tasksWithProject = taskResponse.data.data.map(task => ({
                      ...task,
                      projectName: project.projectName,
                      objectives: task.objectives || [],
                      assignedUsers: task.assignedUsers || [],
                      invitedUsers: project.invitedUsers || [],
                    }));
                    tasksList.push(...tasksWithProject);
                  } else if (taskResponse.data && typeof taskResponse.data === 'object') {
                    console.warn('Expected an array, but received an object. Handling this case.');
                    // Handle object case (if the response is an object with a single task)
                    const task = taskResponse.data.data || {};
                    const tasksWithProject = {
                      ...task,
                      projectName: project.projectName,
                      objectives: task.objectives || [],
                      assignedUsers: task.assignedUsers || [],
                      invitedUsers: project.invitedUsers || [],
                    };
                    tasksList.push(tasksWithProject);
                  } else {
                    console.error('Task response data is not in the expected format:', taskResponse.data);
                  }
                } catch (taskError) {
                  console.error(`Error fetching tasks for project ${project._id}:`, taskError);
                }
              })
            );
      
            console.log('All tasks:', tasksList);
      
            setTasks(tasksList);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
          }
        };
      
        fetchTasks();
      }, [selectedWorkspace]);
      
    
    

    const openModal = (task) => {
        console.log('Opening modal for task:', task);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log('Closing modal...');
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const getPriorityColor = (priority) => {
        console.log('Getting priority color for:', priority);
        switch (priority.toLowerCase()) {
            case 'easy':
                return 'text-green-500';
            case 'medium':
                return 'text-yellow-500';
            case 'hard':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const renderStatusIcon = (status) => {
        console.log('Rendering status icon for:', status);
        return status.toLowerCase() === 'done' ? (
            <FaCheckCircle className="text-green-500 text-2xl" />
        ) : (
            <div className="w-6 h-6 rounded-full border border-gray-400"></div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-xl font-medium text-gray-800 hidden md:block">
                        Task
                    </h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            <div className="mt-4 flex gap-4">
                <div className="p-6 bg-white border rounded-lg shadow-md w-full">
                <div className="text-gray-600 text-sm md:text-base">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 font-medium mb-2">
    {/* Only show Task title on medium and larger screens */}
    <p className="text-xs md:text-sm">Task</p> 
    {/* Hide everything else on mobile */}
    <p className="hidden md:block text-center">Due Date</p>
    <p className="hidden md:block text-center">Priority</p>
    <p className="hidden md:block text-center">Objectives</p>
    <p className="hidden md:block text-center">Status</p>
    <p className="hidden md:block text-right">Project</p> {/* Hide Project on mobile */}
</div>


    {loading ? (
        <div className="flex justify-center">
            <BoxLoader />
        </div>
    ) : (
        <ul className="space-y-2">
        {tasks.map((task) => (
            <li
                key={task._id}
                className="relative grid grid-cols-3 md:grid-cols-6 gap-4 items-center mb-1 py-4 bg-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => openModal(task)}
            >
                <div className="absolute inset-0 bg-transparent hover:bg-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out -mx-4 py-4"></div>
    
                {/* On mobile, only show the check circle and task name */}
                <div className="flex items-center relative z-10 col-span-3 md:col-span-1">
                    {renderStatusIcon(task.status)}
                    <p className="ml-2 font-bold text-sm md:text-base">{task.taskName}</p>
                </div>
    
                {/* Only visible on medium screens and above */}
                <p className="hidden md:block text-center relative z-10">{formatDate(task.dueDate)}</p>
                <div className="hidden md:flex items-center justify-center relative z-10">
                    <FaFlag className={`mr-1 text-xs md:text-sm ${getPriorityColor(task.priority)}`} />
                    <p className="text-xs md:text-sm">{task.priority}</p>
                </div>
                
              {/* Objectives visible only on medium screens and above */}
<p className="hidden md:flex text-center relative items-center justify-center text-xs md:text-sm">
    <img src={abt1Image} alt="Objective Icon" className="w-4 h-4 md:w-5 md:h-5 mr-1" />
    {task.objectives.length} Objectives
</p>

                <p className="text-center relative text-sm md:text-base hidden md:block">{task.status}</p>
                <p className="hidden md:block text-right relative z-10 text-sm md:text-base">{task.projectName}</p>
            </li>
        ))}
    </ul>
    
    )}

</div>

                </div>
            </div>

            {/* Pass modal props to TaskModal component */}
            <TaskModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={closeModal}
                formatDate={formatDate}
            />
        </div>
    );
};

export default Task;

    