import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTable from './StudentTable';
import Statistics from './Statistics';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [user, setUser] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Check if user has admin role
    if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'MANAGER') {
      alert('Access denied. Admin or Manager role required.');
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileUpload = async () => {
    const requiredFields = [selectedMedium, selectedClass, selectedExamType, selectedFile];
    if (selectedExamType === 'subjectwise') {
      requiredFields.push(selectedSubject);
    }
    if (requiredFields.some(field => !field)) {
      alert('Please fill all required fields.');
      return;
    }

    setUploading(true);
    try {
      // Read JSON file content
      const fileContent = await selectedFile.text();
      const questionsArray = JSON.parse(fileContent);

      // Add each question to 'questions' collection and collect IDs
      const questionIds = [];
      for (const question of questionsArray) {
        const docRef = await addDoc(collection(db, 'questions'), { ...question, active: true });
        questionIds.push(docRef.id);
      }

      // Add exam metadata to 'exam-questions' collection
      await addDoc(collection(db, 'exam-questions'), {
        medium: selectedMedium,
        class: selectedClass,
        examType: selectedExamType,
        subject: selectedExamType === 'subjectwise' ? selectedSubject : null,
        questionIds,
        active: true,
        uploadedAt: new Date(),
        uploadedBy: user?.uid || 'admin'
      });

      alert('Exam uploaded successfully!');
      setSelectedMedium('');
      setSelectedClass('');
      setSelectedExamType('');
      setSelectedSubject('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };



  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Student Data
          </button>
          <button
            className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button
            className={`tab-btn ${activeTab === 'manageExams' ? 'active' : ''}`}
            onClick={() => setActiveTab('manageExams')}
          >
            Manage Exams
          </button>
        </div>

        <div className="tab-content text-bold text-black">
          {activeTab === 'students' && (
            <div>
              <h2 className='text-dark'>Student Data Tab</h2>
              <StudentTable />
            </div>
          )}
          {activeTab === 'statistics' && (
            <div>
              <h2>Statistics Tab</h2>
              <Statistics />
            </div>
          )}
          {activeTab === 'manageExams' && (
            <div>
              <h2>Manage Exams</h2>
              <div className="exam-upload-form">
                <div className="form-group">
                  <label htmlFor="mediumSelect">Select Medium:</label>
                  <select
                    id="mediumSelect"
                    value={selectedMedium}
                    onChange={(e) => setSelectedMedium(e.target.value)}
                  >
                    <option value="">Choose medium</option>
                    <option value="odia">Odia Medium</option>
                    <option value="english">English Medium</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="classSelect">Select Class:</label>
                  <select
                    id="classSelect"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">Choose a class</option>
                    <option value="class3">Class 3</option>
                    <option value="class4">Class 4</option>
                    <option value="class5">Class 5</option>
                    <option value="class6">Class 6</option>
                    <option value="class7">Class 7</option>
                    <option value="class8">Class 8</option>
                    <option value="class9">Class 9</option>
                    <option value="class10">Class 10</option>
                    <option value="class11">Class 11</option>
                    <option value="class12">Class 12</option>
                    <option value="NMMS">NMMS</option>
                    <option value="NRTS">NRTS</option>
                    <option value="OAV">OAV</option>
                    <option value="plus2first">Plus 2 First Year</option>
                    <option value="plus2second">Plus 2 Second Year</option>
                    <option value="PMST">PMST</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="examTypeSelect">Select Exam Type:</label>
                  <select
                    id="examTypeSelect"
                    value={selectedExamType}
                    onChange={(e) => {
                      setSelectedExamType(e.target.value);
                      if (e.target.value !== 'subjectwise') {
                        setSelectedSubject('');
                      }
                    }}
                  >
                    <option value="">Choose exam type</option>
                    <option value="setwise">Set Wise</option>
                    <option value="subjectwise">Subject Wise</option>
                  </select>
                </div>
                {selectedExamType === 'subjectwise' && (
                  <div className="form-group">
                    <label htmlFor="subjectSelect">Select Subject:</label>
                    <select
                      id="subjectSelect"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Choose a subject</option>
                      <option value="english">English</option>
                      <option value="maths">Maths</option>
                      <option value="science">Science</option>
                      <option value="socialscience">Social Science</option>
                      <option value="geography">Geography</option>
                      <option value="history">History</option>
                      <option value="politicalscience">Political Science</option>
                      <option value="sanskrit">Sanskrit</option>
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="fileInput">Select JSON File:</label>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".json"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </div>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || !selectedMedium || !selectedClass || !selectedExamType || !selectedFile || (selectedExamType === 'subjectwise' && !selectedSubject)}
                  className="upload-btn"
                >
                  {uploading ? 'Uploading...' : 'Upload Exam'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
