import React from 'react';
import '../../css/Exams/modals.css';

const ConsentModal = ({ onAccept, onBack }) => {
  return (
    <div className="modal-overlay" onClick={onBack}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Consent to Proceed</h2>
        <p>By proceeding, you agree to abide by the exam rules and instructions.</p>
        <p>Do you consent to start the exam?</p>
        <div className="modal-buttons">
          <button onClick={onBack}>Back</button>
          <button onClick={onAccept}>Yes, Start Exam</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
