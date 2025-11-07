import axios from "axios";

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;

// Create new lead in HubSpot CRM
export async function createLeadInHubspot({ name, email, loanType, amount }) {
  try {
    const payload = {
      properties: {
        firstname: name,
        email,
        loan_type: loanType,
        loan_amount: amount,
      },
    };

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("❌ HubSpot API error:", err.response?.data || err.message);
    throw new Error("HubSpot lead creation failed");
  }
}
