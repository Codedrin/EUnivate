import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For fetching task data

const RaciMatrix = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/sa-tasks/${projectId}`);
        setTasks(response.data.data); // Fetch tasks and set state
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  return (
    <div className="p-4 sm:p-8 bg-white shadow-lg rounded-lg">

      {/* Header Menu with Grid Borders and Gray Background */}
      <div className="grid grid-cols-5 text-xs sm:text-sm font-semibold text-gray-700 mb-4">
        <div className="p-2 text-left bg-gray-100 rounded-tl-lg">Task</div>
        <div className="p-2 text-left bg-gray-100">Status</div>
        <div className="p-2 text-left bg-gray-100">Due Date</div>
        <div className="p-2 text-left bg-gray-100">Responsible</div>
        <div className="p-2 text-left bg-gray-100 rounded-tr-lg">Accountable</div>
      </div>

      {/* Task List */}
      <ul className="space-y-0">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="grid grid-cols-5 text-xs sm:text-sm gap-2 border-b border-gray-200"
          >
            {/* Task Information */}
            <div className="p-2 text-left">
              <h3 className="font-medium">{task.taskName}</h3>
            </div>

            {/* Task Status */}
            <div className="p-2 text-left">
              <p className="text-gray-600">{task.status}</p>
            </div>

            {/* Task Due Date */}
            <div className="p-2 text-left">
              <p className="text-gray-600">
                {new Date(task.dueDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>

            {/* Responsible Member */}
            <div className="p-2 flex flex-col items-start">
              <div className="flex items-center space-x-2">
                {task.assignee && task.assignee.length > 0 && (
                  <>
                    <img
                      src={task.assignee[0]?.profilePicture?.url || task.assignee[0]?.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'} // Fallback to a default image URL if neither is available
                      alt={task.assignee[0]?.name || 'Assignee'} // Fallback to 'Assignee' if name is missing
                      className="w-8 h-8 rounded-full border-2"
                      title={task.assignee[0]?.name || 'Assignee'} // Fallback to 'Assignee' if name is missing
                    />

                    <span className="text-xs sm:text-sm text-gray-800">{task.assignee[0]?.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Accountable Member */}
            <div className="p-2 flex flex-col items-start">
              <div className="flex items-center space-x-2">
                {task.assignee && task.assignee.length > 1 && (
                  <>
                    <img
                      src={task.assignee[1]?.profilePicture?.url || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
                      alt={task.assignee[1]?.name}
                      className="w-8 h-8 rounded-full border-2"
                      title={task.assignee[1]?.name}
                    />
                    <span className="text-xs sm:text-sm text-gray-800">{task.assignee[1]?.name}</span>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RaciMatrix;
