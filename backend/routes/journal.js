import express from "express";
import JournalEntry from "../models/JournalEntry.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const rows = await JournalEntry.find({ user: req.userId })
      .sort({ dayKey: -1 })
      .select("dayKey content mood createdAt updatedAt")
      .lean();

    const entries = rows.map((e) => ({
      id: e._id.toString(),
      dayKey: e.dayKey,
      content: e.content,
      mood: e.mood,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));

    res.json({ entries });
  } catch (err) {
    console.error("journal list:", err);
    res.status(500).json({ error: "Failed to load journal entries" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { dayKey, content, mood } = req.body;
    if (!dayKey || typeof dayKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey.trim())) {
      return res.status(400).json({ error: "dayKey must be YYYY-MM-DD" });
    }
    const dk = dayKey.trim();
    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (!mood || !String(mood).trim()) {
      return res.status(400).json({ error: "Mood is required" });
    }

    const entry = await JournalEntry.findOneAndUpdate(
      { user: req.userId, dayKey: dk },
      {
        $set: {
          content: String(content).trim(),
          mood: String(mood).trim(),
        },
        $setOnInsert: {
          user: req.userId,
          dayKey: dk,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      entry: {
        id: entry._id.toString(),
        dayKey: entry.dayKey,
        content: entry.content,
        mood: entry.mood,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (err) {
    console.error("journal save:", err);
    res.status(500).json({ error: "Failed to save journal entry" });
  }
});

export default router;
