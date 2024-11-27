import React, { useState, useEffect, useRef } from 'react';
import '../../../admin.css';
import AdminNavbar from '../../components/SuperAdmin/AdminNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../constants/assets';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWorkspace } from '../../components/SuperAdmin/workspaceContext';
import axios from 'axios';
import Modal_Profile from './People/Modal_Profile'; // Import the Modal_Profile component

const People = () => {
    const [user, setUser] = useState({ profilePicture: { url: '' } });
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState({});
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profileModalVisible, setProfileModalVisible] = useState(false); // New state for Modal_Profile visibility
    const [selectedProfileUser, setSelectedProfileUser] = useState(null); // State to hold user whose profile is clicked
    const { selectedWorkspace } = useWorkspace(); // Get selected workspace from context

    const fetchProjects = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const accessToken = user?.accessToken;

            if (!accessToken) {
                throw new Error('No access token found. Please log in again.');
            }

            const response = await axios.get('http://localhost:5000/api/users/sa-getnewproject', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('An error occurred while fetching projects.');
        }
    };
    const fetchUsers = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.accessToken;

            if (!token) {
                throw new Error('No access token found. Please log in again.');
            }

            // Fetch all users
            const response = await axios.get('http://localhost:5000/api/users/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            setAllUsers(response.data);
    
            // Fetch invited users specific to the selected workspace
            if (selectedWorkspace) {
                const invitedUsersResponse = await axios.get('http://localhost:5000/api/users/invited', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    params: { workspaceId: selectedWorkspace._id },  // Pass workspaceId as a query param
                });
    
                const invitedUsersData = invitedUsersResponse.data.invitedUsers.map((invitedUser) => {
                    const userFromDB = response.data.find((user) => user.email === invitedUser.email);
    
                     return userFromDB
                        ? { ...invitedUser, role: userFromDB.role, profilePicture: userFromDB.profilePicture, _id: userFromDB._id }
                        : invitedUser;
                });
    
                setInvitedUsers(invitedUsersData);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, [selectedWorkspace]);  // Refetch users when workspace changes
    
    const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);
    
    const toggleRoleDropdown = (userEmail) => {
        setIsRoleDropdownOpen((prev) => ({
            ...prev,
            [userEmail]: !prev[userEmail],
        }));
    };
    
    const toggleProjectDropdown = (userEmail) => {
        setIsProjectDropdownOpen((prev) => ({
            ...prev,
            [userEmail]: !prev[userEmail],
        }));
    };

    
    
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
        if (!isModalOpen) {
            // Reset state when modal opens
            setSelectedRole('');
            setFilteredUsers(allUsers);
            setSelectedEmails([]);
        }
    };
    
    const handleRoleFilter = (role) => {
        setSelectedRole(role);
        const filteredByRole = role
            ? allUsers.filter((user) => user.role.toLowerCase() === role.toLowerCase())
            : allUsers;
    
        setFilteredUsers(filteredByRole.filter((user) => {
            const searchQuery = document.querySelector('input[placeholder="Search email"]').value.toLowerCase();
            return user.email.toLowerCase().includes(searchQuery) ||
                   user.firstName.toLowerCase().includes(searchQuery) ||
                   user.lastName.toLowerCase().includes(searchQuery);
        }));
    };
    
    const handleInvite = async () => {
        if (!selectedEmails.length || !selectedWorkspace) {
            toast.error('Please select at least one email and ensure a workspace is selected.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            return;
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.accessToken;
    
        if (!token) {
            toast.error('No access token found. Please log in again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            return;
        }
    
        const selectedUsers = selectedEmails.map((email) => {
            const userFromDB = allUsers.find((user) => user.email === email);
            return userFromDB
                ? {
                    id: userFromDB._id,
                    projects: userFromDB.projects.length > 0 ? userFromDB.projects : [],
                    profilePicture: userFromDB.profilePicture || {},
                    role: userFromDB.role || 'N/A',
                }
                : null;
        }).filter((user) => user !== null);
    
        if (selectedUsers.length === 0) {
            toast.error('No valid users found for the selected emails.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            return;
        }
    
        setLoading(true);
    
        try {
            // Make sure this endpoint is correct and matches your backend API structure
            const response = await axios.post('http://localhost:5000/api/users/invite', {
                userIds: selectedUsers.map(user => user.id),
                projects: selectedUsers.map(user => user.projects).flat(),
                roles: selectedUsers.map(user => user.role),
                profilePictures: selectedUsers.map(user => user.profilePicture),
                workspaceId: selectedWorkspace._id,  // Pass workspace ID
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            // No need to check for `response.ok`, as Axios throws an error for non-2xx status codes
            if (response.status === 200) { // Assuming 200 means success in your backend
                toast.success('Invitations sent successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                });
    
                // Fetch users again to refresh the user list
                fetchUsers();
                toggleModal();
            }
        } catch (error) {
            console.error('Error inviting users:', error.message);
            toast.error(`An error occurred: ${error.message}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleRoleChange = async (newRole, userEmail) => {
        try {
            const user = allUsers.find((u) => u.email === userEmail);

            if (!user) {
                throw new Error(`User with email ${userEmail} not found`);
            }

            const response = await fetch(`http://localhost:5000/api/users/${user._id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Role change successful:', updatedUser);

                setInvitedUsers((prevUsers) => {
                    const updatedUsers = prevUsers.map((user) =>
                        user.email === userEmail ? { ...user, role: newRole } : user
                    );                  
                    localStorage.setItem('invitedUsers', JSON.stringify(updatedUsers));
                    return updatedUsers;
                });

                alert(`Role changed to ${newRole} and email notification sent to ${userEmail}`);
            } else {
                const errorResponse = await response.json();
                console.error('Error updating role:', errorResponse);
                alert(`Error updating role: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error updating role:', error.message);
            alert(`An error occurred: ${error.message}`);
        }
    };

    const handleRemoveUser = async (userEmail) => {
        const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    
        if (!token) {
            alert('Access token is missing. Please log in again.');
            return;
        }
    
        const invitedMember = invitedUsers.find((u) => u.email === userEmail);
        if (!invitedMember) {
            alert('Invited member not found in the list.');
            return;
        }
    
        try {
            // Send the actual user ID for deletion
            const response = await fetch(`http://localhost:5000/api/users/invited/${invitedMember.userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }

        setInvitedUsers((prev) => prev.filter((u) => u.email !== userEmail));
        toast.success(`Successfully removed user: ${userEmail}`);
    } catch (error) {
        console.error('Error in handleRemoveUser:', error.message);
        toast.error(`An error occurred: ${error.message}`);
    }
};

    
    

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const roleFilteredUsers = selectedRole 
            ? allUsers.filter((user) => user.role.toLowerCase() === selectedRole.toLowerCase()) 
            : allUsers;

        const filtered = roleFilteredUsers.filter(
            (user) =>
                user.email.toLowerCase().includes(searchQuery) ||
                user.firstName.toLowerCase().includes(searchQuery) ||
                user.lastName.toLowerCase().includes(searchQuery)
        );
        setFilteredUsers(filtered);
    };

    const handleEmailSelect = (email) => {
        setSelectedEmails((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };

    const [clickedEmail, setClickedEmail] = useState(null);
    const handleAvatarClick = (email) => {
        setClickedEmail(email === clickedEmail ? null : email); // Toggle email display
    };

    const toggleProfileModal = (user) => {
        setSelectedProfileUser(user);
        setProfileModalVisible(true); // Show the Modal_Profile modal
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="w-full flex justify-between items-center mb-16">
                <div className="relative">
                    <h1 className="text-2xl font-medium text-gray-800 hidden md:block">
                        People 
                    </h1>
                </div>
                <AdminNavbar
                    isAccountDropdownOpen={isAccountDropdownOpen}
                    toggleAccountDropdown={toggleAccountDropdown}
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mb-6 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                    <p className="text-lg sm:text-2xl font-semibold text-gray-700">Invited Members</p>
                    <button
                        className="bg-red-800 text-white px-3 py-1 rounded flex items-center hover:bg-red-900 sm:px-4 sm:py-2"
                        onClick={toggleModal}
                    >
                        <i className="fas fa-user-plus mr-1 sm:mr-2"></i>
                        Add Members
                    </button>
                </div>
            </div>

            <div className="relative">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-100">
    <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Role</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Project</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {invitedUsers.length > 0 ? (
        invitedUsers.map((user, index) => (
            <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center relative">
                    <div className="relative">
                        <img
                            src={user.profilePicture?.url || user.profilePicture || User}
                            alt="Profile"
                            className="w-12 h-12 rounded-full mr-4 object-cover cursor-pointer"
                            onClick={() => handleAvatarClick(user.email)}
                        />
                        {clickedEmail === user.email && (
                            <div className="absolute left-0 top-full mt-2 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-900 text-sm z-50">
                                {user.email}
                            </div>
                        )}
                                      </div>
                    <div className="hidden sm:block">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                                        <div className="flex items-center">
                                            {user.role}
                                            <FontAwesomeIcon
                                                icon={isRoleDropdownOpen[user.email] ? faChevronDown : faChevronRight}
                                                className="ml-2 cursor-pointer"
                                                onClick={() => toggleRoleDropdown(user.email)}
                                            />
                                        </div>
                                        {isRoleDropdownOpen[user.email] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 role-dropdown">
                                <ul className="py-1">
                                    {['Guest', 'members', 'admin', 'superadmin'].map((role) => (
                                        <li
                                            key={role}
                                            className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRoleChange(role.toLowerCase(), user.email)}
                                        >
                                            {role}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        </td>
                
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative hidden sm:table-cell">
                    <div className="flex items-center">
                        {Array.isArray(user.project) && user.project.length > 0 
                            ? user.project[0].projectName
                            : 'No Project Assigned'}

                        {Array.isArray(user.project) && user.project.length > 1 && (
                            <FontAwesomeIcon
                                icon={isProjectDropdownOpen[user.email] ? faChevronDown : faChevronRight}
                                className="ml-2 cursor-pointer"
                                onClick={() => toggleProjectDropdown(user.email)}
                            />
                        )}
                    </div>

    {/* Dropdown for all projects */}
    {isProjectDropdownOpen[user.email] && Array.isArray(user.project) && user.project.length > 1 && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <ul>
                {user.project.map((project) => (
                    <li 
                        key={project._id} 
                        className="py-2 cursor-pointer hover:bg-gray-100 text-center"
                        onClick={() => console.log('Selected project:', project.projectName, 'for', user.email)}
                    >
                        {project.projectName}
                    </li>
                ))}
            </ul>
        </div>
    )}
</td>



<td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
    <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        onClick={() => handleRemoveUser(user.email)}
    >
        Remove
    </button>

    <button
        className="text-gray-600 hover:text-gray-900 ml-2 sm:ml-10 sm:block md:hidden" // Hidden on medium screens and larger
        onClick={() => toggleProfileModal(user)}
    >
        <FontAwesomeIcon icon={faEllipsisV} />
    </button>
</td>

                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No invited users found.
                    </td>
                </tr>
            )}
        </tbody>
    </table>
</div>

{profileModalVisible && selectedProfileUser && (
                <Modal_Profile user={selectedProfileUser} onClose={() => setProfileModalVisible(false)} />
            )}




            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
                    <div className="relative bg-white w-full max-w-sm rounded-lg p-4 sm:p-5 lg:p-6 z-60 mt-21">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">Add Members</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={toggleModal}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start mb-4">
                            <input
                                type="text"
                                placeholder="Search email"
                                className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start mb-4">
                            <select
                                className="p-2 sm:p-3 border rounded-lg text-sm sm:text-base mb-2 sm:mb-0 sm:mr-4 w-full"
                                onChange={(e) => handleRoleFilter(e.target.value)}
                                value={selectedRole}
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="guest">Guest</option>
                            </select>

                            <button
                                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 text-base sm:px-5 sm:py-3 w-full max-w-30"
                                onClick={handleInvite}
                                disabled={loading}
                            >
                                {loading ? 'Inviting ...' : 'Invite'}
                            </button>
                            <ToastContainer />
                        </div>

                        <div className="mt-4 overflow-y-auto max-h-80">
                            {filteredUsers.length > 0 ? (
                                <ul>
                                    {filteredUsers.map((user, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center justify-between p-2 border-b text-xs sm:text-sm ${selectedEmails.includes(user.email) ? 'bg-gray-200' : ''}`}
                                            onClick={() => handleEmailSelect(user.email)}
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={user.profilePicture?.url || user.profilePicture || User}
                                                    alt="Profile"
                                                    className="w-6 h-6 rounded-full mr-2 object-cover"
                                                />
                                                <div>
                                                    <div className="text-xs sm:text-sm text-gray-800">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-600">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">{user.role}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 text-xs sm:text-sm">No users found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default People;