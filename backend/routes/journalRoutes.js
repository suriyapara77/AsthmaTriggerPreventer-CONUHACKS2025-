// This handles creating, fetching, and managing journal entries.

const express = require("express");
const jwt = require("jsonwebtoken");
const JournalEntry = require("../models/JournalEntry");

const router = express.Router();

// Middleware to authenticate users using JWT
const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user ID to request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Create a new journal entry
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;

  try {
    const journalEntry = new JournalEntry({
      userId: req.user.userId, // Associate entry with logged-in user
      title,
      content,
    });

    await journalEntry.save();
    res.json(journalEntry);
  } catch (err) {
    res.status(500).json({ error: "Failed to create journal entry" });
  }
});

// Get all journal entries for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.userId });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

// Delete a journal entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedEntry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId, // Ensure the user owns the entry
    });

    if (!deletedEntry) return res.status(404).json({ error: "Entry not found" });

    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
});

module.exports = router;

