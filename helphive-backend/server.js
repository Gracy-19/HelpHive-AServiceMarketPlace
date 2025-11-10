import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";

dotenv.config();

const app = express();

// ✅ Fix __dirname for ES Modules (Vercel-friendly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS — allow frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ✅ ❗ NO app.listen() — Vercel handles server start
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Export the app for Vercel
export default app;
