import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Jumpdot from '../../pages/SuperAdmin/Loading Style/Dots Loading/Jumpdot';

const AdminAddEvents = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [webinarName, setWebinarName] = useState('');
  const [description, setDescription] = useState('');
  const [dateAndTime, setDateAndTime] = useState('');
  const [embeddedLink, setEmbeddedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
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
      throw error;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary(selectedImage);
      }

      const eventData = {
        webinarName: webinarName,
        description: description,
        dateAndTime: dateAndTime,
        embeddedLink: embeddedLink,
        image: imageUrl ? { url: imageUrl, publicId: selectedImage.name } : null,
      };

      const response = await axios.post('http://localhost:5000/api/users/addevent', eventData);

      console.log(response.data);
      setLoading(false);
      navigate('/events-admin');

    } catch (error) {
      setLoading(false);
      console.error('Error uploading event:', error);
      setError('Failed to upload event. Please try again.');
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-8 rounded-lg text-center flex flex-col items-center"> 
            <Jumpdot />
            <p className="mt-4 text-lg font-bold text-center">Adding: {webinarName}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center p-8 rounded-lg bg-white shadow-lg w-[90%] max-w-4xl mx-auto mt-12">
        {/* Upload Image Section */}
        <div className="flex flex-col items-center mb-8 relative">
          <input
            accept="image/*"
            className="hidden"
            id="upload-image"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-image" className="cursor-pointer">
            <div className="w-24 h-24 rounded-md bg-gray-200 flex justify-center items-center mb-4 overflow-hidden">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-500">📷</span>
              )}
            </div>
          </label>
          <p className="text-blue-600 cursor-pointer">Upload Cover Photo</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <input
            type="text"
            placeholder="Event Name"
            className="p-2 rounded-md border border-gray-300 bg-gray-100"
            value={webinarName}
            onChange={(e) => setWebinarName(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            placeholder="Date and Time"
            className="p-2 rounded-md border border-gray-300 bg-gray-100"
            value={dateAndTime}
            onChange={(e) => setDateAndTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Embedded Link"
            className="col-span-2 p-2 rounded-md border border-gray-300 bg-gray-100"
            value={embeddedLink}
            onChange={(e) => setEmbeddedLink(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="col-span-2 p-2 rounded-md border border-gray-300 bg-gray-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Save Button */}
        <button type="submit" className="w-48 h-12 rounded-full bg-red-800 text-white" disabled={loading}>
          {loading ? 'Saving ...' : 'Save'}
        </button>
      </form>
    </>
  );
};

export default AdminAddEvents;
