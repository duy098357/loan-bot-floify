import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { sender: "bot", text: "👋 Hi there! I’m your Loan Assistant. You can type 'apply for a loan' to get started, or 'status 12345' to check your loan." }
      ]);
    }, 1000); // wait 1 second after loading
  }, []);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState("");
  const chatEndRef = useRef(null);

  // Generate unique user ID once per session
  useEffect(() => {
    let storedId = localStorage.getItem("loanbot_userId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("loanbot_userId", storedId);
    }
    setUserId(storedId);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
        userId,
      });

      const botMsg = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { from: "bot", text: "⚠️ Error connecting to server." };
      setMessages((prev) => [...prev, errorMsg]);
      console.error(err);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 flex flex-col border border-slate-300">
        <h1 className="text-2xl font-bold mb-4 text-center text-slate-700">
          💬 Loan Assistant Chatbot
        </h1>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
