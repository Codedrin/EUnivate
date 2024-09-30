import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Importing Font Awesome icons

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
    const [activeView, setActiveView] = useState(view); // Track the currently active view

    const handleViewChange = (viewName) => {
        setActiveView(viewName);
        onView(viewName); // Notify the parent component about the view change
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            {/* Date and navigation icons - centered on mobile, left-aligned on desktop */}
            <div className="flex justify-center md:justify-start items-center space-x-2 mb-2 md:mb-0">
                <button
                    className="text-red-500 p-1"
                    onClick={() => onNavigate('PREV')}
                >
                    <FaChevronLeft size={18} /> {/* Previous icon */}
                </button>
                <span className="text-lg font-semibold">{label}</span> {/* Full Date Label */}
                <button
                    className="text-red-500 p-1"
                    onClick={() => onNavigate('NEXT')}
                >
                    <FaChevronRight size={18} /> {/* Next icon */}
                </button>
            </div>

            {/* View buttons - hidden on mobile, visible on desktop */}
            <div className="hidden md:flex justify-center md:justify-end space-x-2 w-full md:w-auto">
                <button
                    className={`${activeView === 'month' ? 'bg-red-500 text-white' : 'text-black'} py-1 px-3 rounded-lg`}
                    onClick={() => handleViewChange('month')}
                >
                    Month
                </button>
                <button
                    className={`${activeView === 'week' ? 'bg-red-500 text-white' : 'text-black'} py-1 px-3 rounded-lg`}
                    onClick={() => handleViewChange('week')}
                >
                    Week
                </button>
                <button
                    className={`${activeView === 'day' ? 'bg-red-500 text-white' : 'text-black'} py-1 px-3 rounded-lg`}
                    onClick={() => handleViewChange('day')}
                >
                    Day
                </button>
            </div>
        </div>
    );
};

export default CustomToolbar;
