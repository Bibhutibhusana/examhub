import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/Exams/exampage.css";
import fiveRupeeCoin from "../../assets/images/5_rupee_coin.jpg";
import fiveRupeeNote from "../../assets/images/5_rupee_note.jpg";
import indiaFiveRupeeNote from "../../assets/images/India_five_rupees_note.png";

import OdiaMediumPage from "./OdiaMediumPage";
import StudentRegistration from "./StudentRegistration";
import ExamModal from "./ExamModal";
import ResultSummary from "./ResultSummary";
import SubjectSelector from "./SubjectSelector";
import ExamSetSelector from "./ExamSetSelector";
import ExamTypeSelector from "./ExamTypeSelector";
import ConfirmationModal from "./ConfirmationModal";
import SOPModal from "./SOPModal";
import ConsentModal from "./ConsentModal";
import ExamReview from "./ExamReview";
import Login from "../Login";
import UpcomingExamsBanner from "../UpcomingExamsBanner";

const ExamPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, userData, freeExamsRemaining, isPremium } = useAuth();
  const images = [fiveRupeeCoin, fiveRupeeNote, indiaFiveRupeeNote];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOdiaMedium, setShowOdiaMedium] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [student, setStudent] = useState(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examQuestions, setExamQuestions] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSOP, setShowSOP] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [upcomingExams, setUpcomingExams] = useState([]);

  // Authentication and freemium checks
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (freeExamsRemaining <= 0 && !isPremium) {
        navigate('/paywall');
      }
    }
  }, [authLoading, isAuthenticated, freeExamsRemaining, isPremium, navigate]);

  // Fetch upcoming exams
  useEffect(() => {
    const fetchUpcomingExams = async () => {
      try {
        const examsQuery = query(
          collection(db, 'exams'),
          where('date', '>', new Date())
        );
        const examsSnapshot = await getDocs(examsQuery);
        const exams = [];
        examsSnapshot.forEach((doc) => {
          exams.push({ id: doc.id, ...doc.data() });
        });
        // Sort by date and take the next upcoming exam
        exams.sort((a, b) => a.date.toDate() - b.date.toDate());
        setUpcomingExams(exams.slice(0, 1)); // Only show the next upcoming exam
      } catch (error) {
        console.error('Error fetching upcoming exams:', error);
      }
    };

    if (isAuthenticated) {
      fetchUpcomingExams();
    }
  }, [isAuthenticated]);

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleStartExam = (className) => {
    setSelectedClass(className);
    setShowOdiaMedium(false);
    // For all classes, show subject selector
    setSelectedSubject(null);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedSet(null);
    setSelectedExamType(null);
  };

  const handleSetSelect = (set) => {
    setSelectedSet(set);
    setSelectedExamType(null);
  };

  const handleExamTypeSelect = (examType) => {
    setSelectedExamType(examType);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setShowSOP(true);
  };

  const handleSOPAccept = () => {
    setShowSOP(false);
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    // Proceed to student registration or exam
    if (isAuthenticated) {
      const studentFromAuth = {
        id: userData?.uid,
        name: userData?.name || userData?.email || 'Student',
        address: userData?.address || '',
        phone: userData?.phone || '',
        school: userData?.school || '',
        class: selectedClass,
        registeredAt: new Date()
      };
      setStudent(studentFromAuth);
      setShowExamModal(true);
    } else {
      // Show student registration
    }
  };

  const handleRegister = (studentData) => {
    setStudent(studentData);
    setShowExamModal(true);
  };

  const handleExamComplete = (score, answers, questions) => {
    setFinalScore(score);
    setTotalQuestions(questions.length);
    setExamAnswers(answers);
    setExamQuestions(questions);
    setShowExamModal(false);
    setExamCompleted(true);
  };

  const handleBackToMain = () => {
    setShowOdiaMedium(false);
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedSet(null);
    setSelectedExamType(null);
    setStudent(null);
    setShowExamModal(false);
    setExamCompleted(false);
    setFinalScore(0);
    setTotalQuestions(0);
    setShowConfirmation(false);
    setShowSOP(false);
    setShowConsent(false);
  };

  const handleBackFromSubject = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedSet(null);
    setSelectedExamType(null);
  };

  const handleBackFromSet = () => {
    setSelectedSet(null);
    setSelectedExamType(null);
  };

  const handleBackFromExamType = () => {
    setSelectedExamType(null);
    setShowConfirmation(false);
  };

  const handleBackFromConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleBackFromSOP = () => {
    setShowSOP(false);
  };

  const handleBackFromConsent = () => {
    setShowConsent(false);
  };

  if (showExamModal) {
    return (
      <ExamModal
        student={student}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedSet={selectedSet}
        selectedExamType={selectedExamType}
        onClose={() => setShowExamModal(false)}
        onComplete={handleExamComplete}
      />
    );
  }

  return (
    <div className="exam-dashboard">


      {/* Dynamic Content Area - Changes based on state */}
      <div className="exam-content">
        {showReview ? (
          <ExamReview
            student={student}
            questions={examQuestions}
            answers={examAnswers}
            score={finalScore}
            onClose={() => setShowReview(false)}
          />
        ) : examCompleted ? (
          <div className="content-section">
            <ResultSummary
              score={finalScore}
              totalQuestions={totalQuestions}
              student={student}
              answers={examAnswers}
              questions={examQuestions}
            />
            <div className="result-actions">
              <button onClick={() => setShowReview(true)} className="review-btn">
                Review Answers
              </button>
              <button onClick={handleBackToMain} className="back-to-main-btn">
                Back to Main
              </button>
            </div>
          </div>
        ) : showExamModal ? (
          <ExamModal
            student={student}
            selectedClass={selectedClass}
            selectedSubject={selectedSubject}
            selectedSet={selectedSet}
            selectedExamType={selectedExamType}
            onClose={() => setShowExamModal(false)}
            onComplete={handleExamComplete}
          />
        ) : selectedClass && selectedSubject && selectedSet && selectedExamType && !student ? (
          <div className="content-section">
            {isAuthenticated ? (
              // Authenticated user: create student from userData and proceed
              (() => {
                const studentFromAuth = {
                  id: userData?.uid,
                  name: userData?.name || userData?.email || 'Student',
                  address: userData?.address || '',
                  phone: userData?.phone || '',
                  school: userData?.school || '',
                  class: selectedClass,
                  registeredAt: new Date()
                };
                setStudent(studentFromAuth);
                setShowExamModal(true);
                return null; // Don't render anything, just set state
              })()
            ) : (
              <StudentRegistration
                onRegister={handleRegister}
                selectedClass={selectedClass}
                selectedSubject={selectedSubject}
              />
            )}
            <button onClick={() => setSelectedExamType(null)} className="back-btn">
              Back
            </button>
          </div>
        ) : selectedClass && selectedSubject && selectedSet && !selectedExamType ? (
          <div className="content-section">
            {/* Skip exam type selection for class10 - politicalscience - setwise */}
            {selectedClass === 'class10' && selectedSubject === 'politicalscience' && selectedSet === 'setwise' ? (
              (() => {
                setSelectedExamType('default');
                setShowConfirmation(true);
                return null;
              })()
            ) : (
              <ExamTypeSelector
                onBack={handleBackFromSet}
                onSelect={handleExamTypeSelect}
                selectedClass={selectedClass}
                selectedSubject={selectedSubject}
                selectedSet={selectedSet}
              />
            )}
          </div>
        ) : selectedClass && selectedSubject && !selectedSet ? (
          <div className="content-section">
            <ExamSetSelector
              onBack={() => setSelectedSubject(null)}
              onSelectSet={handleSetSelect}
              selectedClass={selectedClass}
              selectedSubject={selectedSubject}
            />
          </div>
        ) : selectedClass && !selectedSubject ? (
          <div className="content-section">
            <SubjectSelector
              onBack={handleBackFromSubject}
              onSelectSubject={handleSubjectSelect}
              selectedClass={selectedClass}
            />
          </div>
        ) : showOdiaMedium ? (
          <div className="content-section">
            <OdiaMediumPage
              onBack={() => setShowOdiaMedium(false)}
              onStartExam={handleStartExam}
            />
          </div>
        ) : (
          <>
            {/* Upcoming Exams Banner */}
            <UpcomingExamsBanner
              exams={upcomingExams}
              onExamClick={(examId, isAvailable) => {
                if (isAvailable) {
                  // Navigate to exam or handle exam start
                  console.log('Starting exam:', examId);
                } else {
                  // Already handled by the banner component
                }
              }}
            />

            {/* Photo/Banner Area with Carousel */}
            <div className="exam-banner">
              <button className="carousel-button" onClick={prevImage}>{"<"}</button>
              <img
                src={images[currentIndex]}
                alt={`4 rupees note ${currentIndex + 1}`}
                className="carousel-image"
              />
              <button className="carousel-button" onClick={nextImage}>{">"}</button>
            </div>

            {/* Main Content Grid */}
            <div className="exam-grid">
              <div className="exam-box large" onClick={() => setShowOdiaMedium(true)} style={{ cursor: "pointer" }}>
                Odia Medium
              </div>
              <div className="exam-box large">English Medium</div>
              <div className="exam-box medium">Notice</div>
              <div className="exam-box medium">Test</div>
              <div className="exam-box medium">Current Affairs</div>
              <div className="exam-box medium">Traditional GK</div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showConfirmation && (
        <ConfirmationModal
          selectedClass={selectedClass}
          selectedSubject={selectedSubject}
          selectedSet={selectedSet}
          selectedExamType={selectedExamType}
          onConfirm={handleConfirm}
          onBack={handleBackFromConfirmation}
        />
      )}

      {showSOP && (
        <SOPModal
          onAccept={handleSOPAccept}
          onBack={handleBackFromSOP}
        />
      )}

      {showConsent && (
        <ConsentModal
          onAccept={handleConsentAccept}
          onBack={handleBackFromConsent}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowLoginModal(false)}>×</button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
