import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://www.lender.com/chat"; // Change if needed

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! I’m your Loan Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(API_URL, { message: userText });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply || "No response from server." },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Sorry, I’m having trouble connecting to the server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Button (bottom-left) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window (bottom-left) */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-80 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 z-50">
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold text-sm">
              StratoBridge Lending LLC
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-400 text-xs italic">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex">
            <input
              className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
