import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Freelance from "./components/Freelance";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Acheivements from "./components/Acheivements";
import Gallery from "./components/Gallery";
import ChatBot from "./components/Chatbot";
import GameZone from "./components/Games/Gamezone";
import ExamPage from "./components/Exam/ExamPage";
import TakeExam from "./components/TakeExam";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ExamPortalWorkflow from "./components/process_flow.component";

import StudentRegister from "./components/StudentRegister";
import StudentDashboard from "./components/StudentDashboard";
import Paywall from "./components/Paywall";
import MyResults from "./components/MyResults";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function AppWrapper() {
  const location = useLocation();

  return (
    <div>
      <div className="app-wrapper">
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dashboard" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/exampage" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-login" element={<Login />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/process-flow" element={<ExamPortalWorkflow/>} />
            <Route path="/student-register" element={<StudentRegister />} />
            <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/paywall" element={<ProtectedRoute><Paywall /></ProtectedRoute>} />
            <Route path="/my-results" element={<ProtectedRoute><MyResults /></ProtectedRoute>} />
            <Route path="/exam/:id" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
        {/* ChatBot floating button */}
        <ChatBot />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}
