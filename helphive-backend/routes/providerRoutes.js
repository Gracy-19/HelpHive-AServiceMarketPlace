import express from "express";
import Provider from "../models/Provider.js";

const router = express.Router();

// Get all providers
router.get("/", async (req, res) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching providers", error: err });
  }
});

// Get provider by ID
router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Not found" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: "Error fetching provider", error: err });
  }
});

export default router;
