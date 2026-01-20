import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MessageCircle,
  Phone,
  Star,
  Lock,
  User,
  CheckCircle,
  X
} from "lucide-react";
import { Layout } from "@/components/Layout";

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Student Stress"],
    rating: 4.9,
    sessions: 847,
    avatar: "/api/placeholder/80/80",
    availability: "Available today",
    nextSlot: "2:00 PM",
    languages: ["English", "Mandarin"],
    approach: "Cognitive Behavioral Therapy (CBT)"
  },
  {
    id: 2,
    name: "Dr. Marcus Johnson", 
    title: "Licensed Therapist",
    specialties: ["Academic Pressure", "Social Anxiety", "ADHD"],
    rating: 4.8,
    sessions: 623,
    avatar: "/api/placeholder/80/80",
    availability: "Available tomorrow",
    nextSlot: "10:30 AM",
    languages: ["English", "Spanish"],
    approach: "Mindfulness-Based Therapy"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Mental Health Counselor", 
    specialties: ["Relationship Issues", "Self-esteem", "Life Transitions"],
    rating: 4.9,
    sessions: 1024,
    avatar: "/api/placeholder/80/80",
    availability: "Available today",
    nextSlot: "4:15 PM", 
    languages: ["English", "Spanish", "Portuguese"],
    approach: "Humanistic Therapy"
  },
  {
    id: 4,
    name: "Dr. Ahmed Hassan",
    title: "Psychiatric Specialist",
    specialties: ["Trauma", "PTSD", "Crisis Intervention"],
    rating: 4.7,
    sessions: 456,
    avatar: "/api/placeholder/80/80",
    availability: "Available in 2 days",
    nextSlot: "1:00 PM",
    languages: ["English", "Arabic", "French"],
    approach: "EMDR & Trauma-Informed Care"
  }
];

const sessionTypes = [
  {
    id: "video",
    name: "Video Session",
    description: "Face-to-face video call with encrypted connection",
    duration: "50 minutes",
    price: "Free for students",
    icon: Video
  },
  {
    id: "chat",
    name: "Anonymous Chat",
    description: "Text-based session with complete anonymity",
    duration: "45 minutes", 
    price: "Free for students",
    icon: MessageCircle
  },
  {
    id: "crisis",
    name: "Crisis Support",
    description: "Immediate support for urgent situations",
    duration: "Available 24/7",
    price: "Always free",
    icon: Phone
  }
];

export default function CounselorCare() {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("video");
  const [bookingStep, setBookingStep] = useState(1); // 1: Select counselor, 2: Choose time, 3: Confirm
  const [reason, setReason] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const availableSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", 
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const handleBookSession = () => {
    // Simulate booking
    setTimeout(() => {
      setBookingStep(4); // Success step
    }, 1500);
  };

  if (bookingStep === 4) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Card className="card-warm">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success-foreground" />
              </div>
              
              <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">
                Session Booked Successfully!
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Your confidential session with {selectedCounselor?.name} has been scheduled for {selectedTime} on {selectedDate?.toLocaleDateString()}.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>End-to-end encrypted</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Completely anonymous</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => window.location.href = "/dashboard"} className="btn-hero">
                  Return to Dashboard
                </Button>
                <Button variant="outline" onClick={() => setBookingStep(1)} className="btn-minimal">
                  Book Another Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                Confidential Care Bridge
              </h1>
              <p className="text-muted-foreground">
                Anonymous, encrypted sessions with licensed mental health professionals
              </p>
            </div>
          </div>

          {/* Privacy Assurance */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <Lock className="w-4 h-4" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <User className="w-4 h-4" />
              <span>Anonymous Sessions Available</span>
            </div>
          </div>
        </div>

        {bookingStep === 1 && (
          <>
            {/* Session Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sessionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id}
                    className={`card-premium cursor-pointer hover-lift transition-all ${
                      sessionType === type.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSessionType(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="font-serif font-semibold text-foreground mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {type.description}
                      </p>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {type.duration}
                        </Badge>
                        <p className="text-xs text-success font-medium">
                          {type.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Counselor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {counselors.map((counselor) => (
                <Card key={counselor.id} className="card-premium hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={counselor.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {counselor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-foreground mb-1">
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {counselor.title}
                        </p>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                            <span className="text-sm font-medium">{counselor.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({counselor.sessions} sessions)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs">
                          <Badge variant={counselor.availability.includes("today") ? "default" : "secondary"}>
                            {counselor.availability}
                          </Badge>
                          <span className="text-muted-foreground">
                            Next: {counselor.nextSlot}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Approach</p>
                        <p className="text-sm text-foreground">{counselor.approach}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Languages</p>
                        <p className="text-sm text-foreground">{counselor.languages.join(", ")}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedCounselor(counselor);
                        setBookingStep(2);
                      }}
                      className="w-full mt-6 btn-hero"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {bookingStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Schedule Your Session</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Select Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-lg border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Available Times</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                          className={selectedTime === slot ? "btn-hero" : "btn-minimal"}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>

                    {/* Session Details */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Session Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{selectedCounselor?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>50 minutes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Anonymous & Encrypted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Reason */}
                <div className="mt-8">
                  <h3 className="font-medium text-foreground mb-4">
                    What would you like to focus on? (Optional)
                  </h3>
                  <Textarea
                    placeholder="Share what's on your mind or what you'd like to work on during this session..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This information helps your counselor prepare, but you can discuss anything during your session.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setBookingStep(1)}
                    className="btn-minimal"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={() => setBookingStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-hero"
                  >
                    Continue to Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle>Confirm Your Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Summary */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium text-foreground mb-3">Session Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Counselor:</span>
                      <span className="font-medium">{selectedCounselor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">50 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{sessionType} Session</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-medium text-primary mb-2">Privacy & Security</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your session will be completely confidential</li>
                    <li>• All communications are end-to-end encrypted</li>
                    <li>• You can choose to remain anonymous</li>
                    <li>• No session recordings are stored</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setBookingStep(2)}
                    className="btn-minimal"
                  >
                    Back to Scheduling
                  </Button>

                  <Button
                    onClick={handleBookSession}
                    className="btn-hero"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}