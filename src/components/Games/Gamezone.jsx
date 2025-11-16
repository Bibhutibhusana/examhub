// GameZone.jsx
import React, { useState } from "react";

// Import games
import TicTacToe from "./Tic-tac-toe";
// top import
import TypingGame from "./Typing-game";

// You can add more like MemoryGame, QuizGame, etc.

const GameZone = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "tic-tac-toe":
        return <TicTacToe />;
      case "typing":
        return <TypingGame />;

      // case "memory": return <MemoryGame />;
      // Add more games here
      default:
        return <div>Please select a game to play.</div>;
    }
  };

  return (
    <div style={{ padding: "2rem" }} id="gamezone" className="contact-section">
      <h2>🎮 Welcome to Game Zone</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setSelectedGame("tic-tac-toe")}>
          Tic Tac Toe
        </button>
        <button onClick={() => setSelectedGame("typing")}>Typing Game</button>

        {/* Add more game buttons here */}
      </div>

      <div
        style={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          minHeight: "300px",
          maxWidth: "60vw",
          alignContent: "center",
          alignSelf: "center",
          textAlign: "center",
            margin: "auto"
        }}
      >
        {renderGame()}
      </div>
    </div>
  );
};

export default GameZone;
