import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: false },

    customerName: {
      type: String,
      required: true,
      default: "Customer",
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkerApplication",
      required: true,
    },

    service: { type: String },
    date: { type: String },
    time: { type: String },
    duration: { type: String },
    address: { type: String },
    phone: { type: String },
    notes: { type: String },
    amount: { type: Number },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
