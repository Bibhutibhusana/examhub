import "../../css/games/Tic-tac-toe.css";
import React, { useState, useEffect } from "react";


const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  useEffect(() => {
    if (autoPlay && !isXTurn && !winner) {
      const timer = setTimeout(() => makeAiMove(), 600);
      return () => clearTimeout(timer);
    }
  }, [isXTurn, autoPlay, winner]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      setIsXTurn(!isXTurn);
    }
  };

  const makeAiMove = () => {
    const available = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (available.length === 0) return;
    const move = available[Math.floor(Math.random() * available.length)];
    handleClick(move);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningLine([]);
  };

  return (
    <div className="game">
      <div>
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 drop-shadow-lg">
          Tic Tac Toe
        </h1>

        {/* Game Board */}
        <div className="board">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`cell ${winningLine.includes(index) ? "winner" : ""}`}
              disabled={cell || winner}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="mb-4 text-lg font-semibold">
          {winner ? (
            <p className="text-green-600 animate-pulse">Winner: {winner}</p>
          ) : board.every(Boolean) ? (
            <p className="text-yellow-600 animate-bounce">It&apos;s a Draw!</p>
          ) : (
            <p className="text-gray-700">Next Turn: {isXTurn ? "X" : "O"}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg"
          >
            Reset
          </button>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-5 py-2 rounded-xl shadow-lg transition-colors duration-300 ${
              autoPlay
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "bg-gray-400 hover:bg-gray-500 text-white"
            }`}
          >
            {autoPlay ? "Auto Play On" : "Auto Play Off"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;