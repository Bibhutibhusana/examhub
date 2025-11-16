import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';

const ResultSummary = ({ score, totalQuestions, student, answers, questions }) => {
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const { currentUser, userData, isPremium } = useAuth();
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  useEffect(() => {
    const saveExamResult = async () => {
      if (currentUser && userData) {
        try {
          const examResult = {
            score,
            totalQuestions,
            percentage: parseFloat(percentage),
            student,
            answers,
            timestamp: new Date(),
            subject: student.subject || 'General',
            class: student.class
          };

          await updateDoc(doc(db, 'users', currentUser.uid), {
            examHistory: arrayUnion(examResult)
          });
        } catch (error) {
          console.error('Error saving exam result:', error);
        }
      }
    };

    saveExamResult();
  }, [currentUser, userData, score, totalQuestions, percentage, student, answers]);

  const getAnswerStatus = (questionIndex) => {
    const userAnswer = answers[questionIndex];
    const correctAnswer = questions[questionIndex].answer;
    if (!userAnswer) return 'unanswered';
    return userAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const getStatusCounts = () => {
    let correct = 0, incorrect = 0, unanswered = 0;
    questions.forEach((_, index) => {
      const status = getAnswerStatus(index);
      if (status === 'correct') correct++;
      else if (status === 'incorrect') incorrect++;
      else unanswered++;
    });
    return { correct, incorrect, unanswered };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="result-summary">
      <div className="result-header">
        <h2>Exam Completed!</h2>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{totalQuestions}</span>
          </div>
          <div className="percentage">{percentage}%</div>
        </div>
      </div>

      <div className="result-details">
        <div className="detail-item">
          <strong>Student Name:</strong> {student.name}
        </div>
        <div className="detail-item">
          <strong>Roll Number:</strong> {student.roll}
        </div>
        <div className="detail-item">
          <strong>School:</strong> {student.school}
        </div>
        <div className="detail-item">
          <strong>Class:</strong> {student.class}
        </div>
      </div>

      <div className="answer-summary">
        <h3>Answer Summary</h3>
        <div className="summary-stats">
          <div className="stat-item correct">
            <span className="stat-label">Correct:</span>
            <span className="stat-value">{statusCounts.correct}</span>
          </div>
          <div className="stat-item incorrect">
            <span className="stat-label">Incorrect:</span>
            <span className="stat-value">{statusCounts.incorrect}</span>
          </div>
          <div className="stat-item unanswered">
            <span className="stat-label">Unanswered:</span>
            <span className="stat-value">{statusCounts.unanswered}</span>
          </div>
        </div>
      </div>

      {isPremium && (
        <div className="premium-analytics">
          <h3>Premium Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-item">
              <span className="analytics-label">Performance Level:</span>
              <span className={`analytics-value ${percentage >= 90 ? 'excellent' : percentage >= 75 ? 'good' : percentage >= 60 ? 'average' : 'needs-improvement'}`}>
                {percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Good' : percentage >= 60 ? 'Average' : 'Needs Improvement'}
              </span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Accuracy Rate:</span>
              <span className="analytics-value">{((statusCounts.correct / (statusCounts.correct + statusCounts.incorrect)) * 100).toFixed(1)}%</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Completion Rate:</span>
              <span className="analytics-value">{((totalQuestions - statusCounts.unanswered) / totalQuestions * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="detailed-review-toggle">
        <button
          onClick={() => setShowDetailedReview(!showDetailedReview)}
          className="toggle-review-btn"
        >
          {showDetailedReview ? 'Hide' : 'Show'} Detailed Review
        </button>
      </div>

      {showDetailedReview && (
        <div className="detailed-review">
          <h3>Detailed Question Review</h3>
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const correctAnswer = question.answer;
            const status = getAnswerStatus(index);

            return (
              <div key={index} className={`question-review-item ${status}`}>
                <div className="question-header">
                  <h4>Question {index + 1}</h4>
                  <span className={`status-badge ${status}`}>
                    {status === 'correct' ? '✓ Correct' : status === 'incorrect' ? '✗ Incorrect' : '○ Unanswered'}
                  </span>
                </div>

                <div className="question-text">
                  <p>{question.question}</p>
                </div>

                <div className="options-review">
                  {question.options.map((option, optIndex) => {
                    let optionClass = '';
                    if (option === correctAnswer) {
                      optionClass = 'correct-answer';
                    } else if (option === userAnswer && userAnswer !== correctAnswer) {
                      optionClass = 'wrong-answer';
                    }

                    return (
                      <div key={optIndex} className={`option-review ${optionClass}`}>
                        <span className="option-label">{String.fromCharCode(65 + optIndex)}.</span>
                        <span className="option-text">{option}</span>
                        {option === correctAnswer && <span className="correct-indicator">✓</span>}
                        {option === userAnswer && userAnswer !== correctAnswer && <span className="wrong-indicator">✗</span>}
                      </div>
                    );
                  })}
                </div>

                {userAnswer && (
                  <div className="answer-explanation">
                    <strong>Your Answer:</strong> {userAnswer}
                    {userAnswer !== correctAnswer && (
                      <>
                        <br />
                        <strong>Correct Answer:</strong> {correctAnswer}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="thank-you-message">
        <h3>Thank you for participating!</h3>
        <p>Your results have been saved successfully.</p>
      </div>
    </div>
  );
};

export default ResultSummary;
