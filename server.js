// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./utils/db.js";
// import chatRoutes from "./routes/chat.js";
// import floifyRoutes from "./routes/floify.js";
// import hubspotRoutes from "./routes/hubspot.js";
// import losRoutes from "./routes/los.js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// connectDB();

// app.use("/api/chat", chatRoutes);
// app.use("/api/floify", floifyRoutes);
// app.use("/api/hubspot", hubspotRoutes);
// app.use("/api/los", losRoutes);

// app.use(express.static("./frontend/dist"));
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

// import express from "express";
// import cors from "cors";
// import chatRoutes from "./routes/chat.js";

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Chat route
// app.use("/chat", chatRoutes);

// // Root test route
// app.get("/", (req, res) => {
//   res.send("✅ Loan Bot API is running");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

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
  "https://www.wixsite.com", // replace with your actual Wix domain
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
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("✅ Loan Bot API is running (CORS-configured)");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
