import mongoose from "mongoose";

const WorkerApplicationSchema = new mongoose.Schema({
  clerkId: { type: String, default: null }, // optional: if applicant is logged-in
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  service: { type: String },
  experience: { type: String },
  address: { type: String },
  city: { type: String },
 hourlyRate: {
  type: Number,
  required: true,
  default: 500
},
  certifications: { type: String },
  bio: { type: String },
  photoUrl: { type: String }, // Cloudinary URL
  documentsUrl: { type: String }, // Cloudinary URL (pdf/doc)
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 },
});

export default mongoose.model("WorkerApplication", WorkerApplicationSchema);
