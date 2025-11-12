import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://loan-bot-floify.onrender.com";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Decide first-time vs returning visitor
  useEffect(() => {
    const hasOpened = localStorage.getItem("loanbot_hasOpened");

    if (!hasOpened) {
      // first-time visitor
      setMessages([
        {
          sender: "bot",
          text: "👋 Hi there! I’m your Loan Assistant. How can I help you today?",
        },
      ]);
      setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("loanbot_hasOpened", "true");
      }, 2000);
    } else {
      // returning visitor
      setMessages([
        {
          sender: "bot",
          text: "👋 Welcome back! How can I help you today?",
        },
      ]);
    }
  }, []);
  async function sendMessage(text) {
    const res = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: localStorage.getItem("chatSessionId"),
        text,
        leadInfo: { email, phone },
      }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
  }

  // async function handleSend() {
  //   if (!input.trim()) return;
  //   const userText = input.trim();
  //   setMessages((prev) => [...prev, { sender: "user", text: userText }]);
  //   setInput("");
  //   setIsLoading(true);

  //   try {
  //     const res = await axios.post(API_URL, { message: userText });
  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: "bot", text: res.data.reply || "..." },
  //     ]);
  //   } catch (err) {
  //     console.error("Chat error:", err);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "bot",
  //         text: "⚠️ Sorry, I’m having trouble connecting to the server.",
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Box */}
      <div
        className={`fixed left-6 bottom-[90px] w-[90%] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300 ease-out z-40 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0 pointer-events-none"
        }`}
        style={{
          height: window.innerWidth < 640 ? "75vh" : "550px",
        }}
      >
        {/* Header */}
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <div className="font-semibold text-sm">StratoBridge Lending LLC</div>
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
            onClick={sendMessage}
            className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-r-lg transition"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
