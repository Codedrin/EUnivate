import React, { useState } from 'react';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';

const TaskMem = () => {
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

            {/* Content */}
            <div>
                {/* Add your content related to People here */}
            </div>
        </div>
    );
};

export default TaskMem;
