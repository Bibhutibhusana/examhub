import React from "react";
import "../../css/Exams/odiamedium.css";

const ExamModeSelector = ({ onBack, onSelectMode }) => {
  const modes = [
    { label: "Subject Wise", value: "subjectwise" },
    { label: "Set Wise", value: "setwise" },
  ];

  const handleSelectMode = (mode) => {
    onSelectMode(mode);
  };

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">Select Exam Mode</h2>
      <div className="odia-medium-grid">
        {modes.map((mode, index) => (
          <button
            key={index}
            className="odia-medium-button"
            onClick={() => handleSelectMode(mode.value)}
          >
            {mode.label}
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

export default ExamModeSelector;
