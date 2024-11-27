import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faPaperclip, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import filterIcon from '../../../assets/Filter.png';
import TaskModal from '../SuperAdmin/Library/GanttModal'; // Import the TaskModal component

const GanttChart = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task
  const location = useLocation();
  const projectName = location.state?.project?.name;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${projectId}`);
        setTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (projectId) {
      fetchTasks();
    } else if (projectName) {
      const storedTasks = JSON.parse(localStorage.getItem(`kanban-${projectName}`)) || [];
      setTasks(storedTasks);
    }
  }, [projectId, projectName]);

  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handlePrevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

  const getDaysOfCurrentWeek = (start) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(format(addDays(start, i), 'EEE dd'));
    }
    return days;
  };

  const daysOfCurrentWeek = getDaysOfCurrentWeek(currentWeekStart);

  const getDaysDifference = (startDate, dueDate) => {
    const diffTime = Math.abs(new Date(dueDate) - new Date(startDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTaskLeft = (startDate) => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const taskStart = new Date(startDate);
  
    // Ensure the task only starts after the current week's start date
    if (taskStart < currentWeekStart) {
      return 0; // Task starts before the current week
    }
  
    // Calculate how many days the task is from the start of the current week
    const daysFromWeekStart = Math.floor((taskStart - currentWeekStart) / (1000 * 60 * 60 * 24));
    return (daysFromWeekStart / 7) * 100;
  };
  
  const calculateTaskWidth = (startDate, dueDate) => {
    const totalDaysInWeek = 7;
    const weekEnd = addDays(currentWeekStart, totalDaysInWeek - 1); // Current week's end date
    const taskStart = new Date(startDate);
    const taskEnd = new Date(dueDate);
  
    // If the task ends before the current week, it's not visible
    if (taskEnd < currentWeekStart) {
      return 0;
    }
  
    // If the task starts after the current week, it's not visible
    if (taskStart > weekEnd) {
      return 0;
    }
  
    // Calculate the visible start and end of the task within the current week
    const visibleStart = taskStart < currentWeekStart ? currentWeekStart : taskStart;
    const visibleEnd = taskEnd > weekEnd ? weekEnd : taskEnd;
  
    // Calculate the number of days the task spans within the current week
    const taskDurationWithinWeek = getDaysDifference(visibleStart, visibleEnd) + 1;
    return (taskDurationWithinWeek / totalDaysInWeek) * 100;
  };
  
  

  const getStatusIconColor = (status) => {
    switch (status) {
      case 'Document':
        return 'bg-[#DDFBC5]';
      case 'Todo':
        return 'bg-[#CFE8FF]';
      case 'Ongoing':
        return 'bg-[#FCE9C0]';
      case 'Done':
        return 'bg-[#DBDBDBFF]';
      case 'Backlog':
        return 'bg-[#FED5F2]';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityIconColor = (priority) => {
    switch (priority) {
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

  const allStatuses = ['Document', 'Todo', 'Ongoing', 'Done', 'Backlog'];

  const SMALL_TEXT_THRESHOLD = 10;
  const MAX_TASK_HEIGHT = 4;
  const TASK_SPACING = 1;

  const groupedTasks = allStatuses.map((status) => {
    const filteredTasks = tasks.filter(task => (status === 'Document' && task.status === 'Pending') || task.status === status);
    const totalHeight = filteredTasks.length * (MAX_TASK_HEIGHT + TASK_SPACING);
    const shrinkFactor = totalHeight > MAX_TASK_HEIGHT * 5 ? (MAX_TASK_HEIGHT * 5) / totalHeight : 1;

    return { status, tasks: filteredTasks, shrinkFactor };
  });

  return (
    <div className="p-4 sm:p-8 bg-white shadow-lg rounded-lg overflow-x-auto">
      {/* Navigation buttons and current week */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevWeek} className="bg-red-700 text-white px-4 py-2 rounded">Prev</button>
        <h2 className="text-lg font-semibold">
          {format(currentWeekStart, 'MMMM d')} – {format(addDays(currentWeekStart, 6), 'MMMM d')}
        </h2>
        <button onClick={handleNextWeek} className="bg-red-700 text-white px-4 py-2 rounded">Next</button>
      </div>

      <div className="relative w-full">
  <div className="flex items-center border-b border-gray-300">
    <div className="w-36 min-w-[1rem] border-r border-gray-300 p-2 text-center -ml-28"></div>
    {daysOfCurrentWeek.map((day) => (
      <div key={day} className="flex-1 text-center border-r border-gray-300 p-2">
        {day}
      </div>
    ))}
  </div>
  <div className="relative w-full" style={{ overflowX: 'hidden' }}>
    {groupedTasks.map(({ status, tasks, shrinkFactor }) => (
      <div
        key={status}
        className="flex items-start border-b border-gray-300 mt-16"
        style={{
          minHeight: `${tasks.length * (MAX_TASK_HEIGHT + TASK_SPACING) * shrinkFactor}rem`,
        }}
      >
        <div className="w-28 min-w-[7rem] border-gray-300 p-2 flex items-start -ml-20">
          <div className="transform rotate-90 ml-20 -translate-x-1/2 mb-10 text-xl font-semibold relative translate-y-[-0.5rem]">
            {status}
          </div>
        </div>
        <div className="relative flex-1">
          {tasks.map((task, index) => {
            const taskWidth = calculateTaskWidth(task.startDate, task.dueDate);
            const taskLeft = calculateTaskLeft(task.startDate);
            const taskHeight = MAX_TASK_HEIGHT * shrinkFactor;
            const textSizeClass = taskWidth < SMALL_TEXT_THRESHOLD ? 'text-xs' : 'text-sm';

            return (
              <div
                key={task.id}
                className={`absolute ${getStatusIconColor(task.status)} text-white p-2 rounded-xl`}
                style={{
                  width: `${taskWidth}%`,
                  left: `${taskLeft}%`,
                  top: `${index * (taskHeight + TASK_SPACING)}rem`,
                  height: `${taskHeight}rem`,
                  lineHeight: `${taskHeight}rem`,
                  display: taskWidth > 0 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                onClick={() => setSelectedTask(task)} // Open the modal on task click
              >
                      {/* Task content with assignee avatars on the left, task name, and objectives */}
                      <div className="flex items-center justify-between w-full pl-2">
                        {/* Assignee avatars */}
                        <div className="flex -space-x-3 mr-2">
                          {task.assignee && task.assignee.map((member, index) => (
                            <img
                              key={index}
                              src={member.profilePicture?.url || member.profilePicture}
                              alt={member.name}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              title={member.name}
                            />
                          ))}
                        </div>

                        {/* Task name and Objectives */}
                        <div className="flex flex-col items-start flex-grow">
                          {/* Show task name always */}
                          <div className={`text-black font-semibold ${textSizeClass}`}>
                            {task.taskName}
                          </div>
                          
                          {/* Hide on mobile */}
                          <div className="hidden sm:flex items-center w-full">
                            {/* Icon for Objectives and Objectives text */}
                            <div className="flex items-center text-xs text-black font-semibold mr-2">
                              <img src={filterIcon} alt="Objectives Icon" className="w-4 h-4 mr-1" />
                              {task.objectives ? task.objectives.length : 0} Objectives
                            </div>

                            {/* Paperclip icon and attachment count */}
                            <div className="flex items-center text-xs text-black mx-2">
                              <FontAwesomeIcon icon={faPaperclip} className="text-xs mr-1 text-gray-700" />
                              <span>{task.attachment && task.attachment.length > 0 ? task.attachment.length : '-'}</span>
                            </div>

                            {/* Priority flag icon and text */}
                            <div className="flex items-center text-xs text-black ml-2">
                              <FontAwesomeIcon
                                icon={faFlag}
                                className={`${getPriorityIconColor(task.priority)} mr-1`}
                              />
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Circle with a checkmark for 'Done' tasks */}
                      {task.status === 'Done' && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-green-500 text-white w-7 h-7 items-center justify-center rounded-full hidden sm:flex">
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
              </div>
            )}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TaskModal component */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} /> // Close modal when clicking outside
      )}
    </div>
  );
};

export default GanttChart;
