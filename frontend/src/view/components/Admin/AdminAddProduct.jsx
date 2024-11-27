// Other imports remain the same
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import Jumpdot from '../../pages/SuperAdmin/Loading Style/Dots Loading/Jumpdot';

const AdminAddProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState('Available');
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
      return response.data.url; // URL of the uploaded image
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

      const productData = {
        productName: productName,
        description: description,
        availability: availability,
        image: imageUrl ? { url: imageUrl, publicId: selectedImage.name } : null,
      };

      // Send the product data to the backend
      const response = await axios.post('http://localhost:5000/api/users/addproduct', productData);

      console.log(response.data);
      setLoading(false);
      navigate('/products');

    } catch (error) {
      setLoading(false);
      console.error('Error uploading product:', error);
      setError('Failed to upload product. Please try again.'); 
    }
  };

  return (
    <>
     {loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="bg-white p-8 rounded-lg text-center flex flex-col items-center"> 
      <Jumpdot />
      <p className="mt-4 text-lg font-bold text-center">Adding: {productName}</p>
    </div>
  </div>
)}


      <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-lg max-w-md mx-auto mt-12">
        {/* Upload Image Section */}
        <div className="flex flex-col items-center mb-6 relative">
          <input
            accept="image/*"
            className="hidden"
            id="upload-image"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-image" className="cursor-pointer">
            <div className="w-32 h-32 rounded-lg bg-gray-200 flex justify-center items-center mb-4 overflow-hidden">
              {selectedImage ? (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-4xl text-gray-500">📷</span>
              )}
            </div>
          </label>
          <p className="text-red-700 cursor-pointer">Upload Image</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col w-full mb-6">
          <input
            type="text"
            placeholder="Product Name"
            className="p-2 mb-4 rounded-md border border-gray-300 bg-gray-100"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="p-2 rounded-md border border-gray-300 bg-gray-100"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Availability Section */}
        <div className="flex flex-col w-full mb-6">
          <p className="mb-2 text-lg">Availability</p>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="Available"
                className="hidden peer"
                checked={availability === 'Available'}
                onChange={(e) => setAvailability(e.target.value)}
              />
              <span className="peer-checked:bg-teal-600 peer-checked:text-white peer-checked:border-teal-600 bg-teal-100 text-teal-700 border-2 border-teal-600 rounded-full px-4 py-2 font-bold transition-all">
                Available
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="Pending"
                className="hidden peer"
                checked={availability === 'Pending'}
                onChange={(e) => setAvailability(e.target.value)}
              />
              <span className="peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-500 bg-orange-100 text-orange-600 border-2 border-orange-500 rounded-full px-4 py-2 font-bold transition-all">
                Pending
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="availability"
                value="NotAvailable"
                className="hidden peer"
                checked={availability === 'NotAvailable'}
                onChange={(e) => setAvailability(e.target.value)}
              />
              <span className="peer-checked:bg-gray-500 peer-checked:text-white peer-checked:border-gray-500 bg-gray-200 text-gray-600 border-2 border-gray-500 rounded-full px-4 py-2 font-bold transition-all">
                Not Available
              </span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Save Button */}
        <div className="flex flex-col items-center">
          <button type="submit" className="w-48 h-12 rounded-full bg-red-800 text-white">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminAddProduct;
