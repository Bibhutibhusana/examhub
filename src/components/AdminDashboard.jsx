import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTable from './StudentTable';
import Statistics from './Statistics';
import ExamCreate from './ExamCreate';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [user, setUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
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
    if (!selectedClass || !selectedSubject || !selectedExamType || !selectedFile) {
      alert('Please select class, subject, exam type, and file.');
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const storagePath = `exams/${selectedClass}/${selectedSubject}/${selectedExamType}/${fileName}`;
      const storageRef = ref(storage, storagePath);

      // Upload file to Firebase Storage
      await uploadBytes(storageRef, selectedFile);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Add metadata to Firestore
      await addDoc(collection(db, 'examFiles'), {
        class: selectedClass,
        subject: selectedSubject,
        examType: selectedExamType,
        fileName: selectedFile.name,
        storagePath,
        downloadURL,
        uploadedAt: new Date(),
        uploadedBy: user?.uid || 'admin'
      });

      alert('Exam uploaded successfully!');
      setSelectedClass('');
      setSelectedSubject('');
      setSelectedExamType('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePaidExamUpload = async () => {
    if (!selectedClass || !selectedFile) {
      alert('Please select class and file.');
      return;
    }

    setUploading(true);
    try {
      // Read file content
      const fileContent = await selectedFile.text();

      // Determine next set number by checking localStorage keys
      const keys = Object.keys(localStorage);
      const classKeys = keys.filter(key => key.startsWith(`paidExam_${selectedClass}_set`));
      let nextSetNumber = 1;
      if (classKeys.length > 0) {
        const setNumbers = classKeys.map(key => {
          const match = key.match(/set(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        });
        nextSetNumber = Math.max(...setNumbers) + 1;
      }

      // Save to localStorage
      const key = `paidExam_${selectedClass}_set${nextSetNumber}`;
      localStorage.setItem(key, fileContent);

      alert(`Paid exam set${nextSetNumber}.json uploaded successfully!`);
      setSelectedClass('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading paid exam:', error);
      alert('Error uploading paid exam. Please try again.');
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
              <div className="manage-exams-container">
                <div className="exam-create-section">
                  <h3>Create New Exam</h3>
                  <ExamCreate />
                </div>
                <div className="exam-upload-section">
                  <h3>Upload Exam File</h3>
                  <div className="exam-upload-form">
                    <div className="form-group">
                      <label htmlFor="classSelect">Select Class:</label>
                      <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">Choose a class</option>
                        <option value="class10">Class 10</option>
                        <option value="class11">Class 11</option>
                        <option value="class12">Class 12</option>
                      </select>
                    </div>
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
                    <div className="form-group">
                      <label htmlFor="examTypeSelect">Select Exam Type:</label>
                      <select
                        id="examTypeSelect"
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                      >
                        <option value="">Choose exam type</option>
                        <option value="practice">Practice</option>
                        <option value="mock">Mock</option>
                        <option value="final">Final</option>
                        <option value="setwise">Setwise</option>
                        <option value="paid">Paid</option>
                        <option value="previousyear">Previous Year</option>
                        <option value="quiz">Quiz</option>
                        <option value="midterm">Midterm</option>
                      </select>
                    </div>
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
                      disabled={uploading || !selectedClass || !selectedSubject || !selectedExamType || !selectedFile}
                      className="upload-btn"
                    >
                      {uploading ? 'Uploading...' : 'Upload Exam'}
                    </button>
                  </div>
                </div>
                <div className="paid-exam-upload-section">
                  <h3>Upload Paid Exam</h3>
                  <div className="paid-exam-upload-form">
                    <div className="form-group">
                      <label htmlFor="paidClassSelect">Select Class:</label>
                      <select
                        id="paidClassSelect"
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
                        <option value="NMMS">NMMS</option>
                        <option value="NRTS">NRTS</option>
                        <option value="OAV">OAV</option>
                        <option value="plus2first">Plus 2 First Year</option>
                        <option value="plus2second">Plus 2 Second Year</option>
                        <option value="PMST">PMST</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="paidFileInput">Select JSON File:</label>
                      <input
                        type="file"
                        id="paidFileInput"
                        accept=".json"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                    <button
                      onClick={handlePaidExamUpload}
                      disabled={uploading || !selectedClass || !selectedFile}
                      className="upload-btn"
                    >
                      {uploading ? 'Uploading...' : 'Upload Paid Exam'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
