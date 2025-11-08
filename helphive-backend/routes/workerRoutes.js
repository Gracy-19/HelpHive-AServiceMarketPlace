import express from "express";
import multer from "multer";
import WorkerApplication from "../models/WorkerApplication.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

// Multer memory storage (buffer -> Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// 📤 POST /api/workers — Register new worker
router.post(
  "/",
  upload.fields([{ name: "photo" }, { name: "documents" }]),
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        service,
        experience,
        address,
        city,
        hourlyRate,
        certifications,
        bio,
        clerkId,
      } = req.body;

      // Cloudinary folder name (customizable)
      const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "helphive/workers";

      let photoUrl = null;
      let documentsUrl = null;
      console.log("📤 Uploading photo for", fullName);
      console.log("📦 Cloudinary config:", {
        name: process.env.CLOUDINARY_CLOUD_NAME,
        key: process.env.CLOUDINARY_API_KEY ? "✅ loaded" : "❌ missing",
        secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing",
      });

      // ✅ Upload photo to Cloudinary
      if (req.files?.photo?.[0]) {
        try {
          const result = await uploadBufferToCloudinary(
            req.files.photo[0].buffer,
            {
              folder: `${folder}/photos`,
              resource_type: "image",
              public_id: `${fullName?.replace(
                /\s+/g,
                "_"
              )}_photo_${Date.now()}`,
            }
          );
          photoUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("❌ Cloudinary photo upload error:", uploadErr);
          return res
            .status(500)
            .json({ success: false, message: "Photo upload failed" });
        }
      }

      // ✅ Upload document (PDF, DOCX)
      if (req.files?.documents?.[0]) {
        try {
          const result = await uploadBufferToCloudinary(
            req.files.documents[0].buffer,
            {
              folder: `${folder}/documents`,
              resource_type: "raw",
              public_id: `${fullName?.replace(/\s+/g, "_")}_doc_${Date.now()}`,
            }
          );
          documentsUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("❌ Cloudinary document upload error:", uploadErr);
          return res
            .status(500)
            .json({ success: false, message: "Document upload failed" });
        }
      }

      // ✅ Create MongoDB record
      const newWorker = await WorkerApplication.create({
        clerkId: clerkId || null,
        fullName,
        email,
        phone,
        service,
        experience,
        address,
        city,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
        certifications: certifications || "",
        bio: bio || "",
        photoUrl,
        documentsUrl,
        status: "Pending",
      });

      res.status(201).json({
        success: true,
        message: "Worker application submitted successfully",
        worker: newWorker,
      });
    } catch (err) {
      console.error("❌ Worker registration error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to submit application",
        error: err.message,
      });
    }
  }
);

// 📦 GET /api/workers — List all active workers
router.get("/", async (req, res) => {
  try {
    const workers = await WorkerApplication.find({
      status: { $ne: "Rejected" },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, workers });
  } catch (err) {
    console.error("❌ get workers error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch workers" });
  }
});

// 🧠 GET /api/workers/:id — Get worker by ID
router.get("/:id", async (req, res) => {
  try {
    const worker = await WorkerApplication.findById(req.params.id);
    if (!worker) {
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });
    }

    res.json({ success: true, worker });
  } catch (err) {
    console.error("❌ Error fetching worker:", err);
    res.status(500).json({ success: false, message: "Failed to fetch worker" });
  }
});

export default router;
