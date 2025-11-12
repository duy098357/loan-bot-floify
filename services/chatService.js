// services/chatService.js
import OpenAI from "openai";
import Lead from "../models/Lead.js";
import Message from "../models/Message.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handleChatMessage({ sessionId, text, leadInfo }) {
  if (!sessionId || !text) throw new Error("Missing sessionId or text");

  // 1. Save the user's message
  await Message.create({ sessionId, sender: "user", content: text });

  // 2. Optional: upsert lead info if provided
  if (leadInfo?.email) {
    await Lead.findOneAndUpdate(
      { sessionId },
      { ...leadInfo, lastActivity: new Date() },
      { upsert: true }
    );
  }

  // 3. Load conversation history (last 10 messages)
  const history = await Message.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(10);

  const messages = [
    { role: "system", content: "You are an AI loan assistant helping users apply for a loan." },
    ...history.map((m) => ({
      role: m.sender === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  // 4. Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 400,
  });

  const reply = completion.choices[0].message.content;

  // 5. Save assistant reply
  await Message.create({ sessionId, sender: "assistant", content: reply });

  return reply;
}
