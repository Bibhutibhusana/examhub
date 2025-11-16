import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import '../../css/Exams/exammodal.css';

const ExamModal = ({ selectedClass, selectedSubject, selectedSet, selectedExamType, onClose, onComplete, student }) => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null); // Total exam time in seconds, null until questions load
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // Check if selected class is supported
    if (!(selectedClass === "class10" || selectedClass === "plus2first" || selectedClass === "plus2second")) {
      setShowComingSoon(true);
      return;
    }

    // Load questions based on selectedClass, selectedSubject, selectedSet, and selectedExamType
    const loadQuestions = async () => {
      try {
        let module;
        if ((selectedClass === "plus2second" || selectedClass === "class10" || selectedClass === "plus2first") && selectedSubject && selectedSet && selectedExamType) {
          // Load questions for plus2second with full path structure
          module = await import(`../../assets/exams/${selectedClass}/${selectedSubject}/${selectedSet}/${selectedExamType}/questions.json`);
        }  else {
          // Load default questions for other classes
          // module = await import(`../../assets/exams/${selectedClass}/questions.json`);
        }
        const loadedQuestions = module.default;
        setQuestions(loadedQuestions);
        // Set total exam time: 1 minute per question
        setTimeLeft(loadedQuestions.length * 60);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to class10 maths questions
        setShowComingSoon(true);
      }
    };
    loadQuestions();
  }, [selectedClass, selectedSubject, selectedSet, selectedExamType]);

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questions.length > 0 && timeLeft === 0 && !isSubmitted) {
      handleAutoSubmit();
    }
  }, [timeLeft, isSubmitted, questions.length]);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      alert(`You must answer all questions before submitting. You have answered ${answeredCount} out of ${questions.length} questions.`);
      return;
    }

    setIsSubmitted(true);
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) calculatedScore++;
    });
    setScore(calculatedScore);

    try {
      await addDoc(collection(db, 'examResults'), {
        studentId: currentUser.uid,
        class: selectedClass,
        subject: selectedSubject,
        answers,
        questions, // Store full questions for review
        score: calculatedScore,
        totalQuestions: questions.length,
        submittedAt: new Date()
      });

      // Increment exam count for the user
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        examCount: increment(1)
      });
    } catch (error) {
      console.error('Error saving results:', error);
    }

    setTimeout(() => onComplete(calculatedScore, answers, questions), 2000);
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "Loading...";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    const marked = markedForReview.size;
    return { answered, marked, total: questions.length };
  };

  if (showComingSoon) {
    return (
      <div className="exam-modal-overlay">
        <div className="exam-modal coming-soon-modal">
          <div className="coming-soon-content">
            <h2>Exams Coming Soon!</h2>
            <p>We are currently preparing exams for {selectedClass}. Stay tuned for updates!</p>
            <button onClick={onClose} className="close-coming-soon-btn">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div>Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = getProgress();

  return (
    <div className="exam-modal-overlay">
      <div className="exam-modal">
        {/* Question Navigation Panel */}
        <div className="question-nav-panel">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-nav-btn ${
                answers[index] ? 'answered' : 'unanswered'
              } ${currentQuestionIndex === index ? 'current' : ''}`}
              onClick={() => handleQuestionJump(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="exam-header">
          <h2>Exam: {selectedClass} {selectedSubject && `- ${selectedSubject}`}</h2>
          <div className="student-info">Student: {student?.name || 'Student'}</div>
          <div className="timer">Time Left: {formatTime(timeLeft)}</div>
        </div>

        <div className="progress-bar">
          <div className="progress-stats">
            Answered: {progress.answered} | Marked: {progress.marked} | Total: {progress.total}
          </div>
          <div className="progress-fill" style={{ width: `${(progress.answered / progress.total) * 100}%` }}></div>
        </div>

        <div className="question-container">
          <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
          <p className="question-text">{currentQuestion.question}</p>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option" htmlFor={`option-${currentQuestionIndex}-${index}`}>
                <input
                  id={`option-${currentQuestionIndex}-${index}`}
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  checked={answers[currentQuestionIndex] === option}
                  onChange={() => handleAnswer(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="exam-controls">
          <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</button>
          <button onClick={handleMarkForReview} className={markedForReview.has(currentQuestionIndex) ? 'marked' : ''}>
            Mark for Review
          </button>
          <button onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>

        {isSubmitted && (
          <div className="submission-message">
            <h3>Submitting your exam...</h3>
            <p>Your score: {score} / {questions.length}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamModal;
