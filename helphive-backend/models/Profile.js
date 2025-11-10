import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: String },
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
