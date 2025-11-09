// import React, { useState } from "react";
// import axios from "axios";

// export default function ChatWidget() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   async function handleSend() {
//     const userMsg = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");

//     if (input.toLowerCase().includes("loan")) {
//       const res = await axios.post("http://localhost:5000/api/chat", {
//         name: "Visitor",
//         email: "visitor@example.com",
//         loanType: "Home Loan",
//         amount: 350000,
//       });

//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: `✅ Application started! Complete it here: ${res.data.floifyLink}` },
//       ]);
//     } else {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "I can help you start a loan application. Type 'loan' to begin!" },
//       ]);
//     }
//   }

//   return (
//     <div className="w-80 h-96 border rounded-xl shadow-lg p-3 bg-white flex flex-col">
//       <div className="flex-1 overflow-y-auto mb-3">
//         {messages.map((msg, i) => (
//           <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
//             <div
//               className={`p-2 m-1 rounded-lg \${msg.sender === "user" ? "bg-blue-200" : "bg-gray-100"}`}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input className="flex-1 border rounded-l px-2" value={input} onChange={(e) => setInput(e.target.value)} />
//         <button className="bg-blue-500 text-white px-3 rounded-r" onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://www.lender.com/chat"; // ✅ Use your deployed backend URL

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function handleSend() {
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post(API_URL, { message: input });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Unable to reach server. Please try again later." },
      ]);
    }
  }

  return (
    <div className="w-80 h-96 border rounded-xl shadow-lg p-3 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <div
              className={`p-2 m-1 rounded-lg ${
                msg.sender === "user" ? "bg-blue-200" : "bg-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l px-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-3 rounded-r" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
