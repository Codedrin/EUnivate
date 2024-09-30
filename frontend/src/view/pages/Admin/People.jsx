// import React, { useState, useEffect } from 'react';
// import '../../../admin.css';
// import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
// import { User } from '../../../constants/assets';  // Import the default image

// const People = () => {
//     const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
//     const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [allUsers, setAllUsers] = useState([]);

//     const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

//     const handleRoleChange = (newRole) => {
//         if (currentUser) {
//             const updatedUser = { ...currentUser, role: newRole };
//             setCurrentUser(updatedUser);

//             // Update the current user's role in local storage
//             localStorage.setItem('user', JSON.stringify(updatedUser));

//             // Update all users in local storage
//             const updatedAllUsers = allUsers.map(u => u.email === updatedUser.email ? updatedUser : u);
//             setAllUsers(updatedAllUsers);
//             localStorage.setItem('allUsers', JSON.stringify(updatedAllUsers));

//             setIsRoleDropdownOpen(false);
//         }
//     };

//     useEffect(() => {
//         // Retrieve the current user and all users from local storage
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         const storedAllUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

//         if (storedUser) {
//             setCurrentUser(storedUser);
//         }
//         setAllUsers(storedAllUsers);
//     }, []);

//     useEffect(() => {
//         // Save current user to all users list if they are not already there
//         if (currentUser && currentUser.email) {
//             const updatedAllUsers = allUsers.some(u => u.email === currentUser.email)
//                 ? allUsers.map(u => u.email === currentUser.email ? currentUser : u)
//                 : [...allUsers, currentUser];

//             setAllUsers(updatedAllUsers);
//             localStorage.setItem('allUsers', JSON.stringify(updatedAllUsers));
//         }
//     }, [currentUser]);

//     return (
//         <div className="bg-gray-100 min-h-screen p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-16">
//                 <h1 className="text-2xl font-medium text-gray-800">People</h1>
//                 <div className="flex items-center space-x-4">
//                     <AdminNavbar 
//                         isAccountDropdownOpen={isAccountDropdownOpen} 
//                         toggleAccountDropdown={toggleAccountDropdown} 
//                     />
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mb-6">
//                 <div className="flex justify-between items-center">
//                     <p className="text-2xl font-semibold text-gray-700">Member List</p>
//                     <button className="bg-red-800 text-white px-4 py-2 rounded flex items-center hover:bg-red-900">
//                         <i className="fas fa-user-plus mr-2"></i>
//                         Add Members
//                     </button>
//                 </div>
//             </div>

//             {/* New Box */}
//             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {/* Display all users */}
//                         {allUsers.map((user, index) => (
//                             <tr key={index}>
//                                 <td className="px-6 py-4 whitespace-nowrap flex items-center">
//                                     {/* Avatar */}
//                                     <img 
//                                         src={user.avatar || User}  // Use the imported image if no user avatar
//                                         alt="Avatar" 
//                                         className="w-12 h-12 rounded-full mr-4 object-cover"
//                                     />
//                                     <div>
//                                         <div className="text-xl font-medium text-gray-900">
//                                             {user.firstName} {user.lastName}
//                                         </div>
//                                         <div className="text-sm text-gray-500">{user.email}</div>
//                                     </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500 relative">
//                                     {user.email === currentUser?.email ? (
//                                         <>
//                                             {user.role}
//                                             <FontAwesomeIcon 
//                                                 icon={faChevronDown} 
//                                                 className="ml-2 cursor-pointer" 
//                                                 onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
//                                             />
//                                             {isRoleDropdownOpen && (
//                                                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                                                     <ul className="py-1">
//                                                         <li 
//                                                             className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
//                                                             onClick={() => handleRoleChange('Guest')}
//                                                         >
//                                                             Guest
//                                                         </li>
//                                                         <li 
//                                                             className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
//                                                             onClick={() => handleRoleChange('Member')}
//                                                         >
//                                                             Member
//                                                         </li>
//                                                         <li 
//                                                             className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
//                                                             onClick={() => handleRoleChange('Admin')}
//                                                         >
//                                                             Admin
//                                                         </li>
//                                                     </ul>
//                                                 </div>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <>{user.role}</>
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {/* Add project information if available */}
//                                     N/A
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default People;
