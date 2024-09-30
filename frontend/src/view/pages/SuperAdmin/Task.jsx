import React, { useState } from 'react';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';

const Task = () => {
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-2xl font-medium text-gray-800 hidden md:block">
                        Task
                    </h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            {/* Assignee Label */}
            <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-700 text-left">
                    Assignee
                </h2>
            </div>

            {/* Two boxes side by side */}
            <div className="mt-4 flex gap-4">
                {/* Box on the left side with extended width */}
                <div className="p-6 bg-white border rounded-lg shadow-md w-full h-96"> {/* Set height here */}
                    {/* Combined content inside the Assignee box */}
                    <div className="flex justify-between items-center text-gray-600 text-xs mb-2">
                        <p className="mr-28">Task</p> {/* Increased margin for spacing */}
                        <p>Due Date</p>
                        <p>Priority</p>
                        <p>Objective</p>
                        <p>Status</p>
                        <p>Project</p> {/* Aligned to the right side of the box */}
                    </div>
                </div>    
            </div>
            <div>
            </div>
        </div>
    );
};

export default Task;
