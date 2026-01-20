import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Trees, 
  Waves, 
  Mountain, 
  Sun, 
  Moon,
  Timer,
  Settings,
  Headphones
} from "lucide-react";
import { Layout } from "@/components/Layout";

const environments = [
  {
    id: "forest",
    name: "Ancient Forest",
    description: "Immerse yourself in a peaceful woodland with gentle bird songs and rustling leaves.",
    duration: "5-60 min",
    difficulty: "Beginner",
    icon: Trees,
    color: "text-success",
    background: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    sessions: 1247,
    rating: 4.9
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    description: "Find tranquility with rhythmic ocean sounds and gentle sea breeze visualization.",
    duration: "10-45 min",
    difficulty: "Beginner", 
    icon: Waves,
    color: "text-blue-500",
    background: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    sessions: 2156,
    rating: 4.8
  },
  {
    id: "mountain",
    name: "Mountain Peak",
    description: "Experience serenity at a mountain summit with panoramic views and fresh air.",
    duration: "15-90 min",
    difficulty: "Intermediate",
    icon: Mountain,
    color: "text-slate-500",
    background: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900",
    sessions: 892,
    rating: 4.7
  },
  {
    id: "sunrise",
    name: "Golden Sunrise",
    description: "Start your day with a beautiful sunrise meditation and energizing light therapy.",
    duration: "8-30 min",
    difficulty: "Beginner",
    icon: Sun,
    color: "text-amber-500",
    background: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900",
    sessions: 1534,
    rating: 4.9
  },
  {
    id: "moonlight",
    name: "Moonlight Garden",
    description: "Unwind with a peaceful nighttime garden scene under soft moonlight.",
    duration: "12-60 min",
    difficulty: "Intermediate",
    icon: Moon,
    color: "text-indigo-500",
    background: "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900",
    sessions: 743,
    rating: 4.6
  }
];

const sessionTypes = [
  { name: "Breathing Exercise", duration: "5 min", icon: Heart },
  { name: "Body Scan", duration: "15 min", icon: Settings },
  { name: "Mindful Observation", duration: "10 min", icon: Headphones },
  { name: "Loving Kindness", duration: "20 min", icon: Heart }
];

export default function Calmscapes() {
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);

  const startSession = (env) => {
    setSelectedEnvironment(env);
    setIsPlaying(true);
    setSessionProgress(0);
    setSessionTime(0);
    
    // Simulate session progress
    const interval = setInterval(() => {
      setSessionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + (100 / (selectedDuration * 60)) * 1; // 1 second intervals
      });
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
            Calmscapes VR/AR
          </h1>
          <p className="text-muted-foreground">
            Immersive meditation environments for deep relaxation and mindfulness
          </p>
        </div>

        {selectedEnvironment ? (
          // Active Session View
          <div className="space-y-6">
            <Card className="card-warm">
              <CardContent className="p-8 text-center">
                <div className={`w-full h-64 rounded-lg ${selectedEnvironment.background} flex items-center justify-center mb-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <selectedEnvironment.icon className={`w-24 h-24 ${selectedEnvironment.color} relative z-10`} />
                </div>
                
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                  {selectedEnvironment.name}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {selectedEnvironment.description}
                </p>

                {/* Session Controls */}
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={togglePlayPause}
                      size="lg"
                      className="w-16 h-16 rounded-full btn-hero"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTime(sessionTime)}</span>
                      <span>{formatTime(selectedDuration * 60)}</span>
                    </div>
                    <Progress value={sessionProgress} className="h-2" />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedEnvironment(null);
                      setIsPlaying(false);
                      setSessionProgress(0);
                      setSessionTime(0);
                    }}
                  >
                    End Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Types During Active Session */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Guided Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sessionTypes.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-16 flex-col space-y-1 btn-minimal"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{type.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Environment Selection View
          <>
            {/* Duration Selector */}
            <Card className="card-premium mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="w-5 h-5" />
                  <span>Session Duration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[5, 10, 15, 20, 30, 45, 60].map((duration) => (
                    <Button
                      key={duration}
                      variant={selectedDuration === duration ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDuration(duration)}
                      className={selectedDuration === duration ? "btn-hero" : "btn-minimal"}
                    >
                      {duration} min
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <Card key={env.id} className="card-premium hover-lift overflow-hidden">
                    <div className={`h-48 ${env.background} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <Icon className={`w-16 h-16 ${env.color} relative z-10`} />
                      
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {env.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 text-xs text-white">
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{env.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                        {env.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {env.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{env.duration}</span>
                        <span>{env.sessions.toLocaleString()} sessions</span>
                      </div>
                      
                      <Button
                        onClick={() => startSession(env)}
                        className="w-full btn-hero"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Session History */}
            <Card className="card-premium mt-8">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { env: "Ocean Waves", duration: "15 min", date: "Today", mood: "Relaxed" },
                    { env: "Ancient Forest", duration: "20 min", date: "Yesterday", mood: "Peaceful" },
                    { env: "Mountain Peak", duration: "30 min", date: "2 days ago", mood: "Centered" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{session.env}</p>
                        <p className="text-sm text-muted-foreground">{session.date} • {session.duration}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {session.mood}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}