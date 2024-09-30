import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faHeart, faPaperPlane, faPaperclip, faMicrophone, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

// Modal component to view images in full screen
const ImageModal = ({ src, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative">
      <img src={src} alt="Full screen" className="max-w-full max-h-full" />
      <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">×</button>
    </div>
  </div>
);

const MessageContent = () => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [activeIcons, setActiveIcons] = useState({});
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [imageModalSrc, setImageModalSrc] = useState(null); // State for image modal


  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      recorder.ondataavailable = (e) => setAudioBlob(e.data);
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Capture the selected file
  };

  const removeFile = () => {
    setFile(null); // Clear the attached file
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

    const cancelReply = () => {
      setReplyingTo(null); // Reset the reply state
    };
  
  
    const sendMessage = async () => {
      if (message.trim() || file) {
        const cleanMessage = message.replace(/<\/?p>/g, '').replace(/<br\s*\/?>/g, '').trim();
    
        if (editingMessageId) {
          // Editing an existing message
          const updatedMessage = {
            content: cleanMessage,
            file: file ? { name: file.name, type: file.type, url: URL.createObjectURL(file) } : null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
    
          try {
            // Call the editMessage function to update the message on the backend
            await editMessage(editingMessageId, updatedMessage.content, updatedMessage.file, updatedMessage.time);
    
            // Update the message in the state
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg._id === editingMessageId ? { ...msg, ...updatedMessage, edited: true } : msg
              )
            );
    
            // Clear the editing state and input fields
            setEditingMessageId(null);
            setReplyingTo(null);
            setMessage('');
            setFile(null);
          } catch (error) {
            console.error('Error updating message:', error);
          }
        } else {
          // Sending a new message
          const newMessage = {
            content: cleanMessage,
            sender: { name: 'You', avatar: 'https://via.placeholder.com/40' },
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            file: file ? { name: file.name, type: file.type, url: URL.createObjectURL(file) } : null,
            replyTo: replyingTo ? { 
              _id: replyingTo._id,
              content: replyingTo.content,
              sender: replyingTo.sender,
              time: replyingTo.time
            } : null,
            edited: false
          };
      
          try {
            const response = await fetch('http://localhost:5000/api/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newMessage),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg._id === 'temp-id' ? { ...data } : msg
              )
            );
          } catch (error) {
            console.error('Error sending message:', error);
          }
          setMessages((prevMessages) => [...prevMessages, { ...newMessage, _id: 'temp-id' }]);
          setReplyingTo(null);
          setMessage('');
          setFile(null);
        }
      }
    };
    
    
    
    

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleQuillChange = (value) => setMessage(value);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleIconClick = (messageId, icon) => {
    setActiveIcons((prevActiveIcons) => ({
      ...prevActiveIcons,
      [messageId]: prevActiveIcons[messageId] === icon ? null : icon,
    }));
  };

  // Set the message to reply to
const handleReply = (message) => {
  setReplyingTo(message);
};

const handleEdit = (messageId, messageContent) => {
  setEditingMessageId(messageId); // Set the message ID being edited
  setMessage(messageContent); // Set the current content to the input field for editing
};

const handleDelete = async (messageId) => {
  // Call the deleteMessage function to remove the message from the backend
  await deleteMessage(messageId);

  // Remove the message from the frontend state
  setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
};


  const getIconColor = (messageId, icon) => {
    switch (icon) {
      case 'reply':
        return activeIcons[messageId] === 'reply' ? 'text-blue-500' : 'text-gray-400';
      case 'star':
        return activeIcons[messageId] === 'star' ? 'text-yellow-500' : 'text-gray-400';
      case 'heart':
        return activeIcons[messageId] === 'heart' ? 'text-red-500' : 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageContent = (message) => {
    let content = message.content;
  
    if (message.edited) {
      content += ' <span style="color: gray; font-size: 0.75rem;">(Edited)</span>';
    }
  
    if (message.replyTo) {
      return `
        <div style="padding: 12px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 12px; margin-top: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
          <p style="font-weight: bold; color: #0078d4; margin-bottom: 10px;">Replying to ${message.replyTo.sender.name}:</p>
          <div style="border-left: 4px solid #ff0000; padding: 12px; background-color: #ffd6d6; border-radius: 10px; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);">
            <p style="font-weight: bold; color: #333; margin-bottom: 6px;">
              ${message.replyTo.sender.name} 
              <span style="color: #777; font-size: 12px; float: right;">${message.replyTo.time}</span>
            </p>
            <p style="color: #555;">${message.replyTo.content}</p>
          </div>
          <p style="margin-top: 10px; color: #333; font-size: 14px;">${message.content}</p>
        </div>
      `;
    }
    return message.content;
  };
  
  
  

  const editMessage = async (id, updatedContent, updatedFile, updatedTime) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/messages/${id}`, {
        content: updatedContent,
        file: updatedFile,
        time: updatedTime,
      });
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === id ? { ...msg, content: updatedContent, file: updatedFile, time: updatedTime, edited: true } : msg
        )
      );
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };
  
  
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };  
  
  return (
    <div className="message-content bg-white flex flex-col h-full">
      {/* Header */}
      <div className="header mb-2 pl-2">
        <h2 className="text-xl font-semibold text-black">Superboard</h2>
        <p className="text-sm text-gray-600 mt-2">Superboard general chat</p>
      </div>

      <hr className="border border-gray-200 mt-4" />

      {/* Messages */}
      <div className="messages flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message flex items-start space-x-4 ${
              msg.sender.name === 'You' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender.name !== 'You' && (
              <img src={msg.sender.avatar} alt={msg.sender.name} className="rounded-full w-10 h-10 mt-2" />
            )}
            <div className={`p-3 rounded-lg shadow-md  ${
                msg.sender.name === 'You' ? 'bg-blue-200 text-gray-800' : 'bg-red-100 text-gray-800'
              } max-w-[60%] border border-blue relative ${editingMessageId === msg._id ? 'border-blue-500' : ''}`}
            >
              <div className="message-header flex items-center flex space-x-12 justify-between mb-4">
  <div className="flex items-center">
    <p className={`text-sm font-semibold ${msg.sender.name === 'You' ? 'text-blue-800' : 'text-gray-800'}`}>
      {msg.sender.name}
    </p>
    {msg.edited && <span className="text-xs text-gray-500 mx-2">(Edited)</span>} {/* Show "Edited" label */}
  </div>
  <p className="text-xs text-gray-500">{msg.time}</p>
</div>

              <div
                className="message-body text-sm break-words"
                dangerouslySetInnerHTML={{ __html: formatMessageContent(msg) }}
              />

{msg.file && (
   msg.file.type.startsWith('image/') ? (
      <img
        src={msg.file.url}
        alt={msg.file.name}
        className="w-full h-auto cursor-pointer"
        onClick={() => setImageModalSrc(msg.file.url)} // Open modal with image URL
      />
  ) : msg.file.type.startsWith('video/') ? (
    <video controls src={msg.file.url} className="message-file my-2 max-w-full h-auto" />
  ) : (
    <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="message-file text-sm my-2 text-blue-500">
      {msg.file.name}
    </a>
  )
)}

<div className="message-actions flex justify-between items-center mt-2">
  {/* Left side icons */}
  <div className="flex space-x-2">
    <FontAwesomeIcon
      icon={faReply}
      onClick={() => handleReply(msg)}
      className={`cursor-pointer hover:text-blue-600 transition duration-300 ${getIconColor(msg._id, 'reply')}`}
    />
    <FontAwesomeIcon
      icon={faStar}
      onClick={() => handleIconClick(msg._id, 'star')}
      className={`cursor-pointer ${getIconColor(msg._id, 'star')}`}
    />
    <FontAwesomeIcon
      icon={faHeart}
      onClick={() => handleIconClick(msg._id, 'heart')}
      className={`cursor-pointer hover:text-red-600 transition duration-300 ${getIconColor(msg._id, 'heart')}`}
    />
  </div>

  {/* Right side icons (edit and delete) */}
  {msg.sender.name === 'You' && (
    <div className="flex space-x-2">
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => handleEdit(msg._id, msg.content)}
        className="cursor-pointer text-blue-500"
      />
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() => handleDelete(msg._id)}
        className="cursor-pointer text-red-500"
      />
    </div>
  )}
</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>


      {/* Reply Box */}
{replyingTo && (
  <div className="reply-box border-t border-gray-200 bg-gray-50 flex flex-col space-y-2">
    <div className="reply-preview p-3 border border-gray-300 rounded-lg bg-white shadow-sm">
      <p className="text-sm text-gray-700 font-semibold mb-2">
        Replying to <span className="text-blue-600">{replyingTo.sender.name}</span>:
      </p>
      <div className="reply-content p-3 border border-gray-200 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-gray-800">{replyingTo.sender.name}</p>
          <span className="text-gray-400 text-xs">{replyingTo.time}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{replyingTo.content}</p>
        <button
          onClick={cancelReply}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      {/* Message Input */}
      <div className="message-input p-4 bg-gray-100 rounded-lg shadow-md border-t sticky bottom-0">
        <div className="relative flex items-center">
          <ReactQuill
            value={message}
            onChange={handleQuillChange}
            onKeyDown={handleKeyDown}
            className="bg-white border rounded-lg shadow-sm flex-1"
            theme="snow"
            placeholder="Enter a message..."
          />

          {/* Icons */}
          <div className="absolute right-2 top-0 flex flex-col items-center space-y-2 z-10">
            {/* Attachment Icon */}
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <button onClick={handleAttachmentClick} className="mr-2 text-gray-600 hover:text-blue-600 transition duration-300">
  <FontAwesomeIcon icon={faPaperclip} />
  <input type="file" accept="*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
</button>
              {/* Microphone Icon */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 hover:text-blue-600 transition duration-300 ${isRecording ? 'bg-red-500 text-white' : 'text-gray-600'}`}
              >
                <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: '1rem' }} />
              </button>
            </label>
          </div>

          {/* Send Message Button */}
          <button
            onClick={sendMessage}
            className="absolute right-2 bottom-2 p-2 text-blue-500 hover:text-blue-600 transition duration-300"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>


        {/* File Preview Section */}
{file && (
  <div className="file-preview flex items-center bg-gray-50 p-4 rounded-lg shadow-lg border border-gray-200">
    {file.type.startsWith('image/') ? (
      <img 
        src={URL.createObjectURL(file)} 
        alt="Preview" 
        className="w-24 h-24 object-cover rounded-lg mr-4 hover:opacity-90 transition duration-300 ease-in-out"
      />
    ) : file.type.startsWith('video/') ? (
      <video 
        controls 
        src={URL.createObjectURL(file)} 
        className="w-42 h-24 object-cover rounded-lg mr-4"
      />
    ) : (
      <span className="text-sm text-gray-600 font-medium truncate">{file.name}</span>
    )}
    <button 
      onClick={removeFile} 
      className="ml-4 text-red-500 hover:text-red-700 transition duration-300 ease-in-out">
      <FontAwesomeIcon icon={faTrash} className="text-lg" />
    </button>
  </div>
)}

{imageModalSrc && (
  <ImageModal src={imageModalSrc} onClose={() => setImageModalSrc(null)} />
)}
      </div>
    </div>
  );
};

export default MessageContent;