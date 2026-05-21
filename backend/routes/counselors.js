import express from "express";
import Counselor from "../models/Counselor.js";
import SessionBooking from "../models/SessionBooking.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createGoogleMeetLink } from "../lib/googleMeet.js";
import { parseTimeSlotOnDate, whatsappUrl } from "../lib/bookingTime.js";
import { randomUUID } from "crypto";

const router = express.Router();

function sanitizeCounselor(c) {
  return {
    id: c._id.toString(),
    name: c.name,
    title: c.title,
    specialties: c.specialties || [],
    rating: c.rating,
    sessionsCount: c.sessionsCount,
    avatarUrl: c.avatarUrl || "",
    languages: c.languages || [],
    approach: c.approach,
    phone: c.phone,
    whatsappUrl: whatsappUrl(c.phone),
    availability: c.availabilityNote,
    nextSlot: c.nextSlotHint,
  };
}

function sanitizeBooking(b) {
  const counselor = b.counselor;
  return {
    id: b._id.toString(),
    sessionType: b.sessionType,
    scheduledStart: b.scheduledStart,
    scheduledEnd: b.scheduledEnd,
    timeSlotLabel: b.timeSlotLabel,
    reason: b.reason,
    isAnonymous: b.isAnonymous,
    meetLink: b.meetLink,
    status: b.status,
    counselor: counselor
      ? {
          id: counselor._id?.toString() || counselor.id,
          name: counselor.name,
          title: counselor.title,
          phone: counselor.phone,
          whatsappUrl: whatsappUrl(counselor.phone),
        }
      : null,
    createdAt: b.createdAt,
  };
}

/** List active counselors (public). */
router.get("/", async (_req, res) => {
  try {
    const rows = await Counselor.find({ isActive: true }).sort({ name: 1 }).lean();
    res.json({ counselors: rows.map(sanitizeCounselor) });
  } catch (err) {
    console.error("counselors list:", err);
    res.status(500).json({ error: "Failed to load counselors" });
  }
});

router.get("/bookings/me", requireAuth, async (req, res) => {
  try {
    const rows = await SessionBooking.find({
      user: req.userId,
      status: "scheduled",
      scheduledStart: { $gte: new Date() },
    })
      .populate("counselor")
      .sort({ scheduledStart: 1 })
      .limit(20)
      .lean();

    res.json({ bookings: rows.map(sanitizeBooking) });
  } catch (err) {
    console.error("bookings me:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

router.post("/bookings", requireAuth, async (req, res) => {
  try {
    const { counselorId, sessionType, dayKey, timeSlot, reason, isAnonymous } = req.body;

    if (!counselorId) return res.status(400).json({ error: "counselorId is required" });
    if (!["video", "chat"].includes(sessionType)) {
      return res.status(400).json({ error: "sessionType must be video or chat" });
    }
    if (!dayKey || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      return res.status(400).json({ error: "dayKey must be YYYY-MM-DD" });
    }
    if (!timeSlot) return res.status(400).json({ error: "timeSlot is required" });

    const counselor = await Counselor.findOne({ _id: counselorId, isActive: true });
    if (!counselor) return res.status(404).json({ error: "Counselor not found" });

    let scheduledStart;
    let scheduledEnd;
    try {
      ({ scheduledStart, scheduledEnd } = parseTimeSlotOnDate(dayKey, timeSlot));
    } catch {
      return res.status(400).json({ error: "Invalid time slot" });
    }

    if (scheduledStart < new Date()) {
      return res.status(400).json({ error: "Cannot book a session in the past" });
    }

    const conflict = await SessionBooking.findOne({
      counselor: counselor._id,
      status: "scheduled",
      scheduledStart,
    });
    if (conflict) {
      return res.status(409).json({ error: "This time slot is no longer available" });
    }

    let meetLink = "";
    let googleEventId = "";

    if (sessionType === "video") {
      const meet = await createGoogleMeetLink({
        summary: `NeuroHaven — ${counselor.name}`,
        description: `Counseling session with ${counselor.name}. Booked via NeuroHaven.`,
        start: scheduledStart,
        end: scheduledEnd,
        requestId: randomUUID(),
      });
      meetLink = meet.meetLink || "";
      googleEventId = meet.eventId || "";

      if (!meetLink && meet.configured) {
        return res.status(502).json({
          error:
            "Could not create Google Meet link. Check Google Calendar API credentials and calendar access.",
        });
      }
      if (!meetLink) {
        meetLink = process.env.MEET_LINK_FALLBACK || "https://meet.google.com/new";
      }
    }

    const booking = await SessionBooking.create({
      user: req.userId,
      counselor: counselor._id,
      sessionType,
      scheduledStart,
      scheduledEnd,
      timeSlotLabel: timeSlot,
      reason: reason ? String(reason).trim() : "",
      isAnonymous: Boolean(isAnonymous),
      meetLink,
      googleEventId,
      status: "scheduled",
    });

    await Counselor.findByIdAndUpdate(counselor._id, { $inc: { sessionsCount: 1 } });

    const populated = await SessionBooking.findById(booking._id).populate("counselor").lean();

    res.status(201).json({
      booking: sanitizeBooking(populated),
      meetConfigured: sessionType === "video" ? Boolean(googleEventId || meetLink) : false,
    });
  } catch (err) {
    console.error("bookings create:", err);
    res.status(500).json({ error: "Failed to book session" });
  }
});

/** Booked slots for a counselor on a day (for UI availability). */
router.get("/:counselorId/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ error: "date query must be YYYY-MM-DD" });
    }

    const dayKey = String(date);
    const [y, m, d] = dayKey.split("-").map(Number);
    const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
    const dayEnd = new Date(y, m - 1, d, 23, 59, 59, 999);

    const booked = await SessionBooking.find({
      counselor: req.params.counselorId,
      status: "scheduled",
      scheduledStart: { $gte: dayStart, $lte: dayEnd },
    })
      .select("timeSlotLabel scheduledStart")
      .lean();

    res.json({
      bookedSlots: booked.map((b) => b.timeSlotLabel),
    });
  } catch (err) {
    console.error("slots:", err);
    res.status(500).json({ error: "Failed to load slots" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const c = await Counselor.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!c) return res.status(404).json({ error: "Counselor not found" });
    res.json(sanitizeCounselor(c));
  } catch (err) {
    res.status(500).json({ error: "Failed to load counselor" });
  }
});

export default router;
