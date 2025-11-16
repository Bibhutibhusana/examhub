import React from 'react';
import '../../css/Exams/modals.css';

const ConfirmationModal = ({ selectedClass, selectedSubject, selectedSet, selectedExamType, onConfirm, onBack }) => {
  return (
    <div className="modal-overlay" onClick={onBack}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="confirmation-icon">📋</div>
          <h2>Confirm Your Exam Selection</h2>
          <p className="confirmation-subtitle">Please review your choices before proceeding</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-item">
            <span className="detail-label">Class:</span>
            <span className="detail-value">{selectedClass}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Subject:</span>
            <span className="detail-value">{selectedSubject}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Set:</span>
            <span className="detail-value">{selectedSet}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Exam Type:</span>
            <span className="detail-value">{selectedExamType}</span>
          </div>
        </div>

        <div className="confirmation-warning">
          <div className="warning-icon">⚠️</div>
          <p>Once you proceed, you cannot change your selection. Make sure all details are correct.</p>
        </div>

        <div className="confirmation-buttons">
          <button className="back-btn" onClick={onBack}>
            <span>←</span> Back
          </button>
          <button className="proceed-btn" onClick={onConfirm}>
            Start Exam <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
