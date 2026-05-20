import { google } from "googleapis";
import { randomUUID } from "crypto";

let calendarClient = null;

function getCalendarAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw?.trim()) return null;

  try {
    const credentials = JSON.parse(raw);
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    const impersonate = process.env.GOOGLE_CALENDAR_IMPERSONATE_EMAIL?.trim();

    if (impersonate) {
      return new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes,
        subject: impersonate,
      });
    }

    return new google.auth.GoogleAuth({ credentials, scopes });
  } catch (err) {
    console.error("Google Calendar auth parse failed:", err.message);
    return null;
  }
}

function getCalendar() {
  if (calendarClient) return calendarClient;
  const auth = getCalendarAuth();
  if (!auth) return null;
  calendarClient = google.calendar({ version: "v3", auth });
  return calendarClient;
}

/**
 * Create a Calendar event with a Google Meet link (Calendar API conferenceData).
 * Requires GOOGLE_SERVICE_ACCOUNT_JSON (or FIREBASE_SERVICE_ACCOUNT_JSON) and optionally
 * GOOGLE_CALENDAR_ID (default "primary") + GOOGLE_CALENDAR_IMPERSONATE_EMAIL for Workspace.
 */
export async function createGoogleMeetLink({
  summary,
  description,
  start,
  end,
  requestId,
}) {
  const calendar = getCalendar();
  if (!calendar) {
    return {
      meetLink: "",
      eventId: "",
      configured: false,
    };
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const id = requestId || randomUUID();

  try {
    const { data } = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetLink =
      data.hangoutLink ||
      data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
      "";

    return { meetLink, eventId: data.id || "", configured: true };
  } catch (err) {
    console.error("Google Meet create failed:", err.message);
    return { meetLink: "", eventId: "", configured: true, error: err.message };
  }
}

export function isGoogleMeetConfigured() {
  return Boolean(getCalendarAuth());
}
