import React from 'react';
import '../../css/Exams/examreview.css';

const ExamReview = ({ student, questions, answers, score, onClose }) => {
  const getAnswerStatus = (questionIndex) => {
    const studentAnswer = answers[questionIndex];
    const correctAnswer = questions[questionIndex].answer;
    if (!studentAnswer) return 'unanswered';
    return studentAnswer === correctAnswer ? 'correct' : 'incorrect';
  };

  const getOptionClass = (option, questionIndex) => {
    const studentAnswer = answers[questionIndex];
    const correctAnswer = questions[questionIndex].answer;

    if (option === correctAnswer) return 'correct-answer';
    if (option === studentAnswer && studentAnswer !== correctAnswer) return 'wrong-answer';
    return '';
  };

  return (
    <div className="exam-review-overlay">
      <div className="exam-review-modal">
        <div className="exam-review-header">
          <h2>Exam Review</h2>
          <div className="review-info">
            <span>Student: {student.name}</span>
            <span>Score: {score} / {questions.length}</span>
            <span>Percentage: {((score / questions.length) * 100).toFixed(1)}%</span>
          </div>
          <button className="close-review-btn" onClick={onClose}>×</button>
        </div>

        <div className="review-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Questions:</span>
              <span className="stat-value">{questions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct:</span>
              <span className="stat-value correct">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Incorrect:</span>
              <span className="stat-value incorrect">{Object.keys(answers).length - score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unanswered:</span>
              <span className="stat-value unanswered">{questions.length - Object.keys(answers).length}</span>
            </div>
          </div>
        </div>

        <div className="review-questions">
          {questions.map((question, index) => (
            <div key={index} className={`review-question ${getAnswerStatus(index)}`}>
              <div className="question-header">
                <h4>Question {index + 1}</h4>
                <div className="question-status">
                  {getAnswerStatus(index) === 'correct' && <span className="status correct">✓ Correct</span>}
                  {getAnswerStatus(index) === 'incorrect' && <span className="status incorrect">✗ Incorrect</span>}
                  {getAnswerStatus(index) === 'unanswered' && <span className="status unanswered">○ Unanswered</span>}
                </div>
              </div>

              <p className="question-text">{question.question}</p>

              <div className="options-review">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className={`option-review ${getOptionClass(option, index)}`}>
                    <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                    <span className="option-text">{option}</span>
                    {option === question.answer && <span className="correct-indicator">✓</span>}
                    {option === answers[index] && option !== question.answer && <span className="wrong-indicator">✗</span>}
                  </div>
                ))}
              </div>

              {answers[index] && (
                <div className="answer-summary">
                  <strong>Your Answer:</strong> {answers[index]}
                  {answers[index] !== question.answer && (
                    <>
                      <br />
                      <strong>Correct Answer:</strong> {question.answer}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="review-actions">
          <button className="close-review-btn" onClick={onClose}>Close Review</button>
        </div>
      </div>
    </div>
  );
};

export default ExamReview;
