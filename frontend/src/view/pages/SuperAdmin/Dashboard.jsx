import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { i1, i2, i3, i4 } from '../../../constants/assets';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import '../../../admin.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Today_Task from './Dashboard Table/Today_Task';
import Ongoing_Project from './Dashboard Table/Ongoing_Project';
import Activity_Task from './Dashboard Table/Activity_Task';
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';

const Dashboard = () => {
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [taskDetails, setTaskDetails] = useState({});
    const [allTasks, setAllTasks] = useState([]);
    const navigate = useNavigate();
    const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();

    const user = JSON.parse(localStorage.getItem('user'));
    const profilePicture = user?.profilePicture?.url || user?.profilePicture;
    const userName = user?.name;
    const defaultProfilePictureUrl = 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png';

    const [selectedProjectName, setSelectedProjectName] = useState('Projects');
    const [selectedProjectTaskCounts, setSelectedProjectTaskCounts] = useState({
        assignedTask: 0,
        taskComplete: 0,
        objectiveComplete: 0,
        projectComplete: 0
    });

    // Function to fetch all projects and tasks across all workspaces
    const handleProjectClick = async (projectId, projectName) => {
        if (projectName === "All") {
            setSelectedProjectName("All");
            setSelectedWorkspace(null); // Clear workspace when selecting "All"

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;

                const response = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                const allProjects = response.data;
                setProjects(allProjects); // Store all projects across workspaces
    
                // Calculate task counts and aggregate tasks
                let totalAssignedTask = 0;
                let totalTaskComplete = 0;
                let totalObjectiveComplete = 0;
                let aggregatedTasks = [];

                await Promise.all(
                    allProjects.map(async (project) => {
                        const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
                        const tasks = taskResponse.data.data;

                        totalAssignedTask += tasks.length;
                        totalTaskComplete += tasks.filter(task => task.status === "Done").length;
                        totalObjectiveComplete += tasks.reduce((total, task) => total + (task.doneObjectivesCount || 0), 0);
    
                        aggregatedTasks = [...aggregatedTasks, ...tasks]; // Collect all tasks
    
                        return tasks;
                    })
                );

                const totalProjectComplete = totalAssignedTask > 0
                    ? Math.round((totalTaskComplete / totalAssignedTask) * 100)
                    : 0;

                setSelectedProjectTaskCounts({
                    assignedTask: totalAssignedTask,
                    taskComplete: totalTaskComplete,
                    objectiveComplete: totalObjectiveComplete,
                    projectComplete: totalProjectComplete,
                });
    
                setAllTasks(aggregatedTasks); // Set all tasks for Today_Task component
                setIsProjectDropdownOpen(false);
            } catch (error) {
                console.error("Error fetching all projects and tasks:", error);
            }
            return;
        }

        setSelectedProjectName(projectName);
        try {
            const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${projectId}`);
            const tasks = taskResponse.data.data;

            const assignedTaskCount = tasks.length;
            const taskCompleteCount = tasks.filter(task => task.status === "Done").length;
            const objectiveCompleteCount = tasks.reduce(
                (total, task) => total + (task.doneObjectivesCount || 0),
                0
            );

            const projectComplete = assignedTaskCount > 0
                ? Math.round((taskCompleteCount / assignedTaskCount) * 100)
                : 0;

            setSelectedProjectTaskCounts({
                assignedTask: assignedTaskCount,
                taskComplete: taskCompleteCount,
                objectiveComplete: objectiveCompleteCount,
                projectComplete: projectComplete,
            });

            setProjects(projects.filter(project => project._id === projectId));
            setAllTasks(tasks);
            setIsProjectDropdownOpen(false);
        } catch (error) {
            console.error("Error fetching task details:", error);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            if (!selectedWorkspace) return;

            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const accessToken = user ? user.accessToken : null;
    
                const response = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        workspaceId: selectedWorkspace._id, // Filter by selected workspace
                    }
                });

                setProjects(response.data);

                const taskDetailsPromises = response.data.map(async (project) => {
                    const taskResponse = await axios.get(`http://localhost:5000/api/users/sa-tasks/${project._id}`);
                    const tasks = taskResponse.data.data;

                    const attachmentsCount = tasks.reduce((total, task) => total + (task.attachment?.length || 0), 0);
                    const objectivesCount = tasks.reduce((total, task) => total + (task.objectives?.length || 0), 0);

                    return { projectId: project._id, attachmentsCount, objectivesCount, tasks };
                });

                const details = await Promise.all(taskDetailsPromises);
                const taskDetailsMap = details.reduce((acc, { projectId, attachmentsCount, objectivesCount, tasks }) => {
                    acc[projectId] = { attachmentsCount, objectivesCount, tasks };
                    return acc;
                }, {});

                setTaskDetails(taskDetailsMap);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [selectedWorkspace]);

    const toggleProjectDropdown = () => setIsProjectDropdownOpen(!isProjectDropdownOpen);
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    const calculateProgress = (projectId) => {
        const { tasks = [] } = taskDetails[projectId] || {};
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(task => task.status === 'Done').length;
        return totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-2xl font-medium text-gray-800 hidden md:block">Dashboard</h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            <div className="block md:hidden text-black text-2xl font-semibold ml-2 mb-3">
                Dashboard
            </div>

            <div className="relative mb-6 z-20">
                <button
                    onClick={toggleProjectDropdown}
                    className="relative flex items-center h-12 w-56 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm z-999"
                >
                    <span className="text-sm font-medium">{selectedProjectName}</span>
                    <svg
                        className={`absolute right-4 w-5 h-5 transform transition-transform duration-300 ${isProjectDropdownOpen ? "rotate-180" : "rotate-0"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                <div className={`absolute left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 ${isProjectDropdownOpen ? "block" : "hidden"}`}>
                    <a
                        href="#"
                        onClick={() => handleProjectClick(null, "All")}
                        className="block px-6 py-3 text-gray-800 hover:bg-gray-100"
                    >
                        All
                    </a>
                    {projects.length > 0
                        ? projects.map((project, index) => (
                              <a
                                  key={index}
                                  href="#"
                                  onClick={() => handleProjectClick(project._id, project.projectName)}
                                  className="block px-6 py-3 text-gray-800 hover:bg-gray-100"
                              >
                                  {project.projectName}
                              </a>
                          ))
                        : <p className="px-6 py-3 text-gray-500">No projects available</p>}
                </div>
            </div>

            <div className="hidden md:flex flex-wrap gap-4 relative z-0 mb-6">
                {[{ title: "Assigned Task", icon: i1, count: selectedProjectTaskCounts.assignedTask },
                  { title: "Task Complete", icon: i2, count: selectedProjectTaskCounts.taskComplete },
                  { title: "Objective Complete", icon: i3, count: selectedProjectTaskCounts.objectiveComplete },
                  { title: "Project Complete", icon: i4, count: `${selectedProjectTaskCounts.projectComplete}%` }
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
                        <div className="ml-16">
                            <div className="text-gray-800 font-semibold mb-1 text-sm">{title}</div>
                            <div className="text-3xl font-bold">{count || 0}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="block md:hidden">
                <Slider {...sliderSettings}>
                    {[{ title: "Assigned Task", icon: i1, count: selectedProjectTaskCounts.assignedTask },
                      { title: "Task Complete", icon: i2, count: selectedProjectTaskCounts.taskComplete },
                      { title: "Objective Complete", icon: i3, count: selectedProjectTaskCounts.objectiveComplete },
                      { title: "Project Complete", icon: i4, count: `${selectedProjectTaskCounts.projectComplete}%` }
                    ].map(({ title, icon, count }, index) => (
                        <div key={index} className="p-4 flex flex-col items-start justify-center">
                            <div
                                className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm flex flex-col items-start justify-start"
                                style={{
                                    minWidth: '150px',
                                    height: '200px',
                                    backgroundImage: `url(${icon})`,
                                    backgroundSize: '60px 60px',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'left 24px top 20px',
                                }}
                            >
                                <div className="ml-2 mt-20 text-left">
                                    <div className="text-gray-800 font-semibold mb-1 text-xl">{title}</div>
                                    <div className="text-2xl font-bold">{count || 0}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="flex flex-col md:flex-row mb-2 gap-4">
                <div className="w-full md:w-3/5">
                    <Today_Task projects={projects} taskDetails={taskDetails} allTasks={allTasks} />
                </div>
                <div className="h-full md:w-2/5 flex-grow flex flex-col gap-2">
                    <div className="h-1/4">
                    <Activity_Task 
    allTasks={allTasks} // Pass allTasks directly
    profilePicture={profilePicture}
    userName={userName}
    defaultProfilePictureUrl={defaultProfilePictureUrl}
/>

                    </div>
                    <div className="h-full mt-10">
                    <Ongoing_Project 
    projects={projects} 
    taskDetails={taskDetails} 
    calculateProgress={calculateProgress} 
/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
