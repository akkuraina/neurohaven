import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Mic, 
  Send, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Lightbulb,
  Calendar
} from "lucide-react";
import { Layout } from "@/components/Layout";

const moodHistory = [
  { date: "Today", mood: "Optimistic", score: 82, color: "bg-success" },
  { date: "Yesterday", mood: "Neutral", score: 65, color: "bg-muted" },
  { date: "2 days ago", mood: "Anxious", score: 42, color: "bg-warning" },
  { date: "3 days ago", mood: "Content", score: 78, color: "bg-success" },
  { date: "4 days ago", mood: "Overwhelmed", score: 35, color: "bg-destructive" },
];

const aiSuggestions = [
  {
    type: "meditation",
    title: "5-Minute Breathing Exercise",
    description: "Your stress indicators suggest a short breathing exercise would help",
    confidence: 94,
    icon: Heart,
  },
  {
    type: "activity",
    title: "Take a Walking Break",
    description: "Movement can help shift your current emotional state",
    confidence: 87,
    icon: TrendingUp,
  },
  {
    type: "connection",
    title: "Connect with Study Support Pod",
    description: "Your peers in this pod often help improve your mood",
    confidence: 76,
    icon: Brain,
  },
];

export default function EmotionTwin() {
  const [moodText, setMoodText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState({ mood: "", score: 0, insights: [] });

  const handleSubmitMood = async () => {
    if (!moodText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const moods = ["Optimistic", "Content", "Neutral", "Anxious", "Overwhelmed"];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const score = Math.floor(Math.random() * 40) + 40; // 40-80 range
      
      setCurrentMood({
        mood: randomMood,
        score,
        insights: [
          "Your language suggests moderate stress levels",
          "Positive outlook detected in your reflection",
          "Consider focusing on self-care this evening"
        ]
      });
      
      setIsAnalyzing(false);
      setMoodText("");
    }, 2000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setMoodText("I'm feeling a bit overwhelmed with my coursework today, but I'm trying to stay positive and take things one step at a time.");
    }, 3000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                EmotionTwin AI
              </h1>
              <p className="text-muted-foreground">
                Your intelligent companion for emotional wellness
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Input */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Share your thoughts, feelings, or what's on your mind today..."
                    value={moodText}
                    onChange={(e) => setMoodText(e.target.value)}
                    className="min-h-[120px] pr-12 resize-none"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute bottom-3 right-3 ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={startVoiceRecording}
                    disabled={isRecording}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {isRecording && (
                      <>
                        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                        <span>Recording...</span>
                      </>
                    )}
                    {isAnalyzing && (
                      <>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>Analyzing your mood...</span>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitMood}
                    disabled={!moodText.trim() || isAnalyzing}
                    className="btn-hero"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Analyze Mood
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Analysis */}
            {currentMood.mood && (
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Current Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-semibold text-foreground">
                        {currentMood.mood}
                      </h3>
                      <p className="text-muted-foreground">Emotional state detected</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-primary">
                        {currentMood.score}%
                      </div>
                      <p className="text-sm text-muted-foreground">Wellness score</p>
                    </div>
                  </div>

                  <Progress value={currentMood.score} className="h-2" />

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">AI Insights:</h4>
                    {currentMood.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Suggestions */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span>Personalized Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover-lift">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.confidence}% match
                          </Badge>
                          <Button size="sm" variant="outline" className="btn-minimal">
                            Try Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Timeline */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Mood Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${entry.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {entry.mood}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.score}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Insights */}
            <Card className="card-warm">
              <CardHeader>
                <CardTitle>Weekly Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm">Mood trending upward</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your best days are typically Fridays and weekends.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Stress peaks around Tuesday afternoons.
                  </p>
                </div>

                <Button size="sm" variant="outline" className="w-full btn-minimal">
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}