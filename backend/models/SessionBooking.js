import mongoose from "mongoose";

const sessionBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    counselor: { type: mongoose.Schema.Types.ObjectId, ref: "Counselor", required: true },
    sessionType: { type: String, enum: ["video", "chat"], required: true },
    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },
    timeSlotLabel: { type: String, required: true },
    reason: { type: String, default: "" },
    isAnonymous: { type: Boolean, default: true },
    meetLink: { type: String, default: "" },
    googleEventId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

sessionBookingSchema.index({ user: 1, scheduledStart: -1 });
sessionBookingSchema.index({ counselor: 1, scheduledStart: 1 });

export default mongoose.model("SessionBooking", sessionBookingSchema);
