import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signJwt } from "../lib/jwt.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { verifyFirebaseIdToken, isFirebaseAdminReady } from "../lib/firebaseAdmin.js";

const router = express.Router();

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name || "",
    wellnessScore: user.wellnessScore,
    streak: user.streak,
    sessionsCompleted: user.sessionsCompleted,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const emailNorm = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const displayName = (name && String(name).trim()) || emailNorm.split("@")[0];

    const user = await User.create({
      email: emailNorm,
      passwordHash,
      name: displayName,
    });

    const token = signJwt(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("register:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailNorm = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: emailNorm });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signJwt(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("login:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/google", async (req, res) => {
  try {
    if (!isFirebaseAdminReady()) {
      return res.status(503).json({
        error:
          "Google sign-in is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON on the server.",
      });
    }

    const { idToken } = req.body;
    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({ error: "idToken is required" });
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    const uid = decoded.uid;
    const emailRaw = decoded.email;
    if (!emailRaw) {
      return res.status(400).json({ error: "Google account has no email address" });
    }

    const emailNorm = String(emailRaw).toLowerCase().trim();
    const displayName =
      (decoded.name && String(decoded.name).trim()) ||
      emailNorm.split("@")[0];

    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email: emailNorm }],
    });

    if (!user) {
      user = await User.create({
        email: emailNorm,
        firebaseUid: uid,
        name: displayName,
      });
    } else {
      if (user.firebaseUid && user.firebaseUid !== uid) {
        return res.status(409).json({
          error: "This email is already linked to a different Google account",
        });
      }
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        if (!user.name && displayName) user.name = displayName;
        await user.save();
      } else if (displayName && displayName !== user.name) {
        user.name = displayName;
        await user.save();
      }
    }

    const token = signJwt(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    if (err?.code === "firebase_admin_not_configured") {
      return res.status(503).json({ error: "Google sign-in is not configured on the server" });
    }
    console.error("google:", err);
    return res.status(401).json({ error: "Invalid Google token" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    return res.json(sanitizeUser(user));
  } catch (err) {
    console.error("me:", err);
    return res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;
