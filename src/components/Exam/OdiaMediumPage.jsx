import React from "react";
import "../../css/Exams/odiamedium.css";

const OdiaMediumPage = ({ onBack, onStartExam }) => {
  const buttons = [
    { label: "ପଞ୍ଚମ", class: "class5" },
    { label: "ଷଷ୍ଠ", class: "class6" },
    { label: "ସପ୍ତମ", class: "class7" },
    { label: "ଅଷ୍ଟମ", class: "class8" },
    { label: "ନବମ", class: "class9" },
    { label: "ଦଶମ", class: "class10" },
    { label: "PMST", class: "PMST" },
    { label: "NRTS", class: "NRTS" },
    { label: "NMMS", class: "NMMS" },
    { label: "OAV ENTRANCE EXAM", class: "OAV" },
    { label: "+2 ପ୍ରଥମ ବର୍ଷ", class: "plus2first" },
    { label: "+2 ଦ୍ଵିତୀୟ ବର୍ଷ", class: "plus2second" },
  ];

  const handleStartExam = (selectedClass) => {
    if(selectedClass=='class10' || selectedClass=='plus2second'){
      onStartExam(selectedClass);
    }
  };

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">Odia Medium</h2>
      <div className="odia-medium-grid">
        {buttons.map((item, index) => (
          <button
            key={index}
            className="odia-medium-button"
            onClick={() => handleStartExam(item.class)}
          >
            {item.label}
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

export default OdiaMediumPage;
