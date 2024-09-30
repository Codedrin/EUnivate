import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendar, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Modal from './KanbanModals/Modal';
import TaskDetailModal from './EditableModals/TaskDetailModal'; // New modal for task details
import socket from '../../../utilis/socket';
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

        // Listen for real-time updates from Socket.IO
        socket.on('objectiveUpdated', (updatedTask) => {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
          );
        });

         // Cleanup on component unmount
    return () => {
      socket.off('objectiveUpdated');
    };
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/sa-tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const moveTask = (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task._id === taskId);
    if (updatedTask) {
      updatedTask.status = newStatus;
      setTasks([...tasks]);
      updateTaskStatus(taskId, newStatus);
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
    setTasks(updatedTasks); // Update the state with the new task list
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

    return (
      <div ref={drag} className="p-4 rounded-lg shadow-md bg-white relative" onClick={handleTaskClick}>
      <div className="flex items-start justify-between">
        <div className={`px-3 py-2 text-sm font-medium rounded-sm ${getPriorityBackgroundColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
        <div className='flex -space-x-3'>
          {task.assignee && task.assignee.map((member, index) => (
            <img
              key={index}
              src={member.profilePicture?.url}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-white"
              title={member.name}
            />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <h2 className="text-2xl font-semibold mb-2">{task.taskName}</h2>
        <p className="text-lg text-gray-800 truncate">{task.description}</p>
        {task.attachment && task.attachment.length > 0 && (
          <div className="mt-4 flex overflow-x-auto space-x-2 py-2">
            {task.attachment.map((attachment, index) => (
              <img
                key={index}
                src={attachment.url}
                alt={`Attachment ${index + 1}`}
                className="w-full sm:w-40 h-48 sm:h-36 object-cover rounded-md flex-shrink-0"
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
          <p>{task.objectives ? task.objectives.length : 0}</p>
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
