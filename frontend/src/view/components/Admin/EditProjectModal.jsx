import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const EditProjectModal = ({ project, onClose, onSave }) => {
  const [projectName, setProjectName] = useState(project.projectName);
  const [teamMembers, setTeamMembers] = useState(project.teamMembers);
  const [adviser, setAdviser] = useState(project.adviser);
  const [description, setDescription] = useState(project.description);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(project.image?.url || ''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'EunivateImage');
    formData.append('cloud_name', 'dzxzc7kwb');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzxzc7kwb/image/upload',
        formData
      );
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      let projectImageUrl = imagePreview;

      if (image instanceof File) {
        try {
          projectImageUrl = await uploadImageToCloudinary(image);
        } catch (error) {
          setLoading(false);
          return;
        }
      }

      const updatedProject = {
        projectName,
        teamMembers,
        adviser,
        description,
        image: { url: projectImageUrl },
      };

      const response = await axios.put(
        `http://localhost:5000/api/users/projects/${project._id}`,
        updatedProject
      );

      setLoading(false);
      onSave(response.data);
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error updating project', error);
      setError('Failed to update project');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          disabled={loading}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Project Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Team Members</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={teamMembers}
            onChange={(e) => setTeamMembers(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Adviser</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={adviser}
            onChange={(e) => setAdviser(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <div className="flex items-center">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Project Preview"
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
            )}
            <label className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              Choose Image
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
            onClick={onClose} // Close the modal on cancel
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-700 text-white py-2 px-4 rounded-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
