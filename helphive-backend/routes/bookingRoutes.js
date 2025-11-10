import express from "express";
import Booking from "../models/Booking.js";
import WorkerApplication from "../models/WorkerApplication.js";

const router = express.Router();

//
// ✅ GET — User dashboard bookings (requires clerkId)
// Example: /api/bookings?clerkId=abc123
//
router.get("/", async (req, res) => {
  try {
    const { clerkId } = req.query;

    // ✅ Prevent returning all bookings when clerkId missing
    if (!clerkId) {
      return res.json({ success: true, bookings: [] });
    }

    const bookings = await Booking.find({ clerkId })
      .populate("providerId", "fullName service city averageRating")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Fetch bookings error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
});

//
// ✅ ADMIN: GET — All bookings (ONLY FOR ADMIN PANEL)
// (You can protect this later with Clerk or JWT)
//
router.get("/admin/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("providerId", "fullName service city averageRating")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Admin fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all bookings",
    });
  }
});

//
// ✅ GET — Single booking details
//
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "providerId",
      "fullName service city averageRating"
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Get booking error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
});
// 🧾 GET — All bookings for a worker
router.get("/worker/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;

    const bookings = await Booking.find({ providerId: workerId })
      .populate("providerId", "fullName service city")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Fetch worker bookings error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch worker bookings" });
  }
});

//
// ✅ POST — Create a new booking
//
router.post("/", async (req, res) => {
  try {
    const {
      clerkId,
      providerId,
      service,
      date,
      time,
      duration,
      address,
      phone,
      notes,
      amount,
    } = req.body;

    if (!clerkId || !providerId || !date || !time || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newBooking = await Booking.create({
      clerkId,
      providerId,
      service,
      date,
      time,
      duration,
      address,
      phone,
      notes,
      amount,
      status: "Pending",
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
});

//
// ✅ PATCH — Update booking (status, rating, review)
//
router.patch("/:id", async (req, res) => {
  try {
    const { status, rating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (rating) booking.rating = rating;
    if (review) booking.review = review;

    await booking.save();

    // ✅ Update provider rating if rating was added
    if (booking.providerId && rating) {
      const workerBookings = await Booking.find({
        providerId: booking.providerId,
        rating: { $exists: true, $ne: null },
      });

      let avgRating = 0;

      if (workerBookings.length > 0) {
        avgRating =
          workerBookings.reduce((sum, b) => sum + (b.rating || 0), 0) /
          workerBookings.length;
      }

      const safeAverage = isNaN(avgRating)
        ? 0
        : parseFloat(avgRating.toFixed(1));

      await WorkerApplication.findByIdAndUpdate(booking.providerId, {
        averageRating: safeAverage,
      });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Update booking error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
});

//
// ✅ DELETE — Delete a booking
//
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
});

export default router;
