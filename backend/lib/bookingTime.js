/** Parse "2:00 PM" on a given local calendar day into Date (server local). */
export function parseTimeSlotOnDate(dayKey, timeSlotLabel) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const match = String(timeSlotLabel).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) throw new Error("Invalid time slot format");

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const start = new Date(y, m - 1, d, hours, minutes, 0, 0);
  const end = new Date(start.getTime() + 50 * 60 * 1000);
  return { scheduledStart: start, scheduledEnd: end };
}

export function dayKeyFromDate(date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const da = String(date.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

export function whatsappUrl(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}
