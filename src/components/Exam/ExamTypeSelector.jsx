import React from 'react';
import "../../css/Exams/odiamedium.css";

const ExamTypeSelector = ({ onBack, onSelect, selectedClass, selectedSubject, selectedSet }) => {
  const examTypes = ['midterm', 'final', 'quiz'];

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">Select Exam Type for {selectedClass} - {selectedSubject} - {selectedSet}</h2>
      <div className="odia-medium-grid">
        {examTypes.map((type, index) => (
          <button
            key={index}
            className="odia-medium-button"
            onClick={() => onSelect(type.toLowerCase())}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
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

export default ExamTypeSelector;
