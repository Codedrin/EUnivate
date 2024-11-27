import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const EditEventModal = ({ webinar ,onClose, onSave }) => {
    const [webinarName, setWebinarName] = useState(webinar.webinarName );
    const [description, setDescription] = useState(webinar.description );
    const [dateAndTime, setDateAndTime] = useState(webinar.dateAndTime );
    const [embeddedLink, setEmbeddedLink] = useState(webinar.embeddedLink );
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(webinar.image?.url || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (webinar.image?.url) {
            setImagePreview(webinar.image.url);
        }
    }, [webinar.image]);

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
            setError('Failed to upload image. Please try again.');
            throw error;
        }
    };

    const handleSave = async () => {

        setLoading(true);
        setError(null);

        try {
            let eventImageUrl = imagePreview;

            if (image) {
                try {
                    eventImageUrl = await uploadImageToCloudinary(image);
                } catch (error) {
                    setLoading(false);
                    return;
                }
            }

            const updatedEvent = {
                webinarName,
                description,
                dateAndTime,
                embeddedLink,
                image: { url: eventImageUrl },
            };

            const response = await axios.put(
                `http://localhost:5000/api/users/events/${webinar._id}`,          
                updatedEvent
            );

            setLoading(false);
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating event', error);
            setError('Failed to update event. Please try again.');
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
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Event</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2">Webinar Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={webinarName}
                        onChange={(e) => setWebinarName(e.target.value)}
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
                    <label className="block mb-2">Date</label>
                    <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={dateAndTime}
                        onChange={(e) => setDateAndTime(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Embedded Link</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={embeddedLink}
                        onChange={(e) => setEmbeddedLink(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Image</label>
                    <div className="flex items-center">
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Event Preview"
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
                        onClick={onClose}
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

export default EditEventModal;
