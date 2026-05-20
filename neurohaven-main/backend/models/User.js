import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, default: null },
    firebaseUid: { type: String, sparse: true, unique: true },
    name: { type: String, default: "" },
    wellnessScore: { type: Number, default: 50 },
    streak: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
