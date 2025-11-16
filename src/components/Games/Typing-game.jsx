// games/TypingGame.jsx
import React, { useEffect, useState } from "react";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog",
  "Typing games help improve speed and accuracy",
  "React makes it painless to create interactive UIs",
  "Code is like humor. When you have to explain it, it’s bad",
  "Simplicity is the soul of efficiency"
];

const TypingGame = () => {
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const random = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setTargetText(random);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;

    if (!startTime) setStartTime(Date.now());

    if (value === targetText) {
      setEndTime(Date.now());
    }

    setUserInput(value);
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeTaken = (endTime - startTime) / 1000; // seconds
    const words = targetText.trim().split(" ").length;
    return Math.round((words / timeTaken) * 60);
  };

  const resetGame = () => {
    const random = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setTargetText(random);
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Typing Speed Test ⌨️</h3>
      <p><strong>Type the following text:</strong></p>
      <div style={{
        backgroundColor: "#070707ff",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        fontStyle: "italic"
      }}>
        {targetText}
      </div>

      <textarea
        value={userInput}
        onChange={handleChange}
        rows="4"
        cols="50"
        disabled={!!endTime}
        placeholder="Start typing here..."
        style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}
      />

      {endTime && (
        <div style={{ marginTop: "1rem" }}>
          <h4>✅ Completed!</h4>
          <p><strong>Your WPM:</strong> {calculateWPM()}</p>
          <button onClick={resetGame}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default TypingGame;
