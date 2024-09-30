import React from 'react';
import { FaFlag } from 'react-icons/fa';

const List = ({ tasks }) => {
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'easy':
                return 'text-green-500';
            case 'medium':
                return 'text-orange-500';
            case 'high':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusColor = (status) => {
        return 'text-black-500'; // Default color for all statuses
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status || (status === 'Document' && task.status === 'Pending'));
    };

    return (
        <div className="p-4">
            {['Document', 'Todo', 'Ongoing', 'Done', 'Backlogs'].map((status) => (
                <div key={status} className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">{status}</h2>
                    {getTasksByStatus(status).length > 0 ? (
                        getTasksByStatus(status).map((task) => (
                            <div 
                                key={task._id} 
                                className="border p-4 mb-4 rounded bg-white shadow-md grid sm:grid-cols-6 grid-cols-3 gap-4 items-start"
                            >
                                {/* Task name (left on mobile) */}
                                <div className="col-span-1">
                                    <p className="text-xs text-gray-400 mb-4 hidden sm:block">Task</p> {/* Hidden on mobile */}
                                    <h3 className="text-lg font-semibold">{task.taskName}</h3>
                                </div>

                                {/* Due date (centered on mobile) */}
                                <div className="col-span-1 text-center sm:text-left">
                                    <p className="text-xs text-gray-400 mb-5 hidden sm:block">Due Date</p> {/* Hidden on mobile */}
                                    <p className="text-sm">{task.dueDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.dueDate)) : 'No due date'}</p>
                                </div>

                                {/* Hidden fields on mobile */}
                                <div className="hidden sm:block col-span-1">
    <p className="text-xs text-gray-400 mb-4">Description</p>
    <p className="text-xs truncate overflow-hidden whitespace-nowrap">{task.description}</p>
</div>

                                <div className="hidden sm:block col-span-1">
                                    <p className="text-xs text-gray-400 mb-4">Priority</p>
                                    <div className="flex items-center">
                                        <FaFlag className={`${getPriorityColor(task.priority)} ml-2`} />
                                        <span className="text-sm text-gray-700 ml-2">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block col-span-1">
                                    <p className="text-xs text-gray-400 mb-4">Status</p>
                                    <p className={`text-sm ${getStatusColor(task.status)}`}>{task.status}</p>
                                </div>

                                {/* Assignee (right on mobile) */}
                                <div className="col-span-1 text-right">
                                    <p className="text-xs text-gray-400 mb-4 hidden sm:block">Assigned</p> {/* Hidden on mobile */}
                                    <div className="flex justify-end items-center">
                                        {task.assignee && task.assignee.length > 0 ? (
                                            <img src={task.assignee[0].profilePicture} alt="Assignee Avatar" className="w-7 h-7 rounded-full object-cover mr-2" />
                                        ) : (
                                            <img src="/path/to/default/avatar.png" alt="Default Avatar" className="w-7 h-7 rounded-full object-cover mr-2" />
                                        )}
                                        <p>{task.assignee ? task.assignee.map(member => member.name).join(', ') : 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tasks available for this status.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default List;
