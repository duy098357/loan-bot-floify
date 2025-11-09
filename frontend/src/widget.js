import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget from "./components/ChatWidget.jsx";

// Create a floating container for the chatbot
(function () {
  const rootId = "loan-chat-widget-root";
  if (document.getElementById(rootId)) return;

  const container = document.createElement("div");
  container.id = rootId;
  document.body.appendChild(container);

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ChatWidget />
    </React.StrictMode>
  );
})();
