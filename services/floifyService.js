



import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FLOIFY_API_URL = process.env.FLOIFY_API_URL;
const FLOIFY_TOKEN = process.env.FLOIFY_TOKEN;

export async function createFloifyLoanApp({ name, email, loanType, amount }) {
  try {
    const [first_name, ...rest] = name.split(" ");
    const last_name = rest.join(" ") || "Unknown";

    const payload = {
      first_name,
      last_name,
      email,
      loan_amount: amount,
      loan_purpose: loanType,
    };

    const response = await axios.post(`${FLOIFY_API_URL}/applicants`, payload, {
      headers: {
        Authorization: `Bearer ${FLOIFY_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Floify applicant created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Floify applicant creation failed:", error.response?.data || error.message);
    throw new Error("Floify applicant creation failed");
  }
};

// ✅ Fetch existing loan status from Floify
export const getLoanStatus = async (loanId) => {
  try {
    const response = await axios.get(`${FLOIFY_API_BASE}/loans/${loanId}`, {
      headers: {
        Authorization: `Bearer ${FLOIFY_API_KEY}`,
      },
    });

    const loan = response.data;

    return {
      id: loan.id,
      borrower: loan.borrower_name || "Unknown",
      stage: loan.stage || loan.status || "Unknown",
      updatedAt: loan.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error fetching Floify loan status:", error.response?.data || error.message);
    return null;
  }
};
