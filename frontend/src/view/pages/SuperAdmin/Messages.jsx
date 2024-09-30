import React, { useState } from 'react'; 
import MessageContent from '../../components/SuperAdmin/MessageContent';
import SidebarMessage from '../../components/SuperAdmin/SidebarMessage';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import MediaModal from '../../components/MediaModal';

const Messages = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMedia, setModalMedia] = useState(null);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    // Define your messages array or fetch it from a state or props
    const messages = []; // Replace this with actual message data

    const openModal = (media) => {
        setModalMedia(media);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalMedia(null);
    };

    const toggleProjectDropdown = () => setIsProjectDropdownOpen(!isProjectDropdownOpen);
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    return (
        <div className="bg-gray-100 min-h-screen p-4">  {/* Reduced padding for the main container */}
            {/* Dashboard Text */}
            <div className="flex justify-between items-center mb-12">  {/* Reduced bottom margin */}
                <h1 className="text-xl font-medium text-gray-800">Messages</h1>  {/* Decreased font size */}
                <AdminNavbar 
                    isAccountDropdownOpen={isAccountDropdownOpen} 
                    toggleAccountDropdown={toggleAccountDropdown} 
                />
            </div>

            {/* Main Content */}
            <div className="flex space-x-2">  {/* Reduced spacing between Sidebar and Message Content */}
                <SidebarMessage />  {/* Sidebar Component */}
                <MessageContent />  {/* Message Content Component */}
            </div>

            {/* Render messages */}
            <div>
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg.file && (
                            msg.file.type.startsWith('image/') ? (
                                <img
                                    src={msg.file.url}
                                    alt={msg.file.name}
                                    className="message-file cursor-pointer"
                                    onClick={() => openModal(msg.file)}
                                />
                            ) : msg.file.type.startsWith('video/') ? (
                                <video
                                    controls
                                    src={msg.file.url}
                                    className="message-file cursor-pointer"
                                    onClick={() => openModal(msg.file)}
                                />
                            ) : (
                                <a href={msg.file.url} target="_blank" rel="noopener noreferrer">
                                    {msg.file.name}
                                </a>
                            )
                        )}
                    </div>
                ))}
            </div>

            {/* Media Modal */}
            <MediaModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                media={modalMedia}
            />
        </div>
    );
};

export default Messages;


