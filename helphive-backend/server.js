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

/* ----------------------------------------------------------
 ✅ CORS FIX
 - Supports Clerk authentication
 - Supports frontend dev (5173)
 - Supports production URL
-----------------------------------------------------------*/
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ----------------------------------------------------------
 ✅ Middleware
-----------------------------------------------------------*/
app.use(express.json({ limit: "25mb" })); // handle large FormData
app.use("/uploads", express.static("uploads")); // fallback local uploads

/* ----------------------------------------------------------
 ✅ Connect MongoDB
-----------------------------------------------------------*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ----------------------------------------------------------
 ✅ API Routes
-----------------------------------------------------------*/
app.use("/api/bookings", bookingRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/workers", workerRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Helphive Backend API is running!");
});

/* ----------------------------------------------------------
 ✅ Global Error Handler
-----------------------------------------------------------*/
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

/* ----------------------------------------------------------
 ✅ Start Server
-----------------------------------------------------------*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running → http://localhost:${PORT}`)
);
