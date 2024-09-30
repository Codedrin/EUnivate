import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthProjectmanagement = ({ children }) => {
    const isSuperAdmin = !!localStorage.getItem('superadmin');

    // If the user is authenticated as Super Admin, render the children (ProjectManagement)
    if (isSuperAdmin) {
        return children;
    }

    // If not authenticated, redirect to the Super Admin login or dashboard page
    return <Navigate to="/superadmin/dashboard" />;
}

export default AuthProjectmanagement;
