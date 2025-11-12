
import express from "express";
import { createLeadInHubspot } from "../services/hubspotService.js";
import { createFloifyLoanApp, getLoanStatus } from "../services/floifyService.js";
import { convertToApplicant } from "../services/applicantService.js";
import { handleChatMessage } from "../services/chatService.js";
const router = express.Router();
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, { step: "idle", data: {} });
  }
  return sessions.get(userId);
}

router.post("/message", async (req, res) => {
  try {
    const { sessionId, text, leadInfo } = req.body;
    const reply = await handleChatMessage({ sessionId, text, leadInfo });
    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Only ONE POST route
router.post("/", async (req, res) => {
  try {
    const { message, userId = "guest", name, email, loanType, amount } = req.body;
    const session = getSession(userId);
    let reply = "";

    // Handle direct form submissions
    if (name && email && amount && loanType) {
      await createLeadInHubspot({ name, email, loanType, amount });
      const floifyApp = await createFloifyLoanApp({ name, email, loanType, amount });
      return res.json({
        reply: floifyApp?.id
          ? `✅ Loan application created! ID: ${floifyApp.id}`
          : `✅ Lead added in HubSpot, but Floify creation failed.`,
      });
    }

    // Check loan status
    const statusMatch = message?.match(/status\\s+(\\d+)/i);
    if (statusMatch) {
      const loanId = statusMatch[1];
      const status = await getLoanStatus(loanId);
      return res.json({
        reply: status
          ? `📊 Loan #${status.id} — ${status.stage}`
          : `⚠️ Could not find loan with ID ${loanId}.`,
      });
    }

    // Application flow
    if (session.step === "idle" && /apply|loan|mortgage/i.test(message)) {
      session.step = "ask_name";
      return res.json({ reply: "🏦 Great! Let’s start your loan application. What’s your full name?" });
    }

    if (session.step === "ask_name") {
      session.data.name = message.trim();
      session.step = "ask_email";
      return res.json({ reply: `Thanks, ${session.data.name}! What’s your email address?` });
    }

    if (session.step === "ask_email") {
      session.data.email = message.trim();
      session.step = "ask_amount";
      return res.json({ reply: "Got it. How much would you like to borrow (USD)?" });
    }

    if (session.step === "ask_amount") {
      session.data.amount = parseFloat(message.replace(/[^0-9.]/g, "")) || 0;
      session.step = "ask_type";
      return res.json({ reply: "Perfect. What type of loan? (Home, Auto, Personal)" });
    }

    if (session.step === "ask_type") {
      session.data.loanType = message.trim();
      const { name, email, amount, loanType } = session.data;

      const hubspotLead = await createLeadInHubspot({ name, email });
      const floifyApp = await createFloifyLoanApp({ name, email, loanType, amount });

      sessions.delete(userId);
      return res.json({
        reply: floifyApp?.id
          ? `✅ Loan created! ID: ${floifyApp.id}`
          : `✅ Lead added to HubSpot, but Floify creation failed.`,
      });
    }

    // Default fallback
    res.json({
      reply: "Hi! Type 'apply for a loan' to start or 'status 12345' to check a loan.",
    });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

export default router;
