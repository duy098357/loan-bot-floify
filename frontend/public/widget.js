(function () {
  // --- Configuration ---
  const CHATBOT_URL = "https://vercel.com/duy098357s-projects/loan-bot-floify"; // your chatbot app URL
  const BUTTON_COLOR = "#c91d23"; // red brand color
  const WIDTH = "380px";
  const HEIGHT = "520px";

  // --- Create floating button ---
  const button = document.createElement("button");
  button.innerHTML = "💬";
  button.title = "Chat with us";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: BUTTON_COLOR,
    color: "#fff",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: "9999",
    transition: "transform 0.2s ease",
  });
  button.addEventListener("mouseenter", () => (button.style.transform = "scale(1.1)"));
  button.addEventListener("mouseleave", () => (button.style.transform = "scale(1)"));

  // --- Create iframe container ---
  const iframe = document.createElement("iframe");
  iframe.src = CHATBOT_URL;
  Object.assign(iframe.style, {
    position: "fixed",
    bottom: "100px",
    left: "20px",
    width: WIDTH,
    height: HEIGHT,
    border: "none",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    zIndex: "9998",
    display: "none",
    transition: "opacity 0.3s ease",
  });

  // --- Toggle chat visibility ---
  button.addEventListener("click", () => {
    if (iframe.style.display === "none") {
      iframe.style.display = "block";
      iframe.style.opacity = "1";
    } else {
      iframe.style.opacity = "0";
      setTimeout(() => (iframe.style.display = "none"), 300);
    }
  });

  // --- Append elements to page ---
  document.body.appendChild(button);
  document.body.appendChild(iframe);
})();
