import React, { useState } from "react";
import Fuse from "fuse.js";
import botData from "../assets/chatbot/data.json";
import "../css/ChatBot.css";
import chatIcon from "../assets/chatbot/chat-icon.jpg";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const normalizedData = {};
  Object.entries(botData).forEach(([key, value]) => {
    normalizedData[key.toLowerCase()] = value;
  });

  // 👇 Define Fuse INSIDE the component
  const fuse = new Fuse(Object.keys(normalizedData), {
    includeScore: true,
    threshold: 0.4, // sensitivity (0 = exact, 1 = very loose)
  });

  const findReply = (msg) => {
    const lowerMsg = msg.toLowerCase().trim();

    // Exact match first
    if (normalizedData[lowerMsg]) {
      return normalizedData[lowerMsg];
    }

    // Fuzzy search
    const results = fuse.search(lowerMsg);
    if (results.length > 0 && results[0].score < 0.4) {
      const bestMatch = results[0].item;
      return normalizedData[bestMatch];
    }

    return "Sorry, I don't understand it. I'm still learning.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const botReply = findReply(input);

    setMessages((prev) => [
      ...prev,
      userMsg,
      { sender: "bot", text: botReply },
    ]);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      {/* Floating Button */}
      <button className="chatbot-toggle" onClick={toggleChat}>
        <img src={chatIcon} alt="Chatbot" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
