import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import journalRoutes from "./routes/journal.js";
import counselorRoutes from "./routes/counselors.js";
import { initFirebaseAdmin } from "./lib/firebaseAdmin.js";
import { seedCounselorsIfEmpty } from "./lib/seedCounselors.js";

dotenv.config();
initFirebaseAdmin();

const app = express();

/** Explicit allowlist from env (comma-separated). */
const configuredOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/** In non-production, allow same-machine and typical LAN dev URLs so Vite on 192.168.x.x works. */
function isDevNetworkOrigin(origin) {
  if (process.env.NODE_ENV === "production") return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const h = u.hostname;
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]") return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    return false;
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (configuredOrigins.includes(origin)) return callback(null, true);
      if (isDevNetworkOrigin(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/counselors", counselorRoutes);

app.get("/", (req, res) => {
  res.send("NeuroHaven API running");
});

const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedCounselorsIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
