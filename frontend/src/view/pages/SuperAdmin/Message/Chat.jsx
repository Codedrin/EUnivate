import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaReply, FaSmile, FaStar, FaFlag, FaTrash } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import './Chat.css'; // Ensure this file exists

// Helper function to get initials from the group name
const getInitials = (name) => {
  const words = name.split(' ');
  if (words.length > 1) {
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  } else {
    return words[0].charAt(0).toUpperCase();
  }
};

// Helper function to generate a consistent color based on group name
const getColorFromName = (name) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500',];
  // Calculate a hash value from the group name and use it to select a color
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const emojis = ['😀', '😂', '😍', '👍', '👏'];
const flagColors = ['red', 'yellow', 'green']; // Define flag colors
let socket;
const Chat = ({ group }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState({});
  const [showFlagPicker, setShowFlagPicker] = useState(null);
  const [selectedFlag, setSelectedFlag] = useState({});
  const [file, setFile] = useState(null);
  const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png';

  // Create a ref for the chat container
  const chatContainerRef = useRef(null);

  // Group message reactions by emoji and count the total reactions
  const groupReactions = (reactions = []) => {
    let totalReactions = 0;
    const reactionGroups = reactions.reduce((acc, reaction) => {
      if (reaction && reaction.reaction) {
        if (!acc[reaction.reaction]) {
          acc[reaction.reaction] = { emoji: reaction.reaction, count: 0 };
        }
        acc[reaction.reaction].count += 1;
        totalReactions += 1;
      }
      return acc;
    }, {});

    return { reactionGroups, totalReactions };
  };

  // Initialize socket and fetch initial messages (Pang realtime to)
  useEffect(() => {
    socket = io("https://eunivate-jys4.onrender.com");

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser({
        ...storedUser,
        profilePicture: storedUser.profilePicture?.url || defaultProfilePictureUrl,
      });
    }
    // Listen for new messages
    socket.on('new-message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for new replies to messages
    socket.on('new-reply', (replyData) => {
      setMessages((prevMessages) => {
        return prevMessages.map((msg) =>
          msg._id === replyData.messageId ? { ...msg, replies: [...msg.replies, replyData.reply] } : msg
        );
      });
    });

    // Listen for reactions on messages
    socket.on('new-reaction', (reactionData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === reactionData.messageId
            ? {
                ...msg,
                reactions: msg.reactions.some(
                  (r) => r.user && r.user._id === reactionData.reaction.user._id
                )
                  ? msg.reactions.map((r) =>
                      r.user && r.user._id === reactionData.reaction.user._id
                        ? reactionData.reaction
                        : r
                    )
                  : [...msg.reactions, reactionData.reaction],
              }
            : msg
        )
      );
    });

    // Listen for flagged messages
    socket.on('flagged-message', (flagData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === flagData.messageId ? { ...msg, priorityFlag: flagData.priorityFlag } : msg
        )
      );
    });

    // Listen for starred messages
    socket.on('starred-message', (starData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === starData.messageId
            ? {
                ...msg,
                starredBy: starData.hasStarred
                  ? [...msg.starredBy, starData.userId]
                  : msg.starredBy.filter((id) => id !== starData.userId),
              }
            : msg
        )
      );
    });

   // Listen for deleted messages
    socket.on('deleted-message', (deleteData) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === deleteData.messageId ? { ...msg, removed: true } : msg
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // Fetch messages when group changes
  useEffect(() => {
    if (group.groupName) {
      console.log('Workspace ID being used:', group.groupName); // Check if this is the correct ID
      const fetchMessages = async () => {
        try {
          const response = await axios.get('https://eunivate-jys4.onrender.com/api/users/messages', {
            
            params: { workspaceId: group.groupName }, // Fetch messages based on workspaceId
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [group.groupName]);


  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    const plainTextMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] }).trim();
  
    if (plainTextMessage && currentUser) {
        let fileData = {};
        if (file) {
            fileData = await uploadImageToCloudinary(file);
        }
  
        const newMessage = {
            sender: currentUser._id,
            content: message,
            files: fileData.url ? [fileData] : [],
            workspaceId: group.groupName,  // Fix: Remove typo "group.groupNameu"
            replyTo: replyMessage ? replyMessage._id : null,
        };
  
        try {
            await axios.post('https://eunivate-jys4.onrender.com/api/users/create-message', newMessage);
            setMessage(''); // Clear the message input
            setFile(null);  // Clear the file input
            setReplyMessage(null); // Clear the reply message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
  };


  // Handle replying to a message
  const handleReplyMessage = async () => {
    const plainTextMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] }).trim();

    if (plainTextMessage && currentUser) {
      const newReply = {
        sender: currentUser._id,
        content: plainTextMessage,
      };

      try {
        await axios.post(`https://eunivate-jys4.onrender.com/api/users/${replyMessage?._id}/reply`, newReply);
        setMessage('');
        setReplyMessage(null);
      } catch (error) {
        console.error('Error replying to message:', error);
      }
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'EunivateImage');
    formData.append('cloud_name', 'dzxzc7kwb');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dzxzc7kwb/image/upload', formData);
      return { publicId: response.data.public_id, url: response.data.secure_url };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { publicId: '', url: '' };
    }
  };

  // Handle emoji selection for message reaction
  const handleEmojiSelect = async (emoji, index) => {
    const messageId = messages[index]._id;
    const userId = currentUser._id;

    setSelectedEmoji((prev) => ({
      ...prev,
      [index]: emoji,
    }));

    setShowEmojiPicker(null);

    socket.emit('new-reaction', {
      messageId,
      reaction: { user: { _id: userId }, reaction: emoji },
    });

    try {
      await axios.post(`https://eunivate-jys4.onrender.com/api/users/${messageId}/react`, {
        user: userId,
        reaction: emoji,
      });
    } catch (error) {
      console.error('Error reacting to message:', error.response ? error.response.data : error.message);
    }
  };

  // Toggle star for a message
  const toggleStar = async (index) => {
    const messageId = messages[index]._id;
    const userId = currentUser._id;

    socket.emit('starred-message', { messageId, userId });

    try {
      await axios.post(`https://eunivate-jys4.onrender.com/api/users/${messageId}/star`, { userId });
    } catch (error) {
      console.error('Error starring message:', error.response ? error.response.data : error.message);
    }
  };

  // Handle deleting a message
const handleTrashClick = async (index) => {
  const messageId = messages[index]._id;

  try {
    // Send a request to delete the message from the backend
    await axios.delete(`https://eunivate-jys4.onrender.com/api/users/${messageId}/delete`);

    // Update the messages state to remove the deleted message
    setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));

    // Emit a socket event for deleted message (optional)
    socket.emit('deleted-message', { messageId });
  } catch (error) {
    console.error('Error deleting message:', error.response ? error.response.data : error.message);
  }
};


  const handleFlagSelect = async (color, index) => {
    setSelectedFlag((prev) => ({
      ...prev,
      [index]: color,
    }));
    setShowFlagPicker(null);

    const messageId = messages[index]._id;

    socket.emit('flagged-message', { messageId, priorityFlag: color });

    try {
      await axios.post(`https://eunivate-jys4.onrender.com/api/users/${messageId}/flag`, {
        priorityFlag: color,
      });
    } catch (error) {
      console.error('Error flagging message:', error);
    }
  };


  // Fallback UI for when there are no members
  if (!group.selectedMembers || group.selectedMembers.length === 0) {
    return (
      <div className="flex flex-col h-full w-full p-4">
        <div className="text-gray-500 text-sm">
          No members are available in this workspace. Please invite members to start a conversation.
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full p-4">
    {/* Header */}
    <div className="flex items-center justify-start border-b pb-3 mb-4">
      <div
        className={`w-10 h-10 flex items-center justify-center text-white text-lg font-bold rounded-full ${getColorFromName(group.groupName)}`}
      >
        {getInitials(group.groupName)}
      </div>
      <div className="ml-3">
        <h2 className="text-base sm:text-lg font-bold">{group.groupName} Chat</h2>
        <p className="text-sm text-gray-500">General chat for {group.groupName}</p>
      </div>
    </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 no-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={msg._id}
            className={`mb-4 flex group ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            <img
              src={msg.sender?.profilePicture?.url || msg.sender?.profilePicture || defaultProfilePictureUrl}
              alt={msg.sender?.firstName}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3"
            />

            <div
              className={`p-2 sm:p-3 rounded-lg w-full max-w-xs sm:max-w-4xl relative ${
                msg.starredBy.includes(currentUser._id) ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <div className="flex mb-1 items-center">
                <p className="text-xs sm:text-sm font-semibold">
                  {msg.sender?.firstName} {msg.sender?.lastName}
                </p>
                <p className="text-xs text-gray-500 mr-auto ml-2 flex items-center">
                  {msg.time}
                  {msg.priorityFlag && <FaFlag className={`ml-2 text-${msg.priorityFlag}-500 text-xs`} />}
                </p>
              </div>
              {msg.replyTo && (
                <div className="text-xs text-gray-500 bg-gray-200 p-1 rounded-md mb-2">
                  <strong>{msg.replyTo?.sender?.firstName} {msg.replyTo?.sender?.lastName}</strong> said: {msg.replyTo.text}
                </div>
              )}
              <div className="text-xs sm:text-sm break-words" dangerouslySetInnerHTML={{ __html: msg.content }} />

              {/* Display the replies */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="mt-4">
                  <strong>Replies:</strong>
                  {msg.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-200 p-2 rounded-lg mt-2">
                      <div className="flex items-center">
                        <img
                          src={reply.sender?.profilePicture?.url || reply.sender?.profilePicture || defaultProfilePictureUrl}
                          alt={reply.sender?.firstName}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-xs text-gray-500">
                            <strong>{reply.sender?.firstName} {reply.sender?.lastName}</strong>
                          </p>
                          <p className="text-xs sm:text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Display reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div className="mt-2 flex items-center">
                  {Object.values(groupReactions(msg.reactions).reactionGroups).map(({ emoji, count }, i) => (
                    <span key={i} className="text-sm p-1 rounded-full flex items-center">
                      <span>{emoji}</span>
                      <span className="ml-1">{count}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Icons */}
              <div className="absolute top-0 right-0 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg mt-5 mr-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300">
                <button className="text-gray-500 hover:text-blue-500" onClick={() => setReplyMessage(msg)}>
                  <FaReply size={12} />
                </button>

              {/* Emoji Picker */}
                <div className="relative">
                  <button
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => setShowEmojiPicker((prev) => (prev === index ? null : index))}
                  >
                    <FaSmile size={12} />
                  </button>
                  {showEmojiPicker === index && (
                    <div className="absolute top-full mt-1 -right-16 bg-white shadow-lg rounded-lg p-2 flex space-x-2 z-50 sm:-right-8">
                      {emojis.map((emoji) => (
                        <button key={emoji} onClick={() => handleEmojiSelect(emoji, index)} className="text-lg">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                  {/* Star Button */}
                  <button
                    className={`hover:text-blue-500 ${
                      msg.starredBy.includes(currentUser._id) ? 'text-yellow-500' : 'text-gray-500'
                    }`}
                    onClick={() => toggleStar(index)}
                  >
                    <FaStar size={12} />
                  </button>

                  {/* Trash Button */}
                  <button className="text-gray-500 hover:text-blue-500" onClick={() => handleTrashClick(index)}>
                    <FaTrash size={12} />
                  </button>

                  {/* Flag Picker */}
                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-blue-500"
                      onClick={() => setShowFlagPicker((prev) => (prev === index ? null : index))}
                    >
                      <FaFlag size={12} />
                    </button>
                    {showFlagPicker === index && (
                      <div className="absolute bottom-8 right-0 bg-white shadow-lg rounded-lg p-2 flex space-x-2 z-50 sm:bottom-12">
                        {flagColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleFlagSelect(color, index)}
                            className={`text-${color}-500`}
                          >
                            <FaFlag size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

            </div>
          </div>
        ))}
      </div>
    
  
      {/* Reply Preview */}
      {replyMessage && (
        <div className="bg-gray-200 p-2 mb-2 rounded-md text-xs text-gray-700 flex justify-between items-center">
          <div>
            Replying to <strong>{replyMessage.sender?.firstName} {replyMessage.sender?.lastName}</strong>: {DOMPurify.sanitize(replyMessage.content, { ALLOWED_TAGS: [] }).trim()}
          </div>
          <button className="text-red-500 text-xs ml-2" onClick={() => setReplyMessage(null)}>
            ❌
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t pt-3 relative flex items-center">
        <ReactQuill
          value={message}
          onChange={(content) => setMessage(content)}
          placeholder="Enter your message"
          modules={{ toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['image']] }}
          className="flex-1 text-xs sm:text-sm"
        />
        <button className="absolute right-2 bottom-1 p-2" onClick={replyMessage ? handleReplyMessage : handleSendMessage}>
          <FaPaperPlane className="text-blue-500" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
