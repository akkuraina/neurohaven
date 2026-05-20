import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    specialties: [{ type: String, trim: true }],
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    sessionsCount: { type: Number, default: 0, min: 0 },
    avatarUrl: { type: String, default: "" },
    languages: [{ type: String, trim: true }],
    approach: { type: String, default: "" },
    /** E.164 or digits only — used for WhatsApp wa.me links */
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    availabilityNote: { type: String, default: "Available this week" },
    nextSlotHint: { type: String, default: "See calendar" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Counselor", counselorSchema);
