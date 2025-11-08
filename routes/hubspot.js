import express from "express";
const router = express.Router();

// Placeholder route for HubSpot integration
router.get("/", (req, res) => {
  res.json({ message: "HubSpot route active" });
});

// Example: Send new lead data to HubSpot
router.post("/sync", async (req, res) => {
  try {
    const { name, email, loanAmount } = req.body;

    // In production, you'd use your HubSpot API key from process.env.HUBSPOT_API_KEY
    // Example structure (commented out until real integration)
    
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          firstname: name,
          email: email,
          loan_amount: loanAmount
        }
      })
    });
    const data = await response.json();
    res.json({ success: true, hubspotResponse: data });
    

    res.json({ success: true, message: "HubSpot sync placeholder working" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "HubSpot sync failed" });
  }
});

export default router;
