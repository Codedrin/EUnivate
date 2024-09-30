import React from "react";
import { Link } from 'react-router-dom';
import { 
    dashboard_logo, 
    messages_red, 
    project_red, 
    settings_red, 
    task_red,
    messages_icon,
    project_icon,
    settings_icon,
    task_icon
} from "../../../constants/assets";

const MemberLayout = ({ isNavOpen }) => {
    return (
        <div
            className={`side-nav-admin fixed top-0 left-0 h-full bg-red-750 shadow-lg transition-transform transform ${
                isNavOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:w-[250px] z-30`}
        >
            <div className="dashboard-logo flex items-center p-4">
                <img
                    src={dashboard_logo}
                    alt="EUnivate Logo"
                    className="h-7 mr-3"
                />
                <h2 className="text-lg font-bold text-white mt-3">EUnivate</h2>
            </div>

            <ul className="list-none p-0">
                {[{
                    to: "projectmem", text: "Project", icon: project_icon, hoverIcon: project_red
                },
                {
                    to: "taskmem", text: "My Task", icon: task_icon, hoverIcon: task_red
                },
                {
                    to: "messages", text: "Messages", icon: messages_icon, hoverIcon: messages_red
                },
                {
                    to: "settings", text: "Settings", icon: settings_icon, hoverIcon: settings_red
                }].map((item, index) => (
                    <li className="mb-2" key={index}>
                        <Link
                            to={item.to}
                            className="group relative flex items-center p-2 bg-red-750 hover:bg-red-700 rounded-md transition-all"
                        >
                            <img
                                src={item.icon}
                                alt={`${item.text} Icon`}
                                className="absolute h-5 group-hover:hidden"
                            />
                            <img
                                src={item.hoverIcon}
                                alt={`${item.text} Icon Red`}
                                className="absolute h-5 hidden group-hover:block -translate-y-1"
                            />
                            <span className="ml-10 text-red-750 group-hover:text-red-750">
                                {item.text}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberLayout;
