import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import MemberSidebar from "./MemberLayout"; // Import the MemberSidebar
import { FaBars } from 'react-icons/fa';

const Member = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="relative flex">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${isSidebarOpen ? 'block' : 'hidden'} lg:hidden`}
        onClick={closeSidebar}
      />
      
      {!isSidebarOpen && (
        <button
          className="lg:hidden p-4 absolute top-0 left-0 z-30 text-gray-600 mt-3"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
      )}

      <MemberSidebar isNavOpen={isSidebarOpen} />

      <main
        className={`transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-[250px] ml-64' : 'lg:ml-[250px] ml-0'
        } w-full h-full`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Member;
