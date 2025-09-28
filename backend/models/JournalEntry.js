const mongoose = require("mongoose");

// Define the Journal Entry schema
const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to user
  title: { type: String, required: true }, // Title of the journal entry
  content: { type: String, required: true }, // Main journal content
  dateCreated: { type: Date, default: Date.now }, // Automatically set creation date
});

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);