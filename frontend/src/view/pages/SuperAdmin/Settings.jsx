import React, { useState } from "react";
import Slider from "react-slick"; // Import Slider from react-slick
import SettingProfile from "../../components/SuperAdmin/SettingProfile";
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar.jsx'; // Import AdminNavbar
import "slick-carousel/slick/slick.css"; // Import slick-carousel css
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme css

const Settings = () => {
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2, // Adjust the number of items visible at a time
        slidesToScroll: 3,
        arrows: false,
        swipeToSlide: true,
        centerMode: true, // Center the active slide
        centerPadding: '50px', // Adjust padding for better view
    };

    return (
        <div className="min-h-screen flex flex-col items-start justify-start p-4">
            {/* Admin Navbar */}
            <div className="w-full flex justify-between items-center mb-4">
                <div className="relative">
                    <h1 className="text-2xl font-medium text-gray-800 hidden md:block">
                        Settings
                    </h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            {/* Mobile Dashboard Text */}
            <div className="block md:hidden text-black text-2xl font-semibold ml-2 mb-6 mt-5">
                Settings 
            </div>

            {/* Mobile menu - hidden on larger screens */}
            <div className="md:hidden w-full mt-4">
                <Slider {...sliderSettings}>
                    <div className="flex justify-center">
                        <a href="#profile" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold whitespace-nowrap">
                            Profile
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <a href="#notification" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold whitespace-nowrap">
                            Notification
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <a href="#account" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold whitespace-nowrap">
                            Account
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <a href="#privacy-policy" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold whitespace-nowrap">
                            Privacy Policy
                        </a>
                    </div>
                    <div className="flex justify-center">
                        <a href="#apps" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold whitespace-nowrap">
                            Apps
                        </a>
                    </div>
                </Slider>
            </div>

            <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden flex mt-6 flex-col md:flex-row">
    {/* Sidebar for desktop */}
    <div className="hidden md:flex md:w-52 p-4 flex-col space-y-2 md:space-y-4">
        <a href="#profile" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold text-left">
            Profile
        </a>
        <a href="#notification" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold text-left">
            Notification
        </a>
        <a href="#account" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold text-left">
            Account
        </a>
        <a href="#privacy-policy" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold text-left">
            Privacy Policy
        </a>
        <a href="#apps" className="bg-transparent text-red-700 p-2 rounded border border-transparent hover:bg-gray-300 font-bold text-left">
            Apps
        </a>
    </div>

    {/* Main content */}
    <div className="flex-1 p-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        <section id="profile" className="mb-6">
            <SettingProfile />
        </section>
    </div>
</div>

        </div>
    );
};

export default Settings;
