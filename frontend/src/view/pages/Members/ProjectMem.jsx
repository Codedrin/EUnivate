import React, { useState, useEffect } from 'react';
import { FaCalendar, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar.jsx';

const ProjectMem = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // Toggle account dropdown
  const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/sa-getnewproject');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Admin Navbar */}
      <div className="w-full flex justify-between items-center">
        
      <div className="relative">
  <h1 className="text-2xl font-medium text-gray-800 hidden md:block">Project</h1>
  </div>

  <AdminNavbar
    isAccountDropdownOpen={isAccountDropdownOpen}
    toggleAccountDropdown={toggleAccountDropdown}
  />
  
</div>

    
      {/* Display Projects */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
      <div className="block md:hidden text-black text-2xl font-semibold ml-2">
                Project
            </div>
          {/* Mobile Dashboard Text */}
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded-md shadow-md border border-gray-200 mt-4 relative cursor-pointer"
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
                <p>{new Date(project.createdAt).toLocaleDateString() || 'No date available'}</p>
                <FaPaperclip className="ml-5" />
                <p className="ml-2">0</p>
                <FaCheckCircle className="ml-5" />
                <p className="ml-2">0</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '5%' }}
                  ></div>
                </div>
                <p className="ml-2 text-gray-500">5%</p>
              </div>
            </div>
          ))
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectMem;
