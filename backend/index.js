import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import journalRoutes from "./routes/journal.js";
import counselorRoutes from "./routes/counselors.js";
import { seedCounselorsIfEmpty } from "./lib/seedCounselors.js";

dotenv.config();

const app = express();

function validateRuntimeConfig() {
  const required = ["MONGO_URI"];
  if (process.env.NODE_ENV === "production") required.push("JWT_SECRET", "CLIENT_ORIGIN");

  const missing = required.filter((k) => !process.env[k]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

validateRuntimeConfig();

/** Explicit allowlist from env (comma-separated). */
const configuredOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
  
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (configuredOrigins.includes(origin)) return callback(null, true);
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
    console.log(`CORS allowed origins: ${configuredOrigins.join(", ")}`);
    await seedCounselorsIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
  console.error("MongoDB connection failed:");
  console.error(err);
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});