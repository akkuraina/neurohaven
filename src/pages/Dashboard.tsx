import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Calendar, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  Heart, 
  MessageCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Settings,
  Bell,
  Target,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import SilentSOS from "@/components/SilentSOS";
import { getAuth } from "firebase/auth";

const quickStats = [
  { title: "Wellness Score", value: "84%", change: "+12%", icon: Activity, color: "text-success" },
  { title: "Mood Streak", value: "7 days", change: "Personal best", icon: Heart, color: "text-accent" },
  { title: "Active Pods", value: "3", change: "2 new messages", icon: Users, color: "text-primary" },
  { title: "Sessions Completed", value: "12", change: "+3 this week", icon: Brain, color: "text-primary" },
];

const recentActivities = [
  { type: "mood", title: "Mood logged: Optimistic", time: "2 hours ago", icon: Heart, color: "bg-success/10 text-success" },
  { type: "pod", title: "New message in Study Support Pod", time: "4 hours ago", icon: MessageCircle, color: "bg-primary/10 text-primary" },
  { type: "session", title: "Completed VR meditation session", time: "Yesterday", icon: Brain, color: "bg-accent/10 text-accent" },
  { type: "journal", title: "Journal entry: Gratitude practice", time: "2 days ago", icon: BookOpen, color: "bg-muted text-muted-foreground" },
];

const aiInsights = [
  { title: "Your stress levels tend to peak on Tuesdays", suggestion: "Consider scheduling your meditation sessions on Monday evenings", confidence: 89 },
  { title: "You're most positive after peer pod interactions", suggestion: "Try engaging more in your Study Support Pod", confidence: 76 },
  { title: "Your sleep quality affects next-day mood significantly", suggestion: "Focus on your evening routine this week", confidence: 94 },
];

export default function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "mood", message: "Time for your daily mood check-in", time: "10 min ago", read: false },
    { id: 2, type: "pod", message: "New message in Study Support Pod", time: "2 hours ago", read: false },
    { id: 3, type: "session", message: "VR meditation session completed", time: "1 day ago", read: true }
  ]);
  const [goals, setGoals] = useState([
    { id: 1, title: "Daily Meditation", current: 4, target: 7, unit: "sessions" },
    { id: 2, title: "Mood Logging", current: 6, target: 7, unit: "days" },
    { id: 3, title: "Peer Connections", current: 8, target: 10, unit: "interactions" }
  ]);

  const auth = getAuth();
  const user = auth.currentUser;

  const handleNotificationAction = (id: number, action: string) => {
    if (action === "dismiss") {
      setNotifications(prev => prev.filter(n => n.id !== id));
    } else if (action === "mark-read") {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleSOSAlert = () => {
    console.log("SOS Alert triggered - emergency support initiated");
  };

  return (
    <Layout>
      <SilentSOS onEmergencyCall={handleSOSAlert} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">
            Welcome back, {user?.displayName || user?.email || "User"}
          </h1>
          <p className="text-muted-foreground">
            Here's your mental wellness overview for today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-premium hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-serif font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-accent" />
                    <span>Notifications</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {notifications.filter(n => !n.read).length} new
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                    notification.read ? 'bg-muted/20' : 'bg-accent/5 border-accent/20'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button size="sm" variant="ghost" onClick={() => handleNotificationAction(notification.id, 'mark-read')} className="text-xs">Mark read</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleNotificationAction(notification.id, 'dismiss')} className="text-xs">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-accent" />
                  <span>Weekly Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">{goal.current} of {goal.target} {goal.unit}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-primary">{Math.round((goal.current / goal.target) * 100)}%</span>
                      </div>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full btn-minimal">
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Goals
                </Button>
              </CardContent>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span>EmotionTwin AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{insight.suggestion}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                          <Progress value={insight.confidence} className="w-20 h-1" />
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="btn-minimal hover-lift">Apply</Button>
                    </div>
                    {index < aiInsights.length - 1 && <hr className="border-border/30" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link to="/emotion-twin">
                    <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                      <Brain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-medium">Log Mood</span>
                        <p className="text-xs text-muted-foreground">AI Analysis</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/journal">
                    <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                      <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-medium">Write Journal</span>
                        <p className="text-xs text-muted-foreground">Daily Reflection</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/calmscapes">
                    <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                      <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-medium">Start Session</span>
                        <p className="text-xs text-muted-foreground">VR Meditation</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/peer-pods">
                    <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                      <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-medium">Join Pod</span>
                        <p className="text-xs text-muted-foreground">Connect & Share</p>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/counselor">
                    <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                      <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <div className="text-center">
                        <span className="text-sm font-medium">Book Session</span>
                        <p className="text-xs text-muted-foreground">Counselor Care</p>
                      </div>
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-24 flex-col space-y-2 hover-lift group">
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <span className="text-sm font-medium">More Actions</span>
                      <p className="text-xs text-muted-foreground">Explore Features</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Meditation Sessions</span>
                    <span className="text-sm text-muted-foreground">4/7</span>
                  </div>
                  <Progress value={57} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  You're doing great! Complete 3 more sessions to reach your weekly goal.
                </p>
                <Button size="sm" className="w-full btn-hero">
                  Start Session
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
