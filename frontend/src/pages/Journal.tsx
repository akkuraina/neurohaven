import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  BookOpen, 
  Plus, 
  Download, 
  Filter,
  TrendingUp,
  Heart,
  Cloud,
  Sun,
  Zap
} from "lucide-react";
import { Layout } from "@/components/Layout";

// Mock heatmap data for the last 12 weeks
const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  
  for (let week = 0; week < 12; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + day));
      
      // Generate mood intensity (0-4, 0 = no entry)
      const hasEntry = Math.random() > 0.3;
      const intensity = hasEntry ? Math.floor(Math.random() * 4) + 1 : 0;
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        intensity,
        mood: intensity > 0 ? ['Calm', 'Content', 'Energetic', 'Overwhelmed'][intensity - 1] : null,
      });
    }
    data.push(weekData);
  }
  
  return data.reverse(); // Most recent week first
};

const recentEntries = [
  {
    id: 1,
    date: "Today",
    mood: "Optimistic",
    preview: "Had a breakthrough in my research project today. Feeling grateful for the support from my study group...",
    intensity: 4,
    tags: ["research", "gratitude", "achievement"],
  },
  {
    id: 2,
    date: "Yesterday",
    mood: "Reflective",
    preview: "Spent some time thinking about my goals for the semester. Sometimes it's good to pause and reassess...",
    intensity: 3,
    tags: ["goals", "reflection", "planning"],
  },
  {
    id: 3,
    date: "2 days ago",
    mood: "Anxious",
    preview: "Feeling a bit overwhelmed with upcoming deadlines. Need to remember my breathing exercises...",
    intensity: 2,
    tags: ["stress", "deadlines", "coping"],
  },
];

const moodColors = {
  0: "bg-muted/30",
  1: "bg-destructive/30",
  2: "bg-warning/40",
  3: "bg-primary/50",
  4: "bg-success/60",
};

const moodIcons = {
  "Calm": Cloud,
  "Content": Heart,
  "Energetic": Sun,
  "Overwhelmed": Zap,
  "Optimistic": Sun,
  "Reflective": Cloud,
  "Anxious": Zap,
};

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [heatmapData] = useState(generateHeatmapData());
  const [hoveredCell, setHoveredCell] = useState<any>(null);

  const handleSaveEntry = () => {
    console.log("Saving entry:", { date: selectedDate, mood: selectedMood, content: newEntry });
    setNewEntry("");
    setSelectedMood("");
  };

  const getDayName = (dayIndex: number) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
  };

  const getMonthName = (weekIndex: number) => {
    if (weekIndex % 4 === 0) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = (new Date().getMonth() - Math.floor(weekIndex / 4)) % 12;
      return monthNames[monthIndex >= 0 ? monthIndex : monthIndex + 12];
    }
    return '';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-semibold text-foreground">
                  Mind Journal
                </h1>
                <p className="text-muted-foreground">
                  Track your emotional journey with visual insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="btn-minimal">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="btn-ghost-gold">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Entry */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-accent" />
                  <span>New Journal Entry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["Calm", "Content", "Energetic", "Overwhelmed", "Optimistic", "Reflective", "Anxious"].map((mood) => {
                    const Icon = moodIcons[mood as keyof typeof moodIcons];
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
                  })}
                </div>

                <Textarea
                  placeholder="How are you feeling today? What's on your mind?"
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="min-h-[120px] resize-none"
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {selectedMood && (
                      <span>Mood: <strong>{selectedMood}</strong></span>
                    )}
                  </div>
                  <Button 
                    onClick={handleSaveEntry}
                    disabled={!newEntry.trim() || !selectedMood}
                    className="btn-hero"
                  >
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Heatmap */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mood Heatmap - Last 12 Weeks</span>
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
                <div className="relative">
                  {/* Day labels */}
                  <div className="flex items-center mb-2">
                    <div className="w-12"></div>
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div key={dayIndex} className="w-4 text-xs text-muted-foreground text-center mr-1">
                        {dayIndex % 2 === 1 ? getDayName(dayIndex) : ''}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
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
                              title={`${day.date}: ${day.mood || 'No entry'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hover tooltip */}
                  {hoveredCell && (
                    <div className="absolute top-0 left-0 bg-popover border border-border rounded-lg p-2 shadow-lg pointer-events-none z-10">
                      <div className="text-sm font-medium">{hoveredCell.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {hoveredCell.mood || 'No entry'}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.map((entry) => {
                  const Icon = moodIcons[entry.mood as keyof typeof moodIcons];
                  return (
                    <div key={entry.id} className="p-4 bg-muted/30 rounded-lg hover-lift cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{entry.mood}</h4>
                            <p className="text-sm text-muted-foreground">{entry.date}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${moodColors[entry.intensity as keyof typeof moodColors]}`} />
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {entry.preview}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
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
                />
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span>Weekly Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Mood Trend: Improving ↗️
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your overall mood has been trending upward this week.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Most Common Mood: Content
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You've felt content 4 out of 7 days this week.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Writing Streak: 7 days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Keep it up! Daily journaling is a powerful habit.
                  </p>
                </div>

                <Button size="sm" variant="outline" className="w-full btn-minimal">
                  View Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}