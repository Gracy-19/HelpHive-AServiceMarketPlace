import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
  name: String,
  service: String,
  city: String,
  hourlyRate: Number,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  description: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Provider", ProviderSchema);
