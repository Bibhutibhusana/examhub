import React from 'react';
import '../../css/Exams/modals.css';

const SOPModal = ({ onAccept, onBack }) => {
  return (
    <div className="modal-overlay" onClick={onBack}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Exam Rules and Instructions</h2>
        <div className="sop-content">
          <p>1. Read all questions carefully before answering.</p>
          <p>2. You have a limited time to complete the exam.</p>
          <p>3. Do not refresh the page or navigate away during the exam.</p>
          <p>4. Ensure a stable internet connection.</p>
          <p>5. Any form of cheating will result in disqualification.</p>
          <p>6. Click submit only when you are sure of your answers.</p>
        </div>
        <div className="modal-buttons">
          <button onClick={onBack}>Back</button>
          <button onClick={onAccept}>I Accept</button>
        </div>
      </div>
    </div>
  );
};

export default SOPModal;
