import express from "express";
import multer from "multer";
import WorkerApplication from "../models/WorkerApplication.js";
import Booking from "../models/Booking.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

/* ================================================
 ✅ MULTER (memory storage)
================================================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

/* =====================================================
 ✅ 1. REGISTER NEW WORKER
===================================================== */
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

      const folder = "helphive/workers";
      let photoUrl = null;
      let documentsUrl = null;

      // ✅ PHOTO UPLOAD
      if (req.files?.photo?.[0]) {
        const uploaded = await uploadBufferToCloudinary(
          req.files.photo[0].buffer,
          {
            folder: `${folder}/photos`,
            resource_type: "image",
          }
        );
        photoUrl = uploaded.secure_url;
      }

      // ✅ DOCUMENT UPLOAD
      if (req.files?.documents?.[0]) {
        const uploaded = await uploadBufferToCloudinary(
          req.files.documents[0].buffer,
          {
            folder: `${folder}/documents`,
            resource_type: "raw",
          }
        );
        documentsUrl = uploaded.secure_url;
      }

      const newWorker = await WorkerApplication.create({
        clerkId,
        fullName,
        email,
        phone,
        service,
        experience,
        address,
        city,
        hourlyRate: Number(hourlyRate),
        certifications,
        bio,
        photoUrl,
        documentsUrl,
        status: "Active",
      });

      res.status(201).json({
        success: true,
        worker: newWorker,
      });
    } catch (err) {
      console.error("❌ Worker registration error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* =====================================================
 ✅ 2. GET WORKER BY CLERK ID
===================================================== */
router.get("/clerk/:clerkId", async (req, res) => {
  try {
    const worker = await WorkerApplication.findOne({
      clerkId: req.params.clerkId,
    });

    res.json({ success: true, worker });
  } catch (err) {
    console.error("❌ Fetch worker by clerk error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
 ✅ 3. UPDATE WORKER PROFILE
===================================================== */
router.patch(
  "/clerk/:clerkId",
  upload.fields([{ name: "photo" }, { name: "documents" }]),
  async (req, res) => {
    try {
      const updates = req.body;
      const folder = "helphive/workers";

      if (req.files?.photo?.[0]) {
        const uploaded = await uploadBufferToCloudinary(
          req.files.photo[0].buffer,
          {
            folder: `${folder}/photos`,
            resource_type: "image",
          }
        );
        updates.photoUrl = uploaded.secure_url;
      }

      if (req.files?.documents?.[0]) {
        const uploaded = await uploadBufferToCloudinary(
          req.files.documents[0].buffer,
          {
            folder: `${folder}/documents`,
            resource_type: "raw",
          }
        );
        updates.documentsUrl = uploaded.secure_url;
      }

      const updated = await WorkerApplication.findOneAndUpdate(
        { clerkId: req.params.clerkId },
        updates,
        { new: true }
      );

      res.json({ success: true, worker: updated });
    } catch (err) {
      console.error("❌ Worker update error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* =====================================================
 ✅ 4. TODAY'S BOOKINGS (Must be BEFORE /:id)
===================================================== */
router.get("/bookings/today/:workerId", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const bookings = await Booking.find({
      providerId: req.params.workerId,
      date: today,
    });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Today's bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
 ✅ 5. ALL BOOKINGS OF THIS WORKER
===================================================== */
router.get("/bookings/worker/:workerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      providerId: req.params.workerId,
    }).sort({ date: 1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Worker bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
 ✅ 6. ALL WORKERS
===================================================== */
router.get("/", async (req, res) => {
  try {
    const workers = await WorkerApplication.find({
      status: { $ne: "Rejected" },
    }).sort({ createdAt: -1 });

    res.json({ success: true, workers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
 ✅ 7. GET WORKER BY ID (Must be LAST)
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const worker = await WorkerApplication.findById(req.params.id);

    if (!worker)
      return res
        .status(404)
        .json({ success: false, message: "Worker not found" });

    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
