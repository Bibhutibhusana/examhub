import React from "react";
import "../../css/Exams/odiamedium.css";

const SubjectSelector = ({ onBack, onSelectSubject, selectedClass }) => {
  const getSubjectsForClass = (className) => {
    const baseSubjects = [
      { label: "Mathematics", value: "mathematics" },
      { label: "Science", value: "science" },
      { label: "Social Science", value: "socialscience" },
      { label: "English", value: "english" },
      { label: "Odia", value: "odia" },
      
    ];

    if(className == 'plus2first' || className == 'plus2second'){
      return [
        { label: "MIL", value: "MIL" },
      { label: "English", value: "english" },
      { label: "Economics", value: "economics" },
      { label: "Political Science", value: "poscience" },
      { label: "History", value: "history" },
      { label: "Education", value: "education" },
      { label: "Odia(Optional)", value: "odia(o)" },
      { label: "Sociology", value: "sociology" },
      { label: "Logic", value: "logic" },
      { label: "", value: "" },
      { label: "", value: "" },
        { label: "", value: "" }
      ];
    }
    else if (className === "class10"){
      return [
        { label: "Arithmatics", value: "arithmatics" },
      { label: "Geometry", value: "geometry" },
      { label: "Physical Science", value: "pscience" },
      { label: "Life Science", value: "lscience" },
      { label: "History", value: "history" },
      { label: "Political Science", value: "politicalscience" },
      { label: "Economy", value: "economy" },
      { label: "Geography", value: "geography" },
      { label: "English", value: "english" },
      { label: "Odia", value: "odia" },
        { label: "Sanskrit", value: "sanskrit" }
      ];
    }
    if(className === "class9" || className === "class8" || className === "NMMS" || className === "OAV" || className === "PMST") {
      return [
        ...baseSubjects,
        { label: "Sanskrit", value: "sanskrit" }
      ];
    } else {
      // For classes 3-7
      return baseSubjects;
    }
  };

  const subjects = getSubjectsForClass(selectedClass);

  const handleSelectSubject = (subject) => {
    onSelectSubject(subject);
  };

  return (
    <div className="odia-medium-container">
      <h2 className="odia-medium-title">Select Subject for {selectedClass}</h2>
      <div className="odia-medium-grid">
        {subjects.map((subject, index) => (
          <button
            key={index}
            className="odia-medium-button"
            onClick={() => handleSelectSubject(subject.value)}
          >
            {subject.label}
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

export default SubjectSelector;
