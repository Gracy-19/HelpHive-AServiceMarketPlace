import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/workers", workerRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Helphive Backend API is running ✅");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ Export for Vercel serverless
export default app;
