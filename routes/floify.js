import express from "express";
const router = express.Router();

// Placeholder route
router.get("/", (req, res) => {
  res.json({ message: "Floify route active" });
});

export default router;
