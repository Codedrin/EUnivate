import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faPaperclip, faCheck } from '@fortawesome/free-solid-svg-icons';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import filterIcon from '../../../../assets/Filter.png';
import TaskModal from '../Library_mem/Gantt_Modal_mem'; 

const GanttChart_mem = () => {
  const location = useLocation();
  const { tasks: initialTasks, projectId, projectName } = location.state;

  const [tasks, setTasks] = useState(initialTasks || []);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
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
    const daysFromWeekStart = Math.floor((new Date(startDate) - weekStart) / (1000 * 60 * 60 * 24));
    return daysFromWeekStart > 0 ? (daysFromWeekStart / 7) * 100 : 0;
  };

  const calculateTaskWidth = (startDate, dueDate) => {
    const totalDaysInWeek = 7;
    const weekEnd = addDays(currentWeekStart, totalDaysInWeek);

    if (new Date(dueDate) < currentWeekStart || new Date(startDate) > weekEnd) {
      return 0;
    }

    const taskStart = Math.max(new Date(startDate), currentWeekStart);
    const taskEnd = Math.min(new Date(dueDate), weekEnd);
    const taskDurationWithinWeek = getDaysDifference(taskStart, taskEnd);
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

  const groupedTasks = allStatuses.map((status) => {
    const filteredTasks = tasks.filter(task => (status === 'Document' && task.status === 'Pending') || task.status === status);
    return { status, tasks: filteredTasks };
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
        <div className="overflow-x-auto">
          {groupedTasks.map(({ status, tasks }) => (
            <div key={status} className="flex items-start border-b border-gray-300 mt-16">
              <div className="w-28 min-w-[7rem] border-gray-300 p-2 flex items-start -ml-20">
                <div className="transform rotate-90 ml-20 -translate-x-1/2 mb-10 text-xl font-semibold relative translate-y-[-0.5rem]">
                  {status}
                </div>
              </div>
              <div className="relative flex-1">
                {tasks.map((task, index) => {
                  const taskWidth = calculateTaskWidth(task.startDate, task.dueDate);
                  const taskLeft = calculateTaskLeft(task.startDate);

                  return (
                    <div
                      key={task.id}
                      className={`absolute ${getStatusIconColor(task.status)} text-white p-2 rounded-xl`}
                      style={{
                        width: `${taskWidth}%`,
                        left: `${taskLeft}%`,
                        top: `${index * 3}rem`,
                        height: '4rem',
                        lineHeight: '3rem',
                        display: taskWidth > 0 ? 'flex' : 'none',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center justify-between w-full pl-2">
                        <div className="flex -space-x-3 mr-2">
                          {task.assignee && task.assignee.map((member, idx) => (
                            <img
                              key={idx}
                              src={member.profilePicture?.url || member.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'} 
                              alt={member.name}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              title={member.name}
                            />
                          ))}
                        </div>
                        <div className="flex flex-col items-start flex-grow">
                          <div className="text-black font-semibold text-sm">
                            {task.taskName}
                          </div>
                          <div className="hidden sm:flex items-center w-full">
                            <div className="flex items-center text-xs text-black font-semibold mr-2">
                              <img src={filterIcon} alt="Objectives Icon" className="w-4 h-4 mr-1" />
                              {task.objectives ? task.objectives.length : 0} Objectives
                            </div>
                            <div className="flex items-center text-xs text-black mx-2">
                              <FontAwesomeIcon icon={faPaperclip} className="text-xs mr-1 text-gray-700" />
                              <span>{task.attachment && task.attachment.length > 0 ? task.attachment.length : '-'}</span>
                            </div>
                            <div className="flex items-center text-xs text-black ml-2">
                              <FontAwesomeIcon icon={faFlag} className={`${getPriorityIconColor(task.priority)} mr-1`} />
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {task.status === 'Done' && (
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-green-500 text-white w-7 h-7 flex items-center justify-center rounded-full">
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
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default GanttChart_mem;
