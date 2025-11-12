import { connectDB } from "./utils/db.js";
await connectDB();

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();

// ✅ Allow specific origins
const allowedOrigins = [
  "https://www.lender.com",
  "https://lender.vercel.app",
  "https://www.stratolending.com/", // replace with your actual Wix domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // for tools like Postman
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS policy: Origin not allowed"), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("✅ Loan Bot API is running (CORS-configured)");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
