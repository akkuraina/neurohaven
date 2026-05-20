import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  BookOpen,
  Plus,
  Download,
  TrendingUp,
  Heart,
  Cloud,
  Sun,
  Zap,
  Flame,
  Loader2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { authFetch, authPost } from "@/lib/authApi";
import { toast } from "sonner";
import {
  buildHeatmapWeeks,
  computeWritingStreak,
  entriesToCsv,
  formatLocalDayKey,
  moodToIntensity,
  relativeDayLabel,
} from "@/lib/journalUtils";

const moodColors = {
  0: "bg-muted/30",
  1: "bg-destructive/30",
  2: "bg-warning/40",
  3: "bg-primary/50",
  4: "bg-success/60",
};

const moodIcons = {
  Calm: Cloud,
  Content: Heart,
  Energetic: Sun,
  Overwhelmed: Zap,
  Optimistic: Sun,
  Reflective: Cloud,
  Anxious: Zap,
} as const;

type JournalEntryDto = {
  id: string;
  dayKey: string;
  content: string;
  mood: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [entries, setEntries] = useState<JournalEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    intensity: number;
    mood: string | null;
  } | null>(null);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/journal");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Failed to load journal");
      }
      const data = (await res.json()) as { entries: JournalEntryDto[] };
      setEntries(data.entries || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load journal");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const entriesByDay = useMemo(() => {
    const m = new Map<string, { mood: string }>();
    for (const e of entries) m.set(e.dayKey, { mood: e.mood });
    return m;
  }, [entries]);

  const heatmapData = useMemo(() => buildHeatmapWeeks(entriesByDay, 12), [entriesByDay]);

  const journaledDayKeys = useMemo(() => new Set(entries.map((e) => e.dayKey)), [entries]);

  const streak = useMemo(() => computeWritingStreak(journaledDayKeys), [journaledDayKeys]);

  const recentEntries = useMemo(() => entries.slice(0, 12), [entries]);

  const insights = useMemo(() => {
    if (entries.length === 0) {
      return {
        total: 0,
        topMood: null as string | null,
      };
    }
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(e.mood, (counts.get(e.mood) || 0) + 1);
    let topMood: string | null = null;
    let top = 0;
    for (const [m, c] of counts) {
      if (c > top) {
        top = c;
        topMood = m;
      }
    }
    return { total: entries.length, topMood };
  }, [entries]);

  const calendarModifiers = useMemo(
    () => ({
      journaled: (date: Date) => journaledDayKeys.has(formatLocalDayKey(date)),
    }),
    [journaledDayKeys]
  );

  const handleSaveEntry = async () => {
    if (!selectedDate || !newEntry.trim() || !selectedMood) return;
    setSaving(true);
    try {
      const dayKey = formatLocalDayKey(selectedDate);
      const res = await authPost(
        "/api/journal",
        { dayKey, content: newEntry.trim(), mood: selectedMood },
        true
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((body as { error?: string }).error || "Save failed");
      toast.success("Journal entry saved");
      setNewEntry("");
      setSelectedMood("");
      await loadEntries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    if (entries.length === 0) {
      toast.message("No entries to export");
      return;
    }
    const sorted = [...entries].sort((a, b) => a.dayKey.localeCompare(b.dayKey));
    const csv = entriesToCsv(
      sorted.map((e) => ({
        dayKey: e.dayKey,
        mood: e.mood,
        content: e.content,
        updatedAt: e.updatedAt ? new Date(e.updatedAt).toISOString() : "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-export-${formatLocalDayKey(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded CSV");
  };

  const getDayName = (dayIndex: number) => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex];
  };

  const getMonthName = (weekIndex: number) => {
    if (weekIndex % 4 === 0) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = (new Date().getMonth() - Math.floor(weekIndex / 4)) % 12;
      return monthNames[monthIndex >= 0 ? monthIndex : monthIndex + 12];
    }
    return "";
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-semibold text-foreground">Mind Journal</h1>
                <p className="text-muted-foreground">
                  Track your emotional journey with visual insights
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <div
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-sm"
                title="Consecutive days journaled (local calendar)"
              >
                <Flame className="h-5 w-5 text-orange-500" aria-hidden />
                <div className="text-right leading-tight">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Streak</div>
                  <div className="text-xl font-semibold tabular-nums">{streak}</div>
                </div>
              </div>
              <Button variant="outline" className="btn-ghost-gold" onClick={handleExportCsv}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-accent" />
                  <span>New Journal Entry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {(["Calm", "Content", "Energetic", "Overwhelmed", "Optimistic", "Reflective", "Anxious"] as const).map(
                    (mood) => {
                      const Icon = moodIcons[mood];
                      return (
                        <Button
                          key={mood}
                          size="sm"
                          variant={selectedMood === mood ? "default" : "outline"}
                          onClick={() => setSelectedMood(mood)}
                          className={selectedMood === mood ? "btn-hero" : "btn-minimal"}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {mood}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Textarea
                  placeholder="How are you feeling today? What's on your mind?"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="min-h-[120px] resize-none"
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {selectedDate && (
                      <span>
                        Day: <strong>{formatLocalDayKey(selectedDate)}</strong>
                      </span>
                    )}
                    {selectedMood && (
                      <span className="ml-3">
                        Mood: <strong>{selectedMood}</strong>
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => void handleSaveEntry()}
                    disabled={!newEntry.trim() || !selectedMood || !selectedDate || saving}
                    className="btn-hero"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save Entry"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mood Heatmap — last 12 weeks</span>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-sm ${moodColors[level as keyof typeof moodColors]}`}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading journal…
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <div className="w-12" />
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div key={dayIndex} className="w-4 text-xs text-muted-foreground text-center mr-1">
                          {dayIndex % 2 === 1 ? getDayName(dayIndex) : ""}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      {heatmapData.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex items-center">
                          <div className="w-12 text-xs text-muted-foreground text-right pr-2">
                            {getMonthName(weekIndex)}
                          </div>
                          <div className="flex space-x-1">
                            {week.map((day, dayIndex) => (
                              <div
                                key={`${weekIndex}-${dayIndex}`}
                                className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/50 ${
                                  moodColors[day.intensity as keyof typeof moodColors]
                                }`}
                                onMouseEnter={() => setHoveredCell(day)}
                                onMouseLeave={() => setHoveredCell(null)}
                                title={`${day.date}: ${day.mood || "No entry"}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {hoveredCell && (
                      <div className="absolute top-0 left-0 bg-popover border border-border rounded-lg p-2 shadow-lg pointer-events-none z-10">
                        <div className="text-sm font-medium">{hoveredCell.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {hoveredCell.mood || "No entry"}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.length === 0 && !loading ? (
                  <p className="text-sm text-muted-foreground">No entries yet. Write your first journal above.</p>
                ) : (
                  recentEntries.map((entry) => {
                    const Icon = moodIcons[entry.mood as keyof typeof moodIcons] ?? Heart;
                    const intensity = moodToIntensity(entry.mood);
                    return (
                      <div key={entry.id} className="p-4 bg-muted/30 rounded-lg hover-lift">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <Icon className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{entry.mood}</h4>
                              <p className="text-sm text-muted-foreground">
                                {relativeDayLabel(entry.dayKey)} · {entry.dayKey}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 ${moodColors[intensity as keyof typeof moodColors]}`}
                          />
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3">{entry.content}</p>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {entry.dayKey}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                  modifiers={calendarModifiers}
                  modifiersClassNames={{
                    journaled: "ring-2 ring-primary/50 font-semibold bg-primary/5",
                  }}
                />
              </CardContent>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Total entries</p>
                  <p className="text-xs text-muted-foreground">{insights.total} saved to your account</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Most common mood</p>
                  <p className="text-xs text-muted-foreground">
                    {insights.topMood ? insights.topMood : "Journal a bit more to see patterns"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Heatmap</p>
                  <p className="text-xs text-muted-foreground">
                    Each square is a day; intensity reflects your tagged mood when you journaled.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
