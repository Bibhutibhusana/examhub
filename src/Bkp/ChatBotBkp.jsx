// import React, { useState } from "react";
// import botData from "../assets/chatbot/data.json"; // import your JSON file
// import "../css/ChatBot.css";
// import chatIcon from "../assets/chatbot/chat-icon.jpg";

// export default function ChatBot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi! How can I help you?" },
//   ]);
//   const [input, setInput] = useState("");

//   const toggleChat = () => setIsOpen(!isOpen);

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const userMsg = { sender: "user", text: input };
//     const reply = findReply(input);

//     setMessages((prev) => [...prev, userMsg, { sender: "bot", text: reply }]);
//     setInput("");
//   };

//   const findReply = (msg) => {
//     const lowerMsg = msg.toLowerCase();
//     return botData[lowerMsg] || "Sorry, I don’t understand that.";
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Floating Button */}
//       <button className="chatbot-toggle" onClick={toggleChat}>
//         <img src={chatIcon} alt="Chatbot" />
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="chatbot-window">
//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chat-msg ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           <div className="chatbot-input">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
