// models/Lead.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  name: String,
  email: String,
  phone: String,
  warmth: { type: Number, default: 0 },
  crmId: String,
  source: String,
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Lead", LeadSchema);
