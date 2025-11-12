// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  sender: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
