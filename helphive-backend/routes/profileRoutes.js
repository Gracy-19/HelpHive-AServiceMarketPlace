import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

// Get profile by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err });
  }
});

// Update or create profile
router.put("/:id", async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  }
});

export default router;
