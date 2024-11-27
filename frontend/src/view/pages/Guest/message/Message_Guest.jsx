import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Message_Guest = ({ onInvitedUsersFetched, workspaceId }) => {
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user ? user.accessToken : null;

        if (!accessToken) {
          setError('Authentication required. Please log in.');
          return;
        }

        // Fetch all users
        const allUsersResponse = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Fetch invited users for the selected workspace
        if (workspaceId) {
          const invitedUsersResponse = await axios.get('http://localhost:5000/api/users/invited', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: { workspaceId: workspaceId }, // Pass workspace ID directly
          });

          const allUsers = allUsersResponse.data;
          const invitedUsersList = invitedUsersResponse.data.invitedUsers.map((invitedUser) => {
            const userFromDB = allUsers.find((user) => user.email === invitedUser.email);
            return userFromDB ? { ...invitedUser, ...userFromDB } : invitedUser;
          });

          setInvitedUsers(invitedUsersList);
          setCurrentUser(allUsers.find((u) => u._id === user._id));

          // Pass the invited users back to the parent component
          onInvitedUsersFetched(invitedUsersList);
        }
      } catch (error) {
        setError('Please invite people to see the members and ensure you select a workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onInvitedUsersFetched, workspaceId]);

  const totalMembers = invitedUsers.length;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-800">About</h2>
      </div>

      {/* Workspace Description */}
      <div className="bg-gray-100 p-4 rounded-md h-52 mt-4">
        <p className="text-gray-600 text-sm">Topic</p>
        <p className="text-sm mt-2">All about the workspace topic related only</p>
        <p className="text-gray-600 text-sm mt-5">Description</p>
        <p className="text-sm mt-2">
          In this channel, we can collaborate and communicate with fellow members.
        </p>
      </div>

      {/* Member Count and List */}
      <div className="mt-4 flex items-center">
        <p className="text-gray-800 text-sm font-semibold">Member</p>
        <div className="bg-orange-500 text-white text-sm font-bold ml-2 px-1 py-0.5 rounded-md">
          {totalMembers}
        </div>
      </div>

      {/* Display Current User */}
      {currentUser && (
        <div className="mt-4 flex items-center">
          <div className="relative">
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
            <img
              src={currentUser.profilePicture?.url || currentUser.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
              alt={currentUser.username || 'Profile Picture'}
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
          </div>
          <p className="ml-2 text-gray-800 text-sm font-semibold">{currentUser.username} (You)</p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Invited Members List */}
      <div className="mt-1 flex-grow overflow-y-auto">
        <p className="text-gray-500 text-sm mt-3">Invited Members - {invitedUsers.length}</p>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading users...</p>
        ) : (
          invitedUsers.map((user) => (
            <div key={user._id} className="flex items-center mt-3">
              <div className="relative">
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                <img
                  src={user.profilePicture?.url || user.profilePicture || 'https://www.imghost.net/ib/YgQep2KBICssXI1_1725211680.png'}
                  alt={user.username || 'Profile Picture'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="ml-2 text-gray-800 text-sm">{user.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Message_Guest;
