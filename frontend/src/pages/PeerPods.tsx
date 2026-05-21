import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  MessageCircle, 
  Shield, 
  Heart,
  BookOpen,
  Coffee,
  Dumbbell,
  Music,
  Send,
  MoreVertical
} from "lucide-react";
import { Layout } from "@/components/Layout";

const pods = [
  {
    id: 1,
    name: "Study Support Circle",
    description: "A safe space for students dealing with academic stress and anxiety",
    members: 24,
    online: 7,
    category: "Academic",
    icon: BookOpen,
    color: "bg-primary/10 text-primary",
    joined: true,
    messages: 127,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    name: "Mindful Mornings",
    description: "Start your day with gratitude and positive intentions",
    members: 18,
    online: 3,
    category: "Mindfulness",
    icon: Coffee,
    color: "bg-accent/10 text-accent",
    joined: true,
    messages: 89,
    lastActivity: "5 hours ago",
  },
  {
    id: 3,
    name: "Wellness Warriors",
    description: "Supporting each other through fitness and mental health journeys",
    members: 31,
    online: 12,
    category: "Fitness",
    icon: Dumbbell,
    color: "bg-success/10 text-success",
    joined: false,
    messages: 203,
    lastActivity: "1 hour ago",
  },
  {
    id: 4,
    name: "Creative Healing",
    description: "Express yourself through art, music, and creative writing",
    members: 16,
    online: 4,
    category: "Creative",
    icon: Music,
    color: "bg-warning/10 text-warning",
    joined: false,
    messages: 156,
    lastActivity: "30 minutes ago",
  },
];

const recentMessages = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "SM",
    message: "Thanks everyone for the support yesterday. Your encouragement really helped me get through my presentation!",
    time: "2 hours ago",
    pod: "Study Support Circle",
    likes: 8,
  },
  {
    id: 2,
    user: "Alex K.",
    avatar: "AK",
    message: "Starting my day with 10 minutes of meditation. Anyone want to join virtually?",
    time: "3 hours ago",
    pod: "Mindful Mornings",
    likes: 5,
  },
  {
    id: 3,
    user: "Jordan P.",
    avatar: "JP",
    message: "Reminder: our group study session is tomorrow at 7 PM EST. Looking forward to seeing everyone!",
    time: "5 hours ago",
    pod: "Study Support Circle",
    likes: 12,
  },
];

export default function PeerPods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPod, setSelectedPod] = useState(pods[0]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  const filteredPods = pods.filter(pod =>
    pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinPod = (podId: number) => {
    // Simulate joining a pod
    const updatedPods = pods.map(pod =>
      pod.id === podId ? { ...pod, joined: true, members: pod.members + 1 } : pod
    );
    console.log("Joined pod:", podId);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                Peer Pods
              </h1>
              <p className="text-muted-foreground">
                Connect with supportive communities focused on mental wellness
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab("discover")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "discover"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Discover Pods
            </button>
            <button
              onClick={() => setActiveTab("my-pods")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "my-pods"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              My Pods
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === "chat"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Active Chat
            </button>
          </div>
        </div>

        {activeTab === "discover" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pods by name or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="btn-hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pod
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPods.map((pod) => {
                const Icon = pod.icon;
                return (
                  <Card key={pod.id} className="card-premium hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pod.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{pod.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {pod.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4 text-success" />
                          <span className="text-xs text-success">AI Protected</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {pod.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-muted-foreground">
                            {pod.members} members
                          </span>
                          <span className="text-success">
                            {pod.online} online
                          </span>
                        </div>
                        <span className="text-muted-foreground">
                          {pod.lastActivity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {pod.messages} messages
                          </span>
                        </div>
                        
                        {pod.joined ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPod(pod)}
                            className="btn-minimal"
                          >
                            View Pod
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleJoinPod(pod.id)}
                            className="btn-hero"
                          >
                            Join Pod
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "my-pods" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pods.filter(pod => pod.joined).map((pod) => {
              const Icon = pod.icon;
              return (
                <Card key={pod.id} className="card-warm hover-lift">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pod.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <CardTitle className="text-base">{pod.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-success">{pod.online} online</span>
                      <span className="text-muted-foreground">{pod.lastActivity}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full btn-minimal"
                      onClick={() => setActiveTab("chat")}
                    >
                      Enter Pod
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedPod.color}`}>
                      <selectedPod.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedPod.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedPod.online} members online
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                          {message.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-foreground">
                            {message.user}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {message.message}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            {message.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2 pt-4 border-t border-border/30">
                  <Input
                    placeholder="Share your thoughts with the pod..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={sendMessage} className="btn-hero">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pod Members Sidebar */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-base">Pod Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-muted">
                          {String.fromCharCode(65 + index)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border border-background" />
                    </div>
                    <span className="text-sm text-foreground">Member {index + 1}</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs btn-minimal">
                  View All Members
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}