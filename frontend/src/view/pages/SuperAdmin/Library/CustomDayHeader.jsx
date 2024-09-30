import React from 'react';

const CustomDayHeader = ({ label, tasks }) => {
    const tasksForDay = tasks.filter(task => {
        const taskDate = new Date(task.startDate);
        return taskDate.toDateString() === new Date(label).toDateString();
    });

    return (
        <div className="text-gray-700 text-left">
            <div className="font-bold">{label.slice(0, 3)}</div>
            {tasksForDay.length > 0 && (
                <div className="text-sm mt-1">
                    {tasksForDay.map(task => (
                        <div key={task.id} className="truncate">
                            {task.taskName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDayHeader;
