import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import '../css/Navbar.css';
import examLogo from "../assets/exams/logo/logo.webp";

export default function Navbar() {
  const { isAuthenticated, currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('studentUser');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDashboardClick = () => {
    if (userData?.role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <nav className="exam-nav">
      <div className="logo">
        <img src={examLogo} alt="Exam Logo" className="exam-logo" />
      </div>
      <div className="nav-links">
        {!isAuthenticated && (
          <button className="nav-button" onClick={() => navigate('/')}>Home</button>
        )}

        {isAuthenticated ? (
          <>
            <button className="nav-button" onClick={handleDashboardClick}>
              {userData?.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}
            </button>
            <button className="nav-button logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-button" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-button signup-btn" onClick={() => navigate('/student-register')}>
              Sign Up
            </button>
          </>
        )}

        {isAuthenticated && userData?.role === 'STUDENT' && (
          <div className="notification">
            <span className="notification-count">
              {Math.max(0, 10 - (userData?.examCount || 0))}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="notification-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        )}
      </div>
    </nav>
  );
}
