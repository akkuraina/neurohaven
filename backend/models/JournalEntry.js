import mongoose from "mongoose";

/**
 * One document per user per calendar day (client-sent YYYY-MM-DD).
 */
const journalEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dayKey: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    content: { type: String, required: true, trim: true },
    mood: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

journalEntrySchema.index({ user: 1, dayKey: 1 }, { unique: true });

export default mongoose.model("JournalEntry", journalEntrySchema);
