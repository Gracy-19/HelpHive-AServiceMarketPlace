const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: String },
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', ProfileSchema);
