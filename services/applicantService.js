import axios from "axios";

export async function convertToApplicant({ name, email, loanType, amount }) {
  try {
    // Example endpoint for your CRM or Floify API
    const response = await axios.post("https://api.yourloanplatform.com/applicants", {
      name,
      email,
      loanType,
      amount,
      status: "Pending"
    });

    return response.data;
  } catch (error) {
    console.error("❌ Applicant creation failed:", error.response?.data || error.message);
    throw new Error("Applicant creation failed");
  }
}
