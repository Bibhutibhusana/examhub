import React from 'react';
import '../../css/Exams/classselector.css';

const ClassSelector = ({ onSelect }) => {
  const classes = ['Class 10', 'Class 11', 'Class 12'];

  return (
    <div className="exam-section">
      <h3>Select Class:</h3>
      {classes.map((cls) => (
        <button key={cls} onClick={() => onSelect(cls)}>
          {cls}
        </button>
      ))}
    </div>
  );
};

export default ClassSelector;
