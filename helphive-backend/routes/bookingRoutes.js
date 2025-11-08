import express from "express";
import Booking from "../models/Booking.js";
import WorkerApplication from "../models/WorkerApplication.js";

const router = express.Router();

//
// 🧾 GET — All bookings (admin or user dashboard)
//
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("providerId", "fullName service city averageRating")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Fetch bookings error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
});

//
// 📄 GET — Single booking by ID
//
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate(
      "providerId",
      "fullName service city averageRating"
    );
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Get booking error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking" });
  }
});

//
// 🧩 POST — Create a new booking
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

    if (!providerId || !date || !time || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newBooking = await Booking.create({
      clerkId: clerkId || "guest",
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
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking" });
  }
});

//
// 🛠 PATCH — Update booking (status / rating / review)
//
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rating, review } = req.body;

    const booking = await Booking.findById(id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    if (status) booking.status = status;
    if (rating) booking.rating = rating;
    if (review) booking.review = review;

    await booking.save();

    // 🧮 If rating exists — update provider’s average rating
    // 🧮 If rating exists — update provider’s average rating
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

      // ✅ Convert to Number safely & default to 0 if invalid
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
    res
      .status(500)
      .json({ success: false, message: "Failed to update booking" });
  }
});

//
// ❌ DELETE — (Optional) Delete booking (admin)
//
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete booking" });
  }
});

export default router;
