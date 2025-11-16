import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, redirectTo = "/login", requiredRoles = [] }) => {
  const { isAuthenticated, loading, userData } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access if requiredRoles is specified
  if (requiredRoles.length > 0 && userData?.role) {
    const userRole = userData.role.toUpperCase();
    const hasRequiredRole = requiredRoles.some(role => role.toUpperCase() === userRole);

    if (!hasRequiredRole) {
      // Redirect students to student dashboard, others to login
      if (userRole === 'STUDENT') {
        return <Navigate to="/student-dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
