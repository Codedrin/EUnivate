import React, { useState, useEffect } from 'react';
import { FaCalendar, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import AdminNavbarG from '../../components/Guest/AdminNavbarG';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';
const ProjectG = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskCounts, setTaskCounts] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]); 
  const { selectedWorkspace } = useWorkspace();
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();

  const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); 
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user ? user.accessToken : null;

        if (!accessToken) {
          setError('No access token found. Please log in again.');
          setLoading(false);
          return;
        }

        const workspaceId = selectedWorkspace ? selectedWorkspace._id : null;

        if (!workspaceId) {
          setError('No workspace selected. Please select a workspace.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { workspaceId },
        });

        if (response.status === 200) {
          setProjects(response.data);
          setError(''); // Clear previous errors
        } else {
          setError('Failed to fetch projects.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError();
      } finally {
        setLoading(false);
      }
    };

    if (selectedWorkspace) {
      fetchProjects();
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    const fetchTaskCounts = async () => {
      const counts = {};
      for (let project of projects) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
          const totalTasks = response.data.data.length;
          const doneTasks = response.data.data.filter(task => task.status === 'Done').length;
          counts[project._id] = { totalTasks, doneTasks };
        } catch (err) {
          console.error('Error fetching task counts:', err);
          setError('An error occurred while fetching task counts.');
        }
      }
      setTaskCounts(counts);
    };

    if (projects.length) {
      fetchTaskCounts();
    }
  }, [projects]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user ? user.accessToken : null;

        if (!accessToken) {
          console.error('No access token found.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/workspaces', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          setWorkspaces(response.data);
        } else {
          setError('Failed to fetch workspaces.');
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
        setError('An error occurred while fetching workspaces.');
      }
    };

    fetchWorkspaces();
  }, []);

  const handleProjectClick = async (project) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
      const tasks = response.data.data;
      setTasks(tasks);
      setSelectedProject(project._id);

      navigate(`/guest-dashboard/projects/${project._id}`, {
        state: {
          projectId: project._id,
          projectName: project.projectName,
          tasks,
          thumbnail: project.thumbnail,
          invitedUsers: project.invitedUsers,
        },
      });
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('An error occurred while fetching tasks.');
    }
  };

  const calculateProgress = (projectId) => {
    const { totalTasks, doneTasks } = taskCounts[projectId] || { totalTasks: 0, doneTasks: 0 };
    return totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="w-full flex justify-between items-center">
        <div className="relative">
          <h1 className="text-2xl font-medium text-gray-800 hidden md:block">Project</h1>
        </div>
        <AdminNavbarG
          isAccountDropdownOpen={isAccountDropdownOpen}
          toggleAccountDropdown={toggleAccountDropdown}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded-md shadow-md border border-gray-200 mt-2 relative cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              {project.thumbnail && (
                <img
                  src={project.thumbnail.url}
                  alt={project.projectName}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <h3 className="text-lg font-semibold mt-2">{project.projectName}</h3>
              <div className="flex items-center text-gray-500 mt-2">
                <FaCalendar className="mr-2" />
                <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                <FaCheckCircle className="ml-5" />
                <p className="ml-2">
                  {taskCounts[project._id] ? taskCounts[project._id].doneTasks : 'Loading...'}
                </p>

                {/* Invited users' profile images placed next to FaCheckCircle */}
                <div className="flex ml-4 -space-x-3">
                  {project.invitedUsers && project.invitedUsers.length > 0 ? (
                    project.invitedUsers.map(user => (
                      <img
                        key={user._id}
                        src={user.profilePicture?.url || user.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'} 
                        alt={user.username}
                        className="w-6 h-6 rounded-full object-cover border border-gray-300"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No users invited yet.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${calculateProgress(project._id)}%` }}
                  ></div>
                </div>
                <p className="ml-2 text-gray-500">
                  {`${Math.floor(calculateProgress(project._id))}%`}
                </p>
              </div>

              {/* Display tasks and their statuses */}
              <div className="mt-4">
                {selectedProject === project._id && tasks.map(task => (
                  <div key={task._id} className="flex justify-between items-center p-2 bg-gray-100 rounded-md mb-2">
                    <span>{task.title}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${task.status === 'Done' ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No projects available for this user.</p>
        )}
      </div>
    </div>
  );
};
export default ProjectG;
