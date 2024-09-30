import React, { useState, useEffect } from "react";
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';
import { FaBars } from 'react-icons/fa';

const AdminLayout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) { // Adjust this value as needed
                closeNav();
            }
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative flex">
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${isNavOpen ? 'block' : 'hidden'} lg:hidden`}
                onClick={closeNav}
            />
            
            {!isNavOpen && (
                <button 
                    className="lg:hidden p-4 absolute top-0 left-0 z-30 text-gray-600 mt-3"
                    onClick={toggleNav}
                >
                    <FaBars size={24} />
                </button>
            )}

            <SideNav isNavOpen={isNavOpen} />

            <main 
                className={`transition-transform duration-300 ${
                    isNavOpen ? 'lg:ml-[250px] ml-64' : 'lg:ml-[250px] ml-0'
                } w-full h-full`}
            >
                <Outlet context={{ isNavOpen }} />
            </main>
        </div>
    );
};

export default AdminLayout;
