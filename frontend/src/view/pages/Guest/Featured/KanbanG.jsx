import React, { useState, useEffect } from 'react';
import { FaCalendar, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import KanbanModalG from '../Modal/KanbanG';
import TaskDetailModalG from '../EditableModals/TaskDetailModalG';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const KanbanG = () => {
  const location = useLocation();
  const { projectId, projectName, tasks: initialTasks } = location.state; // Get projectId and tasks passed from ProjectMem

  const [isModalOpen, setModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setTaskDetailModalOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks || []); // Use initialTasks passed from ProjectMem
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from the backend when the project is loaded
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
    if (!initialTasks || initialTasks.length === 0) {
      fetchTasks();
    }
  }, [projectId, initialTasks]);

  // Modal handling functions
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
    setSelectedTask(null);
  };

  // Column Component for task categorization
  const Column = ({ status, children }) => {
    return (
      <div className="w-full sm:w-1/5 p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base text-gray-600 font-bold">{status}</h2>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    );
  };

  // Task Card Component (non-draggable)
  const TaskCard = ({ task }) => {
    const handleTaskClick = () => {
      handleOpenTaskDetailModal(task);
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
      <div className="p-4 rounded-lg shadow-md bg-white relative" onClick={handleTaskClick}>
        <div className="flex items-start justify-between">
          <div className={`px-3 py-2 text-sm font-medium rounded-sm ${getPriorityBackgroundColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
          <div className='flex -space-x-3'>
            {task.assignee && task.assignee.map((member, index) => (
              <img
                key={index}
                src={member.profilePicture?.url || member.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={member.name}
              />
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
      <KanbanModalG 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        projectId={projectId} 
        onTaskSubmit={setTasks} 
      />
      <TaskDetailModalG
        isOpen={isTaskDetailModalOpen} 
        onClose={handleCloseTaskDetailModal} 
        task={selectedTask} 
        projectName={projectName} 
        onUpdateTask={setTasks} 
        projectId={projectId} 
      />
    </div>
  );
};

export default KanbanG;
