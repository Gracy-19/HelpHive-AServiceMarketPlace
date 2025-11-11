import express from "express";
import Booking from "../models/Booking.js";
import WorkerApplication from "../models/WorkerApplication.js";
import WorkerDashboard from "../models/WorkerDashboard.js";

const router = express.Router();

/* ----------------------------------------------------------
 ✅ GET — All bookings OR customer bookings (clerkId filter)
-----------------------------------------------------------*/
router.get("/", async (req, res) => {
  try {
    const { clerkId } = req.query;

    const filter = clerkId ? { clerkId } : {};

    const bookings = await Booking.find(filter)
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

/* ----------------------------------------------------------
 ✅ WORKER DASHBOARD FETCH (From WorkerDashboard collection)
-----------------------------------------------------------*/
router.get("/worker/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;

    const dashboardRows = await WorkerDashboard.find({
      workerId,
    }).sort({ date: 1 });

    res.json({ success: true, bookings: dashboardRows });
  } catch (err) {
    console.error("❌ Worker dashboard fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch worker dashboard",
    });
  }
});

/* ----------------------------------------------------------
 ✅ GET — Single booking by ID
-----------------------------------------------------------*/
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
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

/* ----------------------------------------------------------
 ✅ POST — Create booking + save to WorkerDashboard
-----------------------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const {
      clerkId,
      customerName,
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
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Create booking
    const newBooking = await Booking.create({
      clerkId: clerkId || null,
      customerName: customerName || "Customer",
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

    // ✅ ALSO save a simplified record to WorkerDashboard
    await WorkerDashboard.create({
      workerId: providerId,
      bookingId: newBooking._id,
      customerName: newBooking.customerName,
      date: newBooking.date,
      time: newBooking.time,
      address: newBooking.address,
      phone: newBooking.phone,
      notes: newBooking.notes,
      status: newBooking.status,
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking" });
  }
});

/* ----------------------------------------------------------
 ✅ PATCH — Update booking + reflect in WorkerDashboard
-----------------------------------------------------------*/
router.patch("/:id", async (req, res) => {
  try {
    const { status, rating, review } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    if (status) booking.status = status;
    if (rating) booking.rating = rating;
    if (review) booking.review = review;

    await booking.save();

    // ✅ UPDATE WorkerDashboard entry
    await WorkerDashboard.findOneAndUpdate(
      { bookingId: booking._id },
      { status: booking.status },
      { new: true }
    );

    // ✅ If rating added → update worker rating too
    if (booking.providerId && rating) {
      const workerBookings = await Booking.find({
        providerId: booking.providerId,
        rating: { $exists: true, $ne: null },
      });

      const avg =
        workerBookings.reduce((sum, b) => sum + (b.rating || 0), 0) /
        workerBookings.length;

      const safeAvg = parseFloat(avg.toFixed(1)) || 0;

      await WorkerApplication.findByIdAndUpdate(booking.providerId, {
        averageRating: safeAvg,
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

/* ----------------------------------------------------------
 ✅ DELETE — Remove booking + remove from WorkerDashboard
-----------------------------------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    // ✅ Delete dashboard entry also
    await WorkerDashboard.findOneAndDelete({ bookingId: deleted._id });

    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete booking" });
  }
});

export default router;
