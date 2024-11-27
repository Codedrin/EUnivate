import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Showcase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Project Showcase</h1>
      </header>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            {project.image && project.image.url ? (
              <img 
                src={project.image.url} 
                alt={project.projectName} 
                className="w-full h-48 object-cover"
              />
            ) : (
              <img 
                src="https://via.placeholder.com/400" 
                alt="Placeholder" 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-700">{project.projectName}</h2>
              <p className="text-gray-500 mt-2">{project.description}</p>
              <p className="text-xs text-gray-500 mt-2">Team Members: {project.teamMembers}</p>
              <p className="text-xs text-gray-500 mt-2">Adviser: {project.adviser}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showcase;
