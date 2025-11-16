import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/student-register');
  };

  return (
    <section id="billboard" className="hero-section">
      <div className="overlay">
        <h1>Welcome to ExamHub</h1>
        <p>Master your exams with our comprehensive practice platform</p>
        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <span>Multiple Subjects</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Practice Tests</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Detailed Analytics</span>
          </div>
        </div>
        <button onClick={handleGetStarted} className="cta-button">
          Get Started Free
        </button>
        <p className="hero-subtitle">🎉 Start with 10 FREE exams!</p>
      </div>
      {/* Updated Planet divs to match the four planets in the new cosmic design */}
      <div className="planet planet-1"></div>
      <div className="planet planet-2"></div>
      <div className="planet planet-3"></div>
      <div className="planet planet-4"></div>
      <div className="star star-1"></div>
      <div className="star star-2"></div>
      <div className="star star-3"></div>
      <div className="star star-4"></div>
      <div className="star star-5"></div>
    </section>
  );
}
