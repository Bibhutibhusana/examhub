import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const StudentRegistration = ({ onRegister, selectedClass }) => {
  const { currentUser, userData } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAddress(userData.address || '');
      setPhone(userData.phone || '');
      setSchool(userData.school || '');
    }
  }, [userData]);

  const handleRegister = async () => {
    if (name && address && phone && school) {
      setLoading(true);
      try {
        // Update user document in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          name,
          address,
          phone,
          school,
          updatedAt: new Date()
        });

        const studentData = {
          id: currentUser.uid,
          name,
          address,
          phone,
          school,
          class: selectedClass,
          registeredAt: new Date()
        };
        onRegister(studentData);
      } catch (error) {
        console.error('Error updating profile:', error);
        let errorMessage = 'Profile update failed. Please try again.';
        if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied. Please check Firebase security rules.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Service unavailable. Please check your internet connection.';
        } else if (error.code === 'invalid-argument') {
          errorMessage = 'Invalid data provided. Please check your input.';
        }
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="student-registration">
      <h3>Student Registration</h3>

      {/* Important Instructions */}
      <div className="exam-instructions">
        <div className="instruction-alert">
          <h4>⚠️ Important Instructions</h4>
          <ul>
            <li>📝 Fill all details accurately as they will be recorded</li>
            <li>🚫 Do not switch tabs or minimize the window during the exam</li>
            <li>⏰ Each question has a 1-minute time limit</li>
            <li>🔄 You cannot go back to previous questions</li>
            <li>📊 Your progress will be tracked throughout the exam</li>
            <li>💾 Your answers are automatically saved</li>
            <li>❌ Switching screens may result in exam termination</li>
            <li>📱 Ensure stable internet connection</li>
          </ul>
        </div>
      </div>

      <form className="registration-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="School Name"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="register-btn"
        >
          {loading ? 'Registering...' : 'Register and Start Exam'}
        </button>
      </form>
    </div>
  );
};

export default StudentRegistration;
