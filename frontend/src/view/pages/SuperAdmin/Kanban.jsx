import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendar, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Modal from './KanbanModals/Modal';
import TaskDetailModal from './EditableModals/TaskDetailModal'; // New modal for task details
import axios from 'axios';

const ItemType = {
  TASK: 'task',
};

const Kanban = ({ projectId, projectName }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!projectId) {
          console.error('Project ID is not defined');
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${projectId}`);
        setTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenTaskDetailModal = (task) => {
    setSelectedTask(task);
    setTaskDetailModalOpen(true);
  };

  const handleCloseTaskDetailModal = () => {
    setTaskDetailModalOpen(false);
    setSelectedTask(null); // Clear selected task
  };

  const updateTaskStatus = async (taskId, newStatus, modifiedBy) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/sa-tasks/${taskId}`, {    status: newStatus,
        modifiedBy: modifiedBy,
        history: {
          modifiedBy: modifiedUser,
          modifiedAt: new Date().toISOString(),
          changes: JSON.stringify({ status: newStatus }),
        },
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  const moveTask = (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task._id === taskId);
    if (updatedTask) {
      updatedTask.status = newStatus;
      const user = JSON.parse(localStorage.getItem('user'));
      const currentUserId = user?._id;
      setTasks([...tasks]);
      updateTaskStatus(taskId, newStatus,currentUserId);
    }
  };

  const handleTaskSubmit = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Function to handle task update (description update)
  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map(task =>
      task._id === updatedTask._id ? updatedTask : task
    );
    setTasks(updatedTasks); // Update the tasks array
  
    // Check if the updated task is the currently selected task
    if (selectedTask && selectedTask._id === updatedTask._id) {
      setSelectedTask(updatedTask); // Update selectedTask
    }
  };

  const Column = ({ status, children }) => {
    const [, drop] = useDrop({
      accept: ItemType.TASK,
      drop: (item) => moveTask(item.id, status),
    });
  
    return (
      <div ref={drop} className="w-full sm:w-1/5 p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base text-gray-600 font-bold">{status}</h2>
          <button
            onClick={handleOpenModal}
            className="text-gray-600 p-0 flex items-center justify-center"
            style={{ width: '30px', height: '30px' }}
          >
            <FaPlus size={16} />
          </button>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    );
  };
  
  const TaskCard = ({ task }) => {
    const [, drag] = useDrag({
      type: ItemType.TASK,
      item: { id: task._id },
    });

    const handleTaskClick = () => {
      handleOpenTaskDetailModal(task); // Open the task detail modal
    };

    const getPriorityBackgroundColor = (priority) => {
      switch (priority) {
        case 'easy':
          return 'bg-green-200 text-green-800';
        case 'medium':
          return 'bg-orange-200 text-orange-800';
        case 'hard':
          return 'bg-red-200 text-red-800';
        default:
          return 'bg-gray-200 text-gray-800';
      }
    };

    const formatStartMonth = (startDate) => {
      if (!startDate) return 'N/A';
      const date = new Date(startDate);
      return date.toLocaleString('default', { month: 'short' }); 
    };

    const Tooltip = ({ children, title }) => {
      return (
        <div className="relative group">
          {children}
          <div
            className="absolute hidden group-hover:flex bg-gray-500 text-white text-xs rounded-md p-2 whitespace-nowrap -top-10 left-1/2 transform -translate-x-1/2"
            style={{ zIndex: 10 }}
          >
            {title}
          </div>
        </div>
      );
    };
    

    return (
      <div ref={drag} className="p-4 rounded-lg shadow-md bg-white relative" onClick={handleTaskClick}>
      <div className="flex items-start justify-between">
        <div className={`px-3 py-2 text-sm font-medium rounded-sm ${getPriorityBackgroundColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
        <div className='flex -space-x-3'>
          {task.assignee && task.assignee.map((member, index) => (
      <Tooltip key={index} title={`${member.firstName} ${member.lastName}`}>
              <img
                src={member.profilePicture?.url || member.profilePicture} 
                alt={`${member.firstName} ${member.lastName}`} // Update alt text for better accessibility
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </Tooltip>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <h2 className="text-2xl font-semibold mb-2">{task.taskName}</h2>
          <p className="text-lg text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">{task.description}</p>
          {task.attachment && task.attachment.length > 0 && (
            <div className="mt-4 flex overflow-x-auto space-x-2 py-2 justify-center">
              {task.attachment.map((attachment, index) => (
                <img
                  key={index}
                  src={attachment?.url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full sm:w-40 h-48 sm:h-36 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center space-x-3 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FaCalendar className="text-gray-400" />
            <p>{formatStartMonth(task.startDate)}</p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FaPaperclip className="text-gray-400" />
            <p>{task.attachment ? task.attachment.length : 0}</p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <FaCheckCircle className="text-gray-400" />
            <p>{task.doneObjectivesCount || 0}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="flex flex-wrap p-4">
    {['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'].map((status) => (
  <Column key={status} status={status}>
    {tasks
      .filter(task => task.status === status)
      .map(task => (
        <TaskCard key={task._id} task={task} />
      ))}
  </Column>
))}

    </div>
    <Modal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
      projectId={projectId} 
      onTaskSubmit={handleTaskSubmit} 
    />
    <TaskDetailModal
      isOpen={isTaskDetailModalOpen} 
      onClose={handleCloseTaskDetailModal} 
      task={selectedTask} 
      projectName={projectName} // Pass the project name here
      onUpdateTask={handleUpdateTask} // Pass the update task handler to the modal
      projectId={projectId} 
      
    />
  </DndProvider>
  );
};

export default Kanban;