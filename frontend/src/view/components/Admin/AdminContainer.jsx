import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminContainer = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [profilePicture, setProfilePicture] = useState(null);
    const [userName, setUserName] = useState('');
    const [showLogoutBox, setShowLogoutBox] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false); // Track burger menu state
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const defaultProfilePicture = 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'; 
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserName(`${user.firstName} ${user.lastName}`);
            setProfilePicture(user.profilePicture ? user.profilePicture.url || user.profilePicture : defaultProfilePicture);
        }
    }, []);

    useEffect(() => {
        switch (location.pathname) {
            case '/admin':
                setSelectedTab(0);
                break;
            case '/products':
                setSelectedTab(1);
                break;
            case '/projects':
                setSelectedTab(2);
                break;
            case '/events-admin':
                setSelectedTab(3);
                break;
            default:
                break;
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLogoutBox(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/notifications');
                const data = await response.json();
                setHasNewNotifications(data.hasNew);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        fetchNotifications();
        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 600000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) { // sm breakpoint
                setIsNavOpen(false); // Close navbar on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setProfilePicture(null);
        navigate('/login');
        window.location.reload();
    };

    const handleBellClick = async () => {
        setHasNewNotifications(false);
        try {
            await fetch('http://localhost:5000/api/users/notification', { method: 'GET' });
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const handleOverlayClick = () => {
        setIsNavOpen(false);
    };

    // Updated to change the selected tab color to yellow when active
    const tabStyle = (isSelected) =>
        `py-2 px-6 rounded-full cursor-pointer transition-all duration-300 ${
            isSelected ? 'bg-white shadow text-yellow-500 font-bold' : 'text-gray-500'
        }`;

    return (
        <div className="min-h-screen bg-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
                {/* Burger menu for mobile */}
                <div className="flex items-center">
                    <button className="sm:hidden mr-4 mb-5" onClick={() => setIsNavOpen(!isNavOpen)}>
                        <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} size="lg" />
                    </button>

                    {/* Admin1 for website (desktop) view */}
                    <h1 className="hidden sm:block text-3xl sm:text-4xl font-bold text-red-800 cursor-pointer mb-6 mr-10" onClick={() => navigate('/admin')}>
                        Admin
                    </h1>

                </div>
                {/* Admin2 for mobile view */}
                <h1 className="block sm:hidden text-3xl sm:text-4xl font-bold text-red-800 cursor-pointer mb-6 mr-0" onClick={() => navigate('/admin')}>
                    Admin
                </h1>

                {/* Desktop layout */}
                <div className="hidden sm:flex flex-col items-center">
                    <div className="flex gap-4 bg-gray-200 rounded-full p-2 mb-4">
                        <div onClick={() => navigate('/admin')} className={tabStyle(selectedTab === 0)}>
                            Dashboard
                        </div>
                        <div onClick={() => navigate('/products')} className={tabStyle(selectedTab === 1)}>
                            Products
                        </div>
                        <div onClick={() => navigate('/projects')} className={tabStyle(selectedTab === 2)}>
                            Projects
                        </div>
                        <div onClick={() => navigate('/events-admin')} className={tabStyle(selectedTab === 3)}>
                            Events
                        </div>
                    </div>
                </div>

                {/* Profile and notification section */}
                <div className="flex items-center mb-7">
                    <FontAwesomeIcon
                        icon={faBell}
                        size="lg"
                        className="text-gray-500 cursor-pointer mr-6"
                        onClick={handleBellClick}
                    />
                    {hasNewNotifications && (
                        <>
                            {/* Dot for mobile size */}
                            <span className="absolute top-8 right-[82px] w-2 h-2 bg-yellow-500 rounded-full 
                                block lg:hidden sm:w-3 sm:h-3"></span>
                            
                            {/* Dot for website size */}
                            <span className="absolute top-10 right-[207px] w-2 h-2 bg-yellow-500 rounded-full 
                                hidden lg:block"></span>
                        </>
                    )}

                    <div
                        className="flex items-center cursor-pointer relative"
                        onClick={() => setShowLogoutBox(!showLogoutBox)}
                        ref={dropdownRef}
                    >
                        <img
                            src={profilePicture || 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="ml-2 text-gray-700 font-semibold hidden sm:inline">{userName}</span>
                        {showLogoutBox && (
                            <div className="absolute mt-12 sm:mt-24 w-24 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`fixed top-0 left-0 w-64 bg-white h-full z-50 transform transition-transform ${
                    isNavOpen ? 'translate-x-0' : '-translate-x-full'
                } sm:hidden`}
            >
                <div className="flex flex-col p-6">
                    <div onClick={() => navigate('/admin')} className={tabStyle(selectedTab === 0)}>
                        Dashboard
                    </div>
                    <div onClick={() => navigate('/products')} className={tabStyle(selectedTab === 1)}>
                        Products
                    </div>
                    <div onClick={() => navigate('/projects')} className={tabStyle(selectedTab === 2)}>
                        Projects
                    </div>
                    <div onClick={() => navigate('/events-admin')} className={tabStyle(selectedTab === 3)}>
                        Events
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isNavOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleOverlayClick}
                ></div>
            )}

            <div>{children}</div>
        </div>
    );
};

export default AdminContainer;
