  import React, { useState } from 'react';
import { Clock, Trophy, BookOpen, ChevronRight, X } from 'lucide-react';

const UpcomingExamsBanner = ({ exams, onExamClick }) => {
  const [showPopup, setShowPopup] = useState(false);

  if (!exams || exams.length === 0) {
    return null;
  }

  // Show only the next upcoming exam
  const nextExam = exams[0];
  const examDate = nextExam.date?.toDate ? nextExam.date.toDate() : new Date(nextExam.date);
  const isAvailable = new Date() >= examDate;

  const handleClick = () => {
    if (isAvailable) {
      onExamClick(nextExam.id, isAvailable);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <>
      <div className="upcoming-exams-banner">
        <div className="banner-content">
          <div className="banner-header">
            <div className="banner-icon">
              <Trophy size={24} />
            </div>
            <div className="banner-title">
              <h3>Upcoming Exam</h3>
              <p>Don't miss out on this scheduled exam!</p>
            </div>
          </div>

          <div className="exam-details">
            <div className="exam-info">
              <h4>{nextExam.name}</h4>
              <div className="exam-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{examDate.toLocaleDateString()} at {nextExam.time}</span>
                </div>
                <div className="meta-item">
                  <BookOpen size={16} />
                  <span>{nextExam.questionsCount} Questions</span>
                </div>
              </div>
            </div>

            {nextExam.prizes && nextExam.prizes.length > 0 && (
              <div className="exam-prizes">
                <div className="prize-item">
                  <Trophy size={14} className="prize-icon" />
                  <span>{nextExam.prizes[0]}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleClick}
            className="banner-cta"
          >
            {isAvailable ? 'Take Exam Now' : 'View Details'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exam Not Available</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-gray-600 mb-6">
              <p>This exam is scheduled for:</p>
              <p className="font-medium mt-2">
                {examDate.toLocaleDateString()} at {nextExam.time}
              </p>
              <p className="mt-2">Please come back at the scheduled time to take the exam.</p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingExamsBanner;
