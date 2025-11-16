import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../css/Exams/odiamedium.css";

const ExamSetSelector = ({ onBack, onSelectSet, selectedClass, selectedSubject }) => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">Select Exam Set for {selectedClass} - {selectedSubject}</h2>
      <div className="odia-medium-grid">
        {examSets.map((set, index) => (
          <button
            key={index}
            className="odia-medium-button"
            onClick={() => handleSelectSet(set)}
          >
            {set.label}
            {set.isPaid && !isPremium && <span style={{ fontSize: '12px', display: 'block' }}>Premium Required</span>}
          </button>
        ))}
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
