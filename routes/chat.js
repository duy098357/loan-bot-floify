import express from "express";
import { createLeadInHubspot } from "../services/hubspotService.js";
import { createFloifyLoanApp, getLoanStatus } from "../services/floifyService.js";
import { convertToApplicant } from "../services/applicantService.js";

const router = express.Router();

// 🧠 Temporary memory store for user conversations
const sessions = new Map();

// Helper to get or create a session
function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      step: "idle",
      data: {},
    });
  }
  return sessions.get(userId);
}
router.post("/", async (req, res) => {
  try {
    const { name, email, loanType, amount } = req.body;

    // Create HubSpot lead
    await createLeadInHubspot({ name, email, loanType, amount });

    // Create Floify applicant
    const applicant = await createFloifyApplicant({ name, email, loanType, amount });

    res.json({
      message: "Loan application successfully created in Floify and HubSpot",
      applicant,
    });
  } catch (err) {
    console.error("❌ Chat route error:", err.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});


router.post("/", async (req, res) => {
  try {
    const { message, userId = "guest" } = req.body; // you can pass userId from frontend if you want
    const session = getSession(userId);
    let reply = "";

    // 🧩 1️⃣ Check for loan status request
    const statusMatch = message.match(/status\s+(\d+)/i);
    if (statusMatch) {
      const loanId = statusMatch[1];
      const status = await getLoanStatus(loanId);
      if (!status) {
        reply = `⚠️ Sorry, I couldn’t find a loan with ID ${loanId}.`;
      } else {
        reply = `📊 Loan #${status.id} for ${status.borrower}\nCurrent Stage: **${status.stage}**\n(Last updated: ${new Date(
          status.updatedAt
        ).toLocaleString()})`;
      }
      return res.json({ reply });
    }

    // 🧩 2️⃣ Handle interactive loan application flow
    if (session.step === "idle" && /apply|loan|mortgage/i.test(message)) {
      session.step = "ask_name";
      reply = "🏦 Great! Let’s start your loan application.\nWhat’s your full name?";
      return res.json({ reply });
    }

    // Collect borrower name
    if (session.step === "ask_name") {
      session.data.name = message.trim();
      session.step = "ask_email";
      reply = `Thanks, ${session.data.name}! What’s your email address?`;
      return res.json({ reply });
    }

    // Collect email
    if (session.step === "ask_email") {
      session.data.email = message.trim();
      session.step = "ask_amount";
      reply = "Got it. How much would you like to borrow (in USD)?";
      return res.json({ reply });
    }

    // Collect amount
    if (session.step === "ask_amount") {
      session.data.amount = parseFloat(message.replace(/[^0-9.]/g, "")) || 0;
      session.step = "ask_type";
      reply = "Perfect. What type of loan are you applying for? (e.g. Home, Auto, Personal)";
      return res.json({ reply });
    }

    // Collect loan type
    if (session.step === "ask_type") {
      session.data.loanType = message.trim();
      reply = "Awesome! Creating your loan application now... 🏦";

      // ✅ Call HubSpot + Floify
      const { name, email, amount, loanType } = session.data;
      const hubspotLead = await createLeadInHubspot({ name, email });
      const floifyApp = await createFloifyLoanApp({ name, email, loanType, amount });

      if (floifyApp?.id) {
        reply = `✅ Loan application created!\nLoan ID: ${floifyApp.id}\nWe’ll email you details soon.`;
      } else {
        reply = `✅ Lead added in HubSpot, but we couldn’t create a Floify application right now.`;
      }

      // Reset session
      sessions.delete(userId);
      return res.json({ reply });
    }

    // 🧩 3️⃣ Default response
    reply = "Hi there! You can type 'apply for a loan' to get started, or 'status 12345' to check your loan.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat route error:", err.message);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

export default router;
