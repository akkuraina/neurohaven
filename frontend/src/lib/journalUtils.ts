/** Local calendar YYYY-MM-DD (not UTC). */
export function formatLocalDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseLocalDayKey(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const moodIntensity: Record<string, number> = {
  Anxious: 1,
  Overwhelmed: 1,
  Calm: 2,
  Reflective: 2,
  Content: 3,
  Energetic: 3,
  Optimistic: 4,
};

export function moodToIntensity(mood: string): number {
  return moodIntensity[mood] ?? 2;
}

export type HeatmapDay = {
  date: string;
  intensity: number;
  mood: string | null;
};

/** 12 rows × 7 cols: row 0 = oldest week, row 11 = current week (same layout as previous UI). */
export function buildHeatmapWeeks(
  entriesByDay: Map<string, { mood: string }>,
  weeks = 12
): HeatmapDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const raw: HeatmapDay[][] = [];
  for (let week = 0; week < weeks; week++) {
    const weekRow: HeatmapDay[] = [];
    for (let day = 0; day < 7; day++) {
      const cell = new Date(today);
      cell.setDate(cell.getDate() - (week * 7 + day));
      const date = formatLocalDayKey(cell);
      const entry = entriesByDay.get(date);
      const intensity = entry ? moodToIntensity(entry.mood) : 0;
      weekRow.push({
        date,
        intensity,
        mood: entry?.mood ?? null,
      });
    }
    raw.push(weekRow);
  }
  return raw.reverse();
}

/**
 * LeetCode-style: count consecutive journaled days backward from today;
 * if today has no entry yet, start from yesterday so the streak doesn't drop to zero until the day is missed.
 */
export function computeWritingStreak(dayKeys: Set<string>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let d = new Date(today);
  let key = formatLocalDayKey(d);
  if (!dayKeys.has(key)) {
    d.setDate(d.getDate() - 1);
    key = formatLocalDayKey(d);
    if (!dayKeys.has(key)) return 0;
  }

  let streak = 0;
  while (dayKeys.has(key)) {
    streak++;
    d.setDate(d.getDate() - 1);
    key = formatLocalDayKey(d);
  }
  return streak;
}

export function relativeDayLabel(dayKey: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const t = formatLocalDayKey(today);
  if (dayKey === t) return "Today";
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  if (dayKey === formatLocalDayKey(y)) return "Yesterday";
  const diff =
    (today.getTime() - parseLocalDayKey(dayKey).getTime()) / (1000 * 60 * 60 * 24);
  if (diff >= 2 && diff < 7) return `${Math.round(diff)} days ago`;
  return dayKey;
}

export function escapeCsvField(value: string): string {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function entriesToCsv(
  rows: { dayKey: string; mood: string; content: string; updatedAt?: string }[]
): string {
  const header = "dayKey,mood,content,updatedAt";
  const lines = rows.map((r) =>
    [r.dayKey, r.mood, r.content, r.updatedAt ?? ""].map(escapeCsvField).join(",")
  );
  return [header, ...lines].join("\r\n");
}
