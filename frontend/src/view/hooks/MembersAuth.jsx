import React from 'react';
import { Navigate } from 'react-router-dom';

const MemberAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" />;
  }

  if (user.role !== 'members') {
    // User is authenticated but not a member
    return <Navigate to="/login" />;
  }

  // User is authenticated and is a member
  return children;
};

export default MemberAuth;
