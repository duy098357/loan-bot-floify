import express from "express";
const router = express.Router();

// Placeholder LOS route
router.get("/", (req, res) => {
  res.json({ message: "LOS route active" });
});

// Example endpoint: Get loan status by application ID
router.get("/status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // In production, you’d query your LOS API
    // Example (commented out):
    /*
    const response = await fetch(`https://api.your-los-system.com/loans/${id}`, {
      headers: { Authorization: `Bearer ${process.env.LOS_API_KEY}` }
    });
    const data = await response.json();
    res.json({ status: data.status });
    */

    // Placeholder response for now
    res.json({
      applicationId: id,
      status: "In Review",
      message: "Sample LOS data (mock)"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve loan status" });
  }
});

export default router;
