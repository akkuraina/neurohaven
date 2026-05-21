import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Heart, 
  Brain, 
  Phone, 
  MessageCircle, 
  Shield,
  Clock,
  CheckCircle,
  X,
  Zap
} from "lucide-react";

interface SOSAlert {
  id: string;
  type: "inactivity" | "stress" | "emergency" | "wellness_check";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  suggestions: string[];
  timestamp: Date;
  resolved: boolean;
}

interface SilentSOSProps {
  onDismiss?: (id: string) => void;
  onEmergencyCall?: () => void;
}

export default function SilentSOS({ onDismiss, onEmergencyCall }: SilentSOSProps) {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [stressLevel, setStressLevel] = useState(35);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingCycle, setBreathingCycle] = useState(0); // 0: inhale, 1: hold, 2: exhale

  // Simulate stress monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate stress level fluctuation
      setStressLevel(prev => {
        const change = Math.random() * 10 - 5; // -5 to +5
        const newLevel = Math.max(0, Math.min(100, prev + change));
        
        // Generate alerts based on stress level
        if (newLevel > 70 && prev <= 70) {
          const newAlert: SOSAlert = {
            id: Date.now().toString(),
            type: "stress",
            severity: newLevel > 85 ? "high" : "medium",
            message: "Elevated stress levels detected",
            suggestions: [
              "Take a 5-minute breathing break",
              "Try a quick meditation",
              "Step away from your current task",
              "Reach out to a friend or counselor"
            ],
            timestamp: new Date(),
            resolved: false
          };
          
          setAlerts(prev => [...prev, newAlert]);
        }
        
        return newLevel;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate inactivity detection
  useEffect(() => {
    const checkInactivity = () => {
      const now = new Date();
      const inactiveMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
      
      if (inactiveMinutes > 30) { // 30 minutes of inactivity
        const newAlert: SOSAlert = {
          id: Date.now().toString(),
          type: "inactivity",
          severity: "low",
          message: "You've been inactive for a while",
          suggestions: [
            "Take a short walk",
            "Do some light stretching", 
            "Grab a glass of water",
            "Check in with yourself"
          ],
          timestamp: now,
          resolved: false
        };
        
        setAlerts(prev => [...prev, newAlert]);
        setLastActivity(now); // Reset to prevent spam
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastActivity]);

  const handleBreathingExercise = () => {
    setShowBreathingExercise(true);
    
    // 4-7-8 breathing pattern
    const breathingPattern = [
      { phase: "Inhale", duration: 4000, instruction: "Breathe in slowly..." },
      { phase: "Hold", duration: 7000, instruction: "Hold your breath..." },
      { phase: "Exhale", duration: 8000, instruction: "Exhale slowly..." }
    ];
    
    let currentCycle = 0;
    
    const runCycle = () => {
      setBreathingCycle(currentCycle);
      
      setTimeout(() => {
        currentCycle = (currentCycle + 1) % 3;
        if (currentCycle === 0) {
          // Completed one full cycle
          setTimeout(() => {
            setShowBreathingExercise(false);
            setStressLevel(prev => Math.max(10, prev - 15)); // Reduce stress
          }, 1000);
        } else {
          runCycle();
        }
      }, breathingPattern[currentCycle].duration);
    };
    
    runCycle();
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    onDismiss?.(alertId);
  };

  const handleEmergencyContact = () => {
    const emergencyAlert: SOSAlert = {
      id: Date.now().toString(),
      type: "emergency",
      severity: "critical",
      message: "Emergency counselor has been notified",
      suggestions: [
        "A counselor will contact you within 5 minutes",
        "Please stay in a safe location",
        "Keep your phone nearby"
      ],
      timestamp: new Date(),
      resolved: false
    };
    
    setAlerts(prev => [...prev, emergencyAlert]);
    onEmergencyCall?.();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return AlertTriangle;
      case "high": return AlertTriangle;
      case "medium": return Clock;
      default: return Shield;
    }
  };

  if (showBreathingExercise) {
    const breathingInstructions = [
      "Breathe in slowly through your nose...",
      "Hold your breath gently...",
      "Exhale slowly through your mouth..."
    ];
    
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="card-warm w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20">
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000 ${
                    breathingCycle === 0 ? 'scale-110' : breathingCycle === 1 ? 'scale-110' : 'scale-75'
                  }`}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              Breathing Exercise
            </h3>
            
            <p className="text-muted-foreground mb-4">
              {breathingInstructions[breathingCycle]}
            </p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBreathingExercise(false)}
              className="btn-minimal"
            >
              Skip
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Stress Monitor - Always visible in corner */}
      <div className="fixed bottom-4 left-4 z-40">
        <Card className="card-premium w-64">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Stress Level</span>
              <span className="text-xs text-muted-foreground">{Math.round(stressLevel)}%</span>
            </div>
            <Progress value={stressLevel} className="h-2 mb-3" />
            
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBreathingExercise}
                className="btn-minimal text-xs"
              >
                <Heart className="w-3 h-3 mr-1" />
                Quick Calm
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleEmergencyContact}
                className="btn-minimal text-xs"
              >
                <Phone className="w-3 h-3 mr-1" />
                SOS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
        {alerts.slice(-3).map((alert) => {
          const SeverityIcon = getSeverityIcon(alert.severity);
          
          return (
            <Card 
              key={alert.id} 
              className={`card-premium border-2 ${getSeverityColor(alert.severity)} animate-fade-in`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-sm">
                  <SeverityIcon className="w-4 h-4" />
                  <span className="capitalize">{alert.type.replace("_", " ")} Alert</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolveAlert(alert.id)}
                    className="ml-auto p-1 h-auto"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-foreground mb-3">{alert.message}</p>
                
                <div className="space-y-2">
                  {alert.suggestions.slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="w-full text-xs btn-minimal hover-lift"
                      onClick={() => {
                        if (suggestion.includes("breathing")) {
                          handleBreathingExercise();
                        }
                        handleResolveAlert(alert.id);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>{alert.timestamp.toLocaleTimeString()}</span>
                  {alert.type === "emergency" && (
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Active</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency Resources - Always accessible */}
      <div className="fixed bottom-4 right-4 z-40">
        <Card className="card-premium">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open("tel:988", "_self")}
                className="btn-minimal"
              >
                <Phone className="w-3 h-3 mr-1" />
                Crisis Line
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = "/counselor"}
                className="btn-minimal"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Counselor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}