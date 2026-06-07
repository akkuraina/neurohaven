import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, MessageCircle, Heart, Calendar, Brain } from "lucide-react";

interface Notification {
  id: number;
  type: "mood" | "pod" | "session" | "counselor" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "mood",
      title: "Daily Check-in Reminder",
      message: "Time for your daily mood logging with EmotionTwin AI",
      time: "10 minutes ago",
      read: false,
      actionable: true,
      actionText: "Log Mood",
      actionUrl: "/emotion-twin"
    },
    {
      id: 2,
      type: "pod",
      title: "New Pod Message",
      message: "Sarah shared helpful study tips in Study Support Pod",
      time: "2 hours ago",
      read: false,
      actionable: true,
      actionText: "View Pod",
      actionUrl: "/peer-pods"
    },
    {
      id: 3,
      type: "session",
      title: "Session Completed",
      message: "Great job completing your 15-minute ocean meditation!",
      time: "1 day ago",
      read: true,
      actionable: false
    },
    {
      id: 4,
      type: "counselor",
      title: "Upcoming Appointment",
      message: "Session with Dr. Chen tomorrow at 2:00 PM",
      time: "2 days ago",
      read: false,
      actionable: true,
      actionText: "View Details",
      actionUrl: "/counselor"
    },
    {
      id: 5,
      type: "system",
      title: "Weekly Report Ready",
      message: "Your wellness insights and progress report is available",
      time: "3 days ago",
      read: true,
      actionable: true,
      actionText: "View Report",
      actionUrl: "/dashboard"
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mood": return Heart;
      case "pod": return MessageCircle;
      case "session": return Brain;
      case "counselor": return Calendar;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "mood": return "text-red-500";
      case "pod": return "text-blue-500";
      case "session": return "text-green-500";
      case "counselor": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-end p-4">
      <Card className="card-premium w-full max-w-md mt-16 max-h-[80vh] overflow-hidden">
        <CardHeader className="border-b border-border/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-border/20 hover:bg-muted/20 transition-all ${
                      !notification.read ? 'bg-accent/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-full bg-muted ${iconColor}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 h-auto opacity-60 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {notification.actionable && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6 px-2"
                                onClick={() => {
                                  markAsRead(notification.id);
                                  if (notification.actionUrl) {
                                    window.location.href = notification.actionUrl;
                                  }
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs h-6 px-2"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}