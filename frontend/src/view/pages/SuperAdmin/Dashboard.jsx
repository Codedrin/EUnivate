import React, { useState, useEffect } from 'react';
import { i1, i2, i3, i4 } from '../../../constants/assets';
import Slider from "react-slick"; // Import react-slick
import '../../../admin.css';
import "slick-carousel/slick/slick.css"; // Import slick-carousel css
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme css
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import { FaCalendarAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [projectCount, setProjectCount] = useState(0);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
        setProjects(storedProjects);
        setProjectCount(storedProjects.length);
    }, []);

    const toggleProjectDropdown = () => setIsProjectDropdownOpen(!isProjectDropdownOpen);
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    // Settings for the react-slick carousel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,  // Show two items at a time on mobile
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-16">
                <div className="relative">
                    <h1 className="text-2xl font-medium text-gray-800 hidden md:block">
                        Dashboard
                    </h1>
                </div>

                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            {/* Mobile Dashboard Text */}
            <div className="block md:hidden text-black text-2xl font-semibold ml-2 mb-3">
                Dashboard
            </div>

           {/* Project Dropdown */}
           <div className="relative mb-6 z-20"> 
                <button
                    onClick={toggleProjectDropdown}
                    className="relative flex items-center h-12 w-56 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm"
                >
                    <span className="text-sm font-medium">Projects</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`absolute right-4 w-5 h-5 transform transition-transform duration-300 ${isProjectDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {/* Project Dropdown Menu */}
                <div className={`absolute left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 ${isProjectDropdownOpen ? 'block' : 'hidden'}`}>  {/* Ensure dropdown is in front */}
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <a
                                key={index}
                                href={`/project/${project.id}`}
                                className="block px-6 py-3 text-gray-800 hover:bg-gray-100"
                            >
                                {project.name}
                            </a>
                        ))
                    ) : (
                        <p className="px-6 py-3 text-gray-500">No projects available</p>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mb-6">
                {/* For Desktop: Show flex row layout, for mobile show carousel */}
                <div className="hidden md:flex flex-wrap gap-4 relative z-0">  {/* Ensure boxes are behind */}
                    {[{ title: "Assigned Task", icon: i1, count: projectCount },
                      { title: "Task Complete", icon: i2 },
                      { title: "Objective Complete", icon: i3 },
                      { title: "Project Complete", icon: i4 }
                    ].map(({ title, icon, count }, index) => (
                        <div
                            key={index}
                            className="flex-1 min-w-[200px] bg-white p-4 border border-gray-300 rounded-lg shadow-sm flex items-center"
                            style={{
                                backgroundImage: `url(${icon})`,
                                backgroundSize: '40px 40px',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '18px center'
                            }}
                        >
                            {/* Text and Number */}
                            <div className="ml-16">
                                <div className="text-gray-800 font-semibold mb-1 text-sm">{title}</div>
                                <div className="text-3xl font-bold">{count || 0}</div>
                            </div>
                        </div>
                    ))}
                </div>


{/* For Mobile: Show as a carousel with square boxes */}
<div className="block md:hidden">
                    <Slider {...sliderSettings}>
                        {[{ title: "Assigned Task", icon: i1, count: projectCount },
                          { title: "Task Complete", icon: i2 },
                          { title: "Objective Complete", icon: i3 },
                          { title: "Project Complete", icon: i4 }
                        ].map(({ title, icon, count }, index) => (
                            <div key={index} className="p-4 flex flex-col items-start justify-center">
                                <div
                                    className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm flex flex-col items-start justify-start"
                                    style={{
                                        minWidth: '150px', // Square dimensions for mobile
                                        height: '200px',
                                        backgroundImage: `url(${icon})`,
                                        backgroundSize: '60px 60px', // Icon size
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'left 24px top 20px', // Position the icon at the top left with some margin
                                    }}
                                >
                                    {/* Text and Number */}
                                    <div className="ml-2 mt-20 text-left"> {/* Adjust margin-top to fine-tune spacing */}
                                        <div className="text-gray-800 font-semibold mb-1 text-xl">{title}</div> {/* Reduced font size */}
                                        <div className="text-2xl font-bold">{count || 0}</div> {/* Reduced font size */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>




            </div>

{/* Today Task and Activity */}
<div className="flex flex-col md:flex-row mb-2 gap-4">
    <div className="w-full md:w-3/5">
        <h2 className="text-medium font-semibold text-gray-800 mb-2">Today Task</h2>
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm today-task-div">
            <p>Content for Today Task goes here...</p>
        </div>
    </div>
    <div className="w-full md:w-2/5">
        <h2 className="text-medium font-semibold text-gray-800 mb-2">Activity</h2>
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm activity-div">
            <p>Content for Activity goes here...</p>
        </div>
    </div>
</div>



            {/* Ongoing Projects */}
            <div className="flex flex-col">
                <h2 className="text-medium font-semibold text-gray-800 mb-2">Ongoing Projects</h2>
                <div className="ongoing-projects">
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <div key={index} className="bg-white p-4 border border-gray-200 rounded-md shadow-md mb-4 flex items-center space-x-4">
                                {project.image && (
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                                <div>
                                    <p className="text-gray-800 font-semibold">{project.name}.App</p>
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <p>{project.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No ongoing projects</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
