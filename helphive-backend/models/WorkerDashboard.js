import mongoose from "mongoose";

const WorkerDashboardSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerApplication",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customerName: { type: String, required: true },

    date: String,
    time: String,
    address: String,
    phone: String,
    notes: String,
    status: String,
  },

  { timestamps: true }
);

export default mongoose.model("WorkerDashboard", WorkerDashboardSchema);
