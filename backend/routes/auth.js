// routes/auth.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/sync-user", async (req, res) => {
  const { firebaseUid, name, email } = req.body;

  let user = await User.findOne({ firebaseUid });

  if (!user) {
    user = await User.create({ firebaseUid, name, email });
  }

  res.json(user);
});

export default router;