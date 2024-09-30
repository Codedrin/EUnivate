import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SettingProfile = () => {
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const [isBiodataEditable, setIsBiodataEditable] = useState(false);

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [biodata, setBiodata] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png';

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{9,}$/;
    return passwordRegex.test(password);
  };


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedBiodata = localStorage.getItem('biodata');
    if (storedUser) {
      setEmail(storedUser.email || '');
      setPhoneNumber(storedUser.phoneNumber || '');
      setBiodata(storedBiodata || '');
      setUsername(storedUser.username || '');
      setFirstName(storedUser.firstName || '');
      setLastName(storedUser.lastName || '');

      // Handle the profile picture logic
      if (storedUser.profilePicture && storedUser.profilePicture.url) {
        setProfilePicture(storedUser.profilePicture.url);
      } else if (storedUser.profilePicture && typeof storedUser.profilePicture === 'string') {
        setProfilePicture(storedUser.profilePicture);
      } else {
        setProfilePicture(defaultProfilePictureUrl);
      }
    }
  }, []);

  const handleEditClick = async (field) => {
    if (field === 'email') {
      setIsEmailEditable((prevState) => !prevState);
      if (isEmailEditable) await handleSaveProfile(false);
    } else if (field === 'phone') {
      setIsPhoneEditable((prevState) => !prevState);
      if (isPhoneEditable) await handleSaveProfile(false);
    } else if (field === 'biodata') {
      setIsBiodataEditable((prevState) => !prevState);
      if (isBiodataEditable) await handleSaveProfile(false);
    }
  };
  const toggleEditProfileModal = () => {
    setShowEditProfileModal(!showEditProfileModal);
  };

  const toggleChangePasswordModal = () => {
    setShowChangePasswordModal(!showChangePasswordModal);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSaveProfile = async (shouldCloseModal = true) => {
    const uploadImageToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'EunivateImage'); // Replace with your actual Cloudinary upload preset
      formData.append('cloud_name', 'dzxzc7kwb'); // Replace with your actual Cloudinary cloud name

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

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser || !storedUser._id) {
      console.error('User is not logged in or user ID is missing.');
      return;
    }

    let profilePictureUrl = profilePicture;
    if (profilePicture instanceof File) {
      try {
        profilePictureUrl = await uploadImageToCloudinary(profilePicture);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return;
      }
    } else if (!profilePictureUrl) {
      // If profilePicture is empty or null, set it to default
      profilePictureUrl = defaultProfilePictureUrl;
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      profilePicture: profilePictureUrl,
      role: biodata,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${storedUser._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('biodata', biodata);
      setIsEmailEditable(false);
      setIsPhoneEditable(false);
      setIsBiodataEditable(false);

      // Show success toast notification
      toast.success('Successfully changed your profile!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: <button>Close</button>
      });

      // Conditionally close the modal based on the parameter
      if (shouldCloseModal) {
        toggleEditProfileModal();
      }
    } catch (error) {
      console.error('Error updating profile', error);
      toast.error('Error updating profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (!validatePassword(newPassword)) {
      setError("Password must be at least 9 characters long and include at least one number and one symbol.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        setError('User not logged in or user ID is missing.');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/users/${storedUser._id}/password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Show success toast notification
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setNewPassword('');
          setConfirmPassword('');
          setError('');
          setSuccess('');
        }, 3000);
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };
  

  return (
    <div className="space-y-4">
      <ToastContainer />
  <div className="flex flex-col sm:flex-row items-center justify-between">
    <div className="flex flex-col sm:flex-row items-center sm:items-start">
      <img
        src={profilePicture || defaultProfilePictureUrl}
        alt="Profile"
        className="w-24 h-24 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-0 sm:mr-4"
      />
      <div className="text-center sm:text-left mt-3">
        <div className="text-lg font-medium">
          {firstName} {lastName}
        </div>
        <p className="text-sm text-gray-600 mt-1">@{username}</p>

      </div>
    </div>

    {/* Button stays in original position on website, moves below content on mobile */}
    <button
      onClick={toggleEditProfileModal}
      className="px-3 py-1 sm:px-4 sm:py-2 bg-red-800 text-white rounded hover:bg-red-900 text-sm sm:text-base mt-4 sm:mt-0 w-full h-10 sm:w-auto" // Button on mobile takes full width
    >
      Edit User Profile
    </button>
  </div>
 

      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isEmailEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('email')}
            >
              {isEmailEditable ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isPhoneEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('phone')}
            >
              {isPhoneEditable ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="biodata"
                className="text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Biodata
              </label>
              <input
                id="biodata"
                type="text"
                value={biodata}
                onChange={(e) => setBiodata(e.target.value)}
                className="px-2 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                disabled={!isBiodataEditable}
              />
            </div>
            <button
              className="ml-2 px-4 py-1 border border-blue-500 text-blue-500 bg-transparent rounded hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleEditClick('biodata')}
            >
              {isBiodataEditable ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-2xl font-bold text-gray-900">
          Change your Password
        </h4>
        <p className="mt-2 text-gray-600">
          You can change your password periodically to increase the security of
          your account. 
        </p>
        <div className="mt-3 flex">
          <button
            onClick={toggleChangePasswordModal}
            className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="editUsername"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="editUsername"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editFirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="editFirstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editLastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="editLastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="editProfilePicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  id="editProfilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-start">
              <button
                onClick={toggleEditProfileModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProfile(true)} // Save the profile changes and close the modal
                className="ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-start">
              <button
                onClick={toggleChangePasswordModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingProfile;
