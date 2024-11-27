
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../admin.css';
import AdminNavbarG from '../../components/Guest/AdminNavbarG';
import { FaFlag, FaCheckCircle } from 'react-icons/fa';
import BoxLoader from '../SuperAdmin/Loading Style/Box Loading/BoxLoader';
import TaskG from '../Guest/My_Task/TaskG' 
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';


const Task_Guest = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedWorkspace } = useWorkspace(); // Using workspace context to get the selected workspace

  const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const formatDate = (dateString) => {
      const options = { day: 'numeric', month: 'short' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Fetch tasks based on selected workspace
  useEffect(() => {
      const fetchTasks = async () => {
          setLoading(true);

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
              const projectResponse = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
                  params: {
                      workspaceId: selectedWorkspace._id, // Fetching tasks by workspace ID
                  }
              });

              const tasksList = [];
              await Promise.all(
                  projectResponse.data.map(async (project) => {
                      const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`, {
                          headers: {
                              Authorization: `Bearer ${accessToken}`, // Authorization header
                          },
                      });

                      const tasksWithProject = taskResponse.data.data.map(task => ({
                          ...task,
                          projectName: project.projectName, // Assign project name to each task
                          objectiveCount: task.objectives ? task.objectives.length : 0,
                          assignedUsers: task.assignedUsers || [],
                          invitedUsers: project.invitedUsers || []
                      }));

                      tasksList.push(...tasksWithProject);
                  })
              );

              setTasks(tasksList);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching tasks:', error);
              setLoading(false);
          }
      };

      if (selectedWorkspace) {
          fetchTasks(); // Fetch tasks when a workspace is selected
      }
  }, [selectedWorkspace]); // Re-fetch tasks when `selectedWorkspace` changes

  const openModal = (task) => {
      setSelectedTask(task);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedTask(null);
  };

  const getPriorityColor = (priority) => {
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
              <AdminNavbarG
                  isAccountDropdownOpen={isAccountDropdownOpen}
                  toggleAccountDropdown={toggleAccountDropdown}
              />
          </div>
          <div className="mt-4">
              <h2 className="text-md md:text-xl font-medium text-gray-700 text-left">
                  Assignee
              </h2>
          </div>

          <div className="mt-4 flex gap-4">
              <div className="p-6 bg-white border rounded-lg shadow-md w-full">
                  <div className="text-gray-600 text-sm md:text-base">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 font-medium mb-2">
                          <p className="text-xs md:text-sm">Task</p>
                          <p className="hidden md:block text-center">Due Date</p>
                          <p className="hidden md:block text-center">Priority</p>
                          <p className="hidden md:block text-center">Objective</p>
                          <p className="text-center text-xs md:text-sm">Status</p>
                          <p className="text-right text-xs md:text-sm">Project</p>
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

                                      <div className="flex items-center relative z-10">
                                          {renderStatusIcon(task.status)}
                                          <p className="ml-2 font-bold text-sm md:text-base">{task.taskName}</p>
                                      </div>
                                      <p className="hidden md:block text-center relative z-10">{formatDate(task.dueDate)}</p>
                                      <div className="hidden md:flex items-center justify-center relative z-10">
                                          <FaFlag className={`mr-1 text-xs md:text-sm ${getPriorityColor(task.priority)}`} />
                                          <p className="text-xs md:text-sm">{task.priority}</p>
                                      </div>
                                      <p className="hidden md:block text-center relative z-10">{task.objectiveCount} Objectives</p>
                                      <p className="text-center relative z-10 text-sm md:text-base">{task.status}</p>
                                      <p className="text-right relative z-10 text-sm md:text-base">{task.projectName}</p>
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>
              </div>
          </div>

          <TaskG
              task={selectedTask}
              isOpen={isModalOpen}
              onClose={closeModal}
              formatDate={formatDate}
          />
      </div>
  );
};

export default Task_Guest