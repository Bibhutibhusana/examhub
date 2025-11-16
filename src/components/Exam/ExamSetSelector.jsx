import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "../../css/Exams/odiamedium.css";

const ExamSetSelector = ({ onBack, onSelectSet, selectedClass, selectedSubject, selectedMode, selectedMedium }) => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch exams for setwise OR when subjectwise and a subject is selected
    const shouldFetch = (selectedMode === 'setwise') || (selectedMode === 'subjectwise' && selectedSubject);
    if (!shouldFetch) {
      setExams([]);
      return;
    }

    const fetchExams = async () => {
      try {
        // Build query filters based on available selection
        const clauses = [];
        // exams may store class under 'selectedClass' or 'class' depending on how they were created
        // Try both by querying using 'selectedClass' first
        clauses.push(where('selectedClass', '==', selectedClass));
        if (selectedMedium) clauses.push(where('medium', '==', selectedMedium));
        if (selectedMode === 'subjectwise' && selectedSubject) clauses.push(where('subject', '==', selectedSubject));

        let q = query(collection(db, 'exams'), ...clauses);
        let querySnapshot = await getDocs(q);
        // If no results and 'class' field was used instead of 'selectedClass', try 'class'
        if (querySnapshot.empty) {
          const clauses2 = [];
          clauses2.push(where('class', '==', selectedClass));
          if (selectedMedium) clauses2.push(where('medium', '==', selectedMedium));
          if (selectedMode === 'subjectwise' && selectedSubject) clauses2.push(where('subject', '==', selectedSubject));
          q = query(collection(db, 'exams'), ...clauses2);
          querySnapshot = await getDocs(q);
        }

        const examsList = [];
        querySnapshot.forEach((doc) => examsList.push({ id: doc.id, ...doc.data() }));
        setExams(examsList);
      } catch (err) {
        console.error('Failed to fetch exams', err);
        setExams([]);
      }
    };

    fetchExams();
  }, [selectedMode, selectedClass, selectedSubject, selectedMedium]);

  const examSets = [
    { label: "Set Wise Exams", value: "setwise", isPaid: false },
    { label: "Previous Year Questions", value: "previousyear", isPaid: false },
    { label: "Practice Sets", value: "practice", isPaid: false },
    { label: "Paid Exams", value: "paid", isPaid: true },
  ];

  const handleSelectSet = (set) => {
    if (set.isPaid && !isPremium) {
      navigate('/paywall');
      return;
    }
    onSelectSet(set.value);
  };

  const handleSelectExam = (exam) => {
    onSelectSet(exam.id);
  };

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">
        {selectedMode === 'setwise' ? `Select Exam for ${selectedClass}` : `Select Exam Set for ${selectedClass} - ${selectedSubject}`}
      </h2>
      <div className="odia-medium-grid">
        {selectedMode === 'setwise' ? (
          exams.map((exam, index) => (
            <button
              key={index}
              className="odia-medium-button"
              onClick={() => handleSelectExam(exam)}
            >
              {exam.title || exam.name || `Exam ${index + 1}`}
            </button>
          ))
        ) : (
          examSets.map((set, index) => (
            <button
              key={index}
              className="odia-medium-button"
              onClick={() => handleSelectSet(set)}
            >
              {set.label}
              {set.isPaid && !isPremium && <span style={{ fontSize: '12px', display: 'block' }}>Premium Required</span>}
            </button>
          ))
        )}
      </div>
      <div className="odia-medium-back-section">
        <button
          onClick={onBack}
          className="odia-medium-back-button"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ExamSetSelector;
