import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrashAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Admin/AdminContainer';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditProjectModal from '../../components/Admin/EditProjectModal.jsx';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('projectName');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects from the backend
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      await axios.delete('http://localhost:5000/api/users/projects/${projectId}');
      setProjects(projects.filter(project => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedProject) => {
    setProjects(projects.map(project => project._id === updatedProject._id ? updatedProject : project));
    setIsEditModalOpen(false);
  };

  const filteredProjects = projects
    .filter(project =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamMembers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.adviser.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1;
      if (a[sortKey] > b[sortKey]) return 1;
      return 0;
    });

  return (
    <Layout>
      {/* Mobile layout */}
      <div className="block md:hidden">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex items-center mb-4 sm:mb-0">
          <label className="mr-2">Sort by</label>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="projectName">Name</option>
            <option value="teamMembers">Team Members</option>
            <option value="adviser">Adviser</option>
          </select>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        <div className="mb-4">
          <button 
            className="bg-red-700 text-white py-2 px-4 rounded-lg w-full"
            onClick={() => navigate('/admin-addprojects')}
          >
            Add Project
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div className="relative w-3/5 flex-grow">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex items-center ml-4">
          <label className="mr-2">Sort by</label>
          <select
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="projectName">Name</option>
            <option value="teamMembers">Team Members</option>
            <option value="adviser">Adviser</option>
          </select>
          <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <button 
          className="bg-red-700 text-white py-2 px-4 rounded-lg ml-4"
          onClick={() => navigate('/admin-addprojects')}
        >
          Add Project
        </button>
      </div>

      {/* Card Layout for Mobile */}
      <div className="block md:hidden">
        {filteredProjects.map((project, index) => (
          <div key={index} className="border-b border-gray-200 mb-4 p-4 rounded-lg shadow-md bg-white">
            <div className="flex items-center mb-4">
              <img
                src={project.image?.url || 'placeholder.png'}
                alt="Project"
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{project.projectName}</h3>
                <p className="text-sm text-gray-600">{project.adviser}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleEdit(project)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => handleDelete(project._id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table Layout for Desktop */}
      <div className="overflow-hidden rounded-lg shadow-lg bg-white hidden md:block">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-6 text-left">Capstone Project Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Team Members</th>
              <th className="py-3 px-6 text-left">Adviser</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-6">{project.projectName}</td>
                <td className="py-4 px-6">{project.description}</td>
                <td className="py-4 px-6">{project.teamMembers}</td>
                <td className="py-4 px-6">{project.adviser}</td>
                <td className="py-4 px-6">
                  <img
                    src={project.image?.url || 'placeholder.png'}
                    alt="Project"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    className="mr-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleEdit(project)}
                    >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => handleDelete(project._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <EditProjectModal
          project={selectedProject}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </Layout>
  );
};

export default Projects;

