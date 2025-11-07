// services/loanStatusService.js
import axios from "axios";

// Mock Floify API call (replace with your real Floify credentials)
const FLOIFY_API_BASE = "https://api.floify.com/v1";
const FLOIFY_API_KEY = process.env.FLOIFY_API_KEY || "your_floify_api_key";

export async function getLoanStatus(loanId) {
  try {
    const response = await axios.get(`${FLOIFY_API_BASE}/loans/${loanId}`, {
      headers: { Authorization: `Bearer ${FLOIFY_API_KEY}` },
    });

    const loan = response.data;
    return {
      id: loan.id,
      status: loan.status || "Pending",
      stage: loan.stage || "Processing",
      updated: loan.updated_at || new Date().toISOString(),
    };
  } catch (err) {
    console.error("❌ Floify status fetch failed:", err.message);
    return null;
  }
}
