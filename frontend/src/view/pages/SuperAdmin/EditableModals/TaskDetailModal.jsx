import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaCircle, FaUser, FaFlag, FaEdit, FaTrash, FaPlus, FaCheckCircle  } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import AssigneeModal from './AssigneeModal';




const socket = io('https://eunivate-jys4.onrender.com');

const TaskDetailModal = ({ isOpen, onClose, task, projectName, projectId, onUpdateTask }) => {
  if (!task) return null;

  // State hooks for managing form inputs and other data
  //taskname
  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [editedTaskName, setEditedTaskName] = useState(task.taskName);

  //Assignee
  const [editedAssignees, setEditedAssignees] = useState(task.assignee || [])
  const [membersList, setMembersList] = useState([]);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);

  //StartDate and DueDate
  const [startDate, setStartDate] = useState(new Date(task.startDate));
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);
  const [showSaveStartDateButton, setShowSaveStartDateButton] = useState(false);
  const [showSaveDueDateButton, setShowSaveDueDateButton] = useState(false);

  //Priority
  const [selectedPriority, setSelectedPriority] = useState(task.priority);  // Store selected priority
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showSavePriorityButton, setShowSavePriorityButton] = useState(false);

  // Status
  const [showSaveStatusButton, setShowSaveStatusButton] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(task.status); 
  const [showStatusDropdown, setShowStatusDropdown] = useState(false); 

  //Description
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);

  //objectives
  const [newObjective, setNewObjective] = useState('');
  const [isAddingObjective, setIsAddingObjective] = useState(false);


  //Attachment
  const [newAttachmentFiles, setNewAttachmentFiles] = useState([]);
  const [showSaveAttachmentButton, setShowSaveAttachmentButton] = useState(false);
  const [attachmentPreviewUrls, setAttachmentPreviewUrls] = useState(task.attachment.map(att => att.url));

  //Comments
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);

  //SaveButton
  const [showSaveButton, setShowSaveButton] = useState(false);



  
    const handleTaskNameClick = () => {
      setIsEditingTaskName(true);
      setShowSaveButton(false); // Hide save button initially
    };


   useEffect(() => {
  if (isOpen) {
    console.log('Socket connected?', socket.connected);
    fetchUsers();
    fetchComments(); // Fetch comments when the modal opens

    socket.on('task-updated', (updatedTask) => {
      if (updatedTask._id === task._id) {
        console.log('Received task update:', updatedTask);

        onUpdateTask(updatedTask);
      }
    });
  }

  return () => {
    socket.off('task-updated');
  };
}, [isOpen, task._id, onUpdateTask]);

    
    
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://eunivate-jys4.onrender.com/api/users/get-assignee?projectId=${projectId}`);
        setMembersList(response.data.invitedUsers); // Adjust based on the response structure
      } catch (error) {
        console.error('Error fetching users:', error);
        setMembersList([]);
      }
    };

     // Fetch comments for the task
        const fetchComments = async () => {
          try {
            const response = await axios.get(`https://eunivate-jys4.onrender.com/api/users/sa-tasks/${task._id}/comments`);
            if (response.data.success) {
              setCommentsList(response.data.data); // Populate commentsList with fetched comments
            } else {
              console.error('Failed to fetch comments:', response.data.message);
            }
          } catch (error) {
            console.error('Error fetching comments:', error);
          }
        };


            const handleConfirmAssignees = (selectedMembers) => {
              const assigneeIds = selectedMembers.map((member) => member.id);
              const changes = { assignee: assigneeIds };

              setEditedAssignees(assigneeIds);  
              onUpdateTask({ ...task, ...changes });  
              updateTaskInDatabase(changes);  
            };

        const updateTaskInDatabase = async (changes) => {
          try {
            // Retrieve user information from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const currentUserId = user?._id;
        
            // Add the userId to the updated task object
            const taskData = {
              ...changes,
              modifiedBy: currentUserId,  // Add userId to the request body
            };
        
            const response = await fetch(`https://eunivate-jys4.onrender.com/api/users/sa-tasks/${task._id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(taskData), // Send the updated task data including the userId
            });
        
            const data = await response.json();
            socket.emit('task-updated', { taskId: task._id, ...changes});
        
            if (response.ok) {
              console.log('Task updated successfully:', data);
            } else {
              console.error('Error updating task:', data.message);
            }
          } catch (error) {
            console.error('Error updating task:', error);
          }
        };
        

        const handleSaveTaskName = () => {
          const changes = { taskName: editedTaskName };
          onUpdateTask({ ...task, ...changes });
          updateTaskInDatabase(changes);
          setIsEditingTaskName(false);
      };
      
      const handleSaveStartDate = () => {
        const changes = { startDate };
        onUpdateTask({ ...task, ...changes });
        updateTaskInDatabase(changes);
        setIsEditingStartDate(false);
        setShowSaveStartDateButton(false);
    };
    
    const handleSaveDueDate = () => {
      const changes = { dueDate };
      onUpdateTask({ ...task, ...changes });
      updateTaskInDatabase(changes);
      setIsEditingDueDate(false);
      setShowSaveDueDateButton(false);
  };
  

      const handleTaskNameChange = (e) => {
        setEditedTaskName(e.target.value);
        setShowSaveButton(true); // Show save button when input changes
      };
      const handleSavePriority = () => {
        const changes = { priority: selectedPriority };
        onUpdateTask({ ...task, ...changes });
        updateTaskInDatabase(changes);
        setShowSavePriorityButton(false);
    };
    
    const handlePriorityClick = () => {
      setShowPriorityDropdown(!showPriorityDropdown);
    };

    const handlePriorityChange = (newPriority) => {
      setSelectedPriority(newPriority);
      setShowSavePriorityButton(true);
      setShowPriorityDropdown(false);
    };




    const handleStatusClick = () => {
      setShowStatusDropdown(!showStatusDropdown);
    };

    const handleStatusChange = (newStatus) => {
      setSelectedStatus(newStatus);
      setShowSaveStatusButton(true);
      setShowStatusDropdown(false);
    
      // Update the task's status in the UI immediately
      const updatedTask = { ...task, status: newStatus };
      onUpdateTask(updatedTask);
    };

const handleSaveStatus = async () => {
    const changes = { status: selectedStatus }; 
    onUpdateTask({ ...task, ...changes }); 
    await updateTaskInDatabase(changes); 
    setShowSaveStatusButton(false); 
  };




    const handleDateChange = (dateType, date) => {
      if (dateType === 'start') {
        setStartDate(date);
        setShowSaveStartDateButton(true);
      } else {
        setDueDate(date);
        setShowSaveDueDateButton(true);
      }
    };

    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      const newFiles = [];
      const newUrls = [];

      files.forEach(file => {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
        newFiles.push(file);
      });

        setAttachmentPreviewUrls([...attachmentPreviewUrls, ...newUrls]);
        setNewAttachmentFiles([...newAttachmentFiles, ...newFiles]);
        setShowSaveAttachmentButton(true);
      };

    const getPriorityColor = (priority) => {
      switch (priority.toLowerCase()) {
        case 'easy':
          return 'text-green-500';
        case 'medium':
          return 'text-yellow-500';
        case 'hard':
          return 'text-red-500';
        default:
            return 'text-gray-500';
        }
      };

      const handleEditClick = () => {
        setIsEditing(true);
      };

      const handleEditDescription = () => {
        setIsEditing(true);
    };

    const handleSaveDescription = async () => {
      const changes = { description: editedDescription };
      onUpdateTask({ ...task, ...changes });
      await updateTaskInDatabase(changes);
      setIsEditing(false);
  };
  

      // Objective input toggle
      const handleToggleAddObjective = () => {
        setIsAddingObjective(!isAddingObjective);
      };
      // Function to handle the "Enter" key for adding objective
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleAddObjective(); // Add objective on Enter key press
        }
      };


    const handleAddObjective = () => {
  if (newObjective) {
    // Use the existing objectives or an empty array
    const updatedObjectives = [...(task.objectives || []), { text: newObjective, done: false }];
    const changes = { objectives: updatedObjectives };

    // Update task in the parent component and the backend
    onUpdateTask({ ...task, objectives: updatedObjectives });
    updateTaskInDatabase(changes);

    // Clear the new objective input
    setNewObjective('');
    setIsAddingObjective(false);
  }
};

      
    

    // const handleDeleteAttachment = (attachmentUrl) => {
    //   const updatedAttachments = task.attachment.filter(att => att.url !== attachmentUrl);
    //   onUpdateTask({ ...task, attachment: updatedAttachments });
    // };


    const handleSaveAttachments = async () => {
      const updatedAttachments = [...task.attachment];
      
      for (const file of newAttachmentFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'EunivateImage');
        formData.append('cloud_name', 'dzxzc7kwb');
      
        try {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dzxzc7kwb/image/upload',
            formData
          );
          
          // Add the response data (including public_id) to the updatedAttachments array
          updatedAttachments.push({
            publicId: response.data.public_id,  // Make sure this matches your schema's requirements
            url: response.data.secure_url,
          });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      
      
      // Update the task with the new attachments
      const changes = { attachment: updatedAttachments };
      onUpdateTask({ ...task, ...changes });
      await updateTaskInDatabase(changes);
      
      // Reset states
      setNewAttachmentFiles([]);
      setShowSaveAttachmentButton(false);
    };
    
    const handleToggleObjective = (index) => {
      const updatedObjectives = task.objectives.map((obj, i) => {
        if (i === index) {
          return { ...obj, done: !obj.done }; // Toggle the "done" status
        }
        return obj;
      });
      const changes = { objectives: updatedObjectives };
    
      // Update task in the parent component and the backend
      onUpdateTask({ ...task, objectives: updatedObjectives });
      updateTaskInDatabase(changes);
    };
    
    
    const handleRemoveObjective = (objectiveToRemove) => {
      // Remove the specified objective
      const updatedObjectives = task.objectives.filter((obj) => obj !== objectiveToRemove);
      const changes = { objectives: updatedObjectives };
    
      // Update task in the parent component and the backend
      onUpdateTask({ ...task, objectives: updatedObjectives });
      updateTaskInDatabase(changes);
    };
    
  
    
    
    
    const handleCommentSubmit = async () => {
      if (comment.trim()) {
        const assignee = editedAssignees && editedAssignees.length > 0 ? editedAssignees[0] : null;
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUserId = user?._id;
        if (!assignee) {
          console.error('No assignee selected');
          return;
        }
    
        // Prepare the comment data with only userId and text
        const newComment = {
          userId: currentUserId,  // Ensure this is the correct `id`
          text: comment,
          profilePicture: user.profilePicture
        };
  
      try {
        const response = await axios.post(`https://eunivate-jys4.onrender.com/api/users/sa-tasks/${task._id}/comments`, newComment);
  
        if (response.data.success) {
          // If the API returns the full list of comments, replace the state with the new list
          setCommentsList(response.data.data);  // Assuming response.data.data contains the full list of comments
          setComment(''); // Clear the comment input
        } else {
          console.error('Failed to add comment:', response.data.message);
        }
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };
  


  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="flex items-center justify-center"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end"
    >
    <div className="bg-white rounded-lg shadow-lg p-6 w-96 h-[100vh] max-h-[100vh] overflow-y-auto relative">
      <FaTimes className="absolute top-4 right-4 cursor-pointer text-gray-600 hover:text-gray-800" size={20} onClick={onClose} />

      <div className="flex items-center mb-4">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.status === 'Done' ? 'bg-green-500' : 'bg-gray-300'}`}>
          {task.status === 'Done' ? <FaCheckCircle className="text-white" size={20} /> : <FaCircle className="text-white" size={20} />}
        </div>
        <div className="ml-2">
          <h2 className="text-sm text-gray-500 font-semibold">{projectName}</h2>
          {isEditingTaskName ? (
            <div className="flex items-center">
              <input
                type="text"
                className="text-xl font-semibold text-gray-500 border-b border-gray-300 mr-2"
                value={editedTaskName}
                onChange={handleTaskNameChange}
                onBlur={handleSaveTaskName} // Save when input loses focus
                autoFocus
              />
              {showSaveButton && (
                <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSaveTaskName}>
                  Save
                </button>
              )}
            </div>
        
          ) : (
            <h2
              className="text-xl font-semibold text-gray-500 cursor-pointer"
              onClick={handleTaskNameClick}
            >
              {task.taskName}
            </h2>
          )}
        </div>
      </div>


                      {/* Assignees */}
        <div className="mb-4">
          <button className="flex items-center space-x-2 bg-transparent border-none outline-none focus:outline-none" onClick={() => setIsAssigneeModalOpen(true)}>
            <span className="text-gray-700 text-sm font-semibold flex justify-normal">Assignees</span>
            {editedAssignees.length > 0 ? (
              <div className="flex -space-x-5">
                {editedAssignees.map((assignee, index) => (
                  <div key={index} className="flex items-center">
                {assignee.profilePicture?.url || assignee.profilePicture ? (
                  <img 
                    src={assignee.profilePicture?.url || assignee.profilePicture} 
                    alt={assignee.username || 'User'} 
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <FaUser className="text-gray-500 text-lg bg-transparent rounded-3xl" />
                )}

                    {/* <span className="ml-2 text-sm text-gray-500">{assignee.username}</span> */}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">Assign to</span>
            )}
          </button>
        </div>




            {/* Start Date */}
          <div className="mb-4 flex items-center text-gray-500 relative">
              <div className='text-gray-500 font-semibold'>Start Date:</div>
              <DatePicker
                  selected={startDate}
                  onChange={(date) => handleDateChange('start', date)}
                  className="ml-2 p-1 bg-transparent"
                  dateFormat="MM/dd/yyyy"
                  popperClassName="bg-white"
              />
              {showSaveStartDateButton && (
                  <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={handleSaveStartDate}
                  >
                      Save
                  </button>
              )}
          </div>

          {/* Due Date */}
          <div className="mb-4 flex items-center text-gray-500 relative">
              <div className='text-gray-500 font-semibold'>Due Date:</div>
              <DatePicker
                  selected={dueDate}
                  onChange={(date) => handleDateChange('due', date)}
                  className="ml-2 p-1 bg-transparent"
                  dateFormat="MM/dd/yyyy"
                  popperClassName="bg-white"
              />
              {showSaveDueDateButton && (
                  <button
                      className="bg-red-500 text-white py-1 px-2 rounded ml-2"
                      onClick={handleSaveDueDate}
                  >
                      Save
                  </button>
              )}
          </div>


            {/* Priority */}

            <div className="mb-4 flex items-center text-gray-500 relative">
                    <div className="text-gray-500 font-semibold">Priority:</div>
                    <div className="ml-9 flex items-center cursor-pointer" onClick={handlePriorityClick}>
                      <FaFlag className={getPriorityColor(selectedPriority)} />
                      <span className={`ml-2 ${getPriorityColor(selectedPriority)}`}>{selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}</span>
                    </div>

                    {showPriorityDropdown && (
                      <div className="absolute top-10 left-20 bg-white border border-gray-300 shadow-lg rounded-md w-40 z-10">
                        <ul>
                          {['easy', 'medium', 'hard'].map((priority) => (
                            <li
                              key={priority}
                              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${getPriorityColor(priority)}`}
                              onClick={() => handlePriorityChange(priority)}
                            >
                              <FaFlag className={getPriorityColor(priority)} />
                              <span className="ml-2">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {showSavePriorityButton && (
                      <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSavePriority}>
                        Save
                      </button>
                    )}
                  </div>

                  {/* Status */}
                            <div className="mb-4 flex items-center space-x-4">
            <label className="block text-gray-700 text-sm font-semibold">Status</label>
            <div className="relative">
              <button
                type="button"
                onClick={handleStatusClick}
                className="text-gray-700 px-4 py-2 border-gray-300 rounded flex items-center space-x-2"
              >
                <span>{selectedStatus || 'Select Status'}</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full right-0 bg-white border left-0 border-gray-300 rounded shadow-lg mt-1 w-48 z-10">
                  {['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleStatusChange(item)}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {showSaveStatusButton && (
              <button className="bg-red-500 text-white py-1 px-2 rounded ml-2" onClick={handleSaveStatus}>
                Save
              </button>
            )}
          </div>


       {/* Description Section */}
    <div className="mb-6">
      <div className="text-gray-500 font-semibold">Description:</div>
      {isEditing ? (
        <div>
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <button
            className="mt-2 bg-red-500 text-white py-1 px-4 rounded text-sm hover:bg-red-600 transition-all duration-200"
            onClick={handleSaveDescription}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="relative">
          <p className="mt-2 text-gray-500 text-sm">{task.description}</p>
          <FaEdit
            className="absolute top-0 right-0 cursor-pointer text-gray-500 hover:text-gray-700"
            size={18}
            onClick={handleEditDescription}
          />
        </div>
      )}
    </div>

              {/* Objectives Section */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 font-semibold">Objectives</span>
        <button
          onClick={handleToggleAddObjective}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <FaPlus className="text-gray-500" />
        </button>
      </div>

      {/* New Objective Input */}
      {isAddingObjective && (
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded text-sm"
            placeholder="Enter new objective"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={handleAddObjective}
            className="ml-2 bg-red-500 text-white py-1 px-4 rounded text-sm hover:bg-red-600 transition-all duration-200"
          >
            Add
          </button>
        </div>
      )}

      {/* List of Objectives */}
      <ul className="list-none">
        {task.objectives.length > 0 ? (
          task.objectives.map((objective, index) => (
            <li key={index} className={`flex items-center mt-2 text-sm ${objective.done ? 'text-gray-400' : 'text-black'}`}>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 cursor-pointer ${objective.done ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={() => handleToggleObjective(index)}
              >
                {objective.done ? (
                  <FaCheckCircle className="text-white" size={14} />
                ) : (
                  <FaCircle className="text-white" size={14} />
                )}
              </div>
              <span className={`flex-1 cursor-pointer ${objective.done ? 'line-through' : ''}`}>
                {objective.text || 'New Objective'}
              </span>
              <button
                onClick={() => handleRemoveObjective(objective)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <FaTimes />
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No objectives added yet.</li>
        )}
      </ul>
    </div>





        {/* Attachments */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-500 font-semibold">Attachments:</div>
            <FaPlus
              className="cursor-pointer text-gray-500 hover:text-black"
              onClick={() => document.getElementById('attachmentInput').click()}
            />
          </div>
          <input
            type="file"
            id="attachmentInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {attachmentPreviewUrls.length > 0 ? (
            <div className="flex overflow-x-auto space-x-2 py-2">
              {attachmentPreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} 
                  alt={`Attachment ${index + 1}`} 
                  className="w-32 h-32 object-cover rounded-md" />
      
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">No attachments</span>
          )}
          {showSaveAttachmentButton && (
            <button
              className="mt-2 bg-red-500 text-white py-1 px-4 rounded text-sm hover:bg-red-600 transition-all duration-200"
              onClick={handleSaveAttachments}
            >
              Save Attachments
            </button>
          )}
        </div>


        {/* Comments Section */}
        <div className="mb-4">
        <textarea
          className="w-full mt-2 p-2 border border-gray-300 rounded"
          placeholder="Ask question or post an update"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="mt-2 bg-red-700 text-white py-2 px-6 rounded text-md w-full hover:bg-red-700 transition-all duration-200"
          onClick={handleCommentSubmit}
        >
          Post
        </button>

        {/* Render posted comments */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-500">Comments:</h3>
          {commentsList.length > 0 ? (
            <ul className="list-disc list-inside">
              {commentsList.map((cmt, index) => (
                <li key={index} className="mt-1 flex items-start text-gray-500">
                  <img src={cmt.profilePicture?.url || cmt.profilePicture} 
                  alt={cmt.username} 
                  className="w-8 h-8 rounded-full mr-2" />
                  <div>
                    <strong>{cmt.userName}</strong>
                    <p>{cmt.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">No comments yet.</span>
          )}
        </div>
      </div>
        {isAssigneeModalOpen && (
          <AssigneeModal
            isOpen={isAssigneeModalOpen}
            onClose={() => setIsAssigneeModalOpen(false)}
            members={membersList}
            onConfirm={handleConfirmAssignees}
            
          />
        )}
        
      </div>
      
    </Modal>
    
  );

};

export default TaskDetailModal;