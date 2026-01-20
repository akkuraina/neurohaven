// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: String,
  email: String,
  wellnessScore: { type: Number, default: 50 },
  streak: { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
