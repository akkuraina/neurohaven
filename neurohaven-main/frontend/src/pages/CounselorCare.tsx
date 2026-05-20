import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Calendar as CalendarIcon,
  Video,
  MessageCircle,
  Star,
  Lock,
  User,
  CheckCircle,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { authPost } from "@/lib/authApi";
import { formatLocalDayKey } from "@/lib/journalUtils";
import type { CounselorDto, SessionBookingDto } from "@/types/counselor";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ALL_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const sessionTypes = [
  {
    id: "video" as const,
    name: "Video Session",
    description: "Google Meet video call with your counselor",
    duration: "50 minutes",
    price: "Free for students",
    icon: Video,
  },
  {
    id: "chat" as const,
    name: "Chat Session",
    description: "Message your counselor on WhatsApp",
    duration: "45 minutes",
    price: "Free for students",
    icon: MessageCircle,
  },
];

export default function CounselorCare() {
  const [counselors, setCounselors] = useState<CounselorDto[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<CounselorDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState<"video" | "chat">("video");
  const [bookingStep, setBookingStep] = useState(1);
  const [reason, setReason] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<SessionBookingDto | null>(null);

  const loadCounselors = useCallback(async () => {
    setLoadingCounselors(true);
    try {
      const res = await fetch(`${API_BASE}/api/counselors`);
      if (!res.ok) throw new Error("Failed to load counselors");
      const data = (await res.json()) as { counselors: CounselorDto[] };
      setCounselors(data.counselors || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load counselors");
      setCounselors([]);
    } finally {
      setLoadingCounselors(false);
    }
  }, []);

  useEffect(() => {
    void loadCounselors();
  }, [loadCounselors]);

  useEffect(() => {
    if (!selectedCounselor || !selectedDate) {
      setBookedSlots([]);
      return;
    }
    const dayKey = formatLocalDayKey(selectedDate);
    setLoadingSlots(true);
    fetch(`${API_BASE}/api/counselors/${selectedCounselor.id}/slots?date=${dayKey}`)
      .then((r) => r.json())
      .then((d: { bookedSlots?: string[] }) => setBookedSlots(d.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedCounselor, selectedDate]);

  const availableSlots = ALL_SLOTS.filter((s) => !bookedSlots.includes(s));

  const handleBookSession = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const res = await authPost(
        "/api/counselors/bookings",
        {
          counselorId: selectedCounselor.id,
          sessionType,
          dayKey: formatLocalDayKey(selectedDate),
          timeSlot: selectedTime,
          reason: reason.trim() || undefined,
          isAnonymous,
        },
        true
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((body as { error?: string }).error || "Booking failed");
      setConfirmedBooking((body as { booking: SessionBookingDto }).booking);
      setBookingStep(4);
      toast.success("Session booked");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedCounselor(null);
    setSelectedTime("");
    setReason("");
    setConfirmedBooking(null);
  };

  const openWhatsApp = (url: string) => {
    if (!url) {
      toast.error("No WhatsApp number for this counselor");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (bookingStep === 4 && confirmedBooking) {
    const c = confirmedBooking.counselor;
    const wa = c?.whatsappUrl || selectedCounselor?.whatsappUrl || "";

    return (
      <Layout>
        <BookingSuccess
          booking={confirmedBooking}
          counselorName={c?.name || selectedCounselor?.name || "your counselor"}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onReset={resetBooking}
          openWhatsApp={openWhatsApp}
          whatsappUrl={wa}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                Confidential Care Bridge
              </h1>
              <p className="text-muted-foreground">
                Book sessions with licensed professionals — video via Google Meet or chat on WhatsApp
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 text-primary">
              <Shield className="w-4 h-4" />
              <span>HIPAA-minded practices</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <Lock className="w-4 h-4" />
              <span>Encrypted video (Google Meet)</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <User className="w-4 h-4" />
              <span>Anonymous sessions available</span>
            </div>
          </div>
        </header>

        {bookingStep === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                      <h3 className="font-serif font-semibold text-foreground mb-2">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {type.duration}
                      </Badge>
                      <p className="text-xs text-success font-medium mt-2">{type.price}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {loadingCounselors ? (
              <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading counselors…
              </div>
            ) : counselors.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No counselors available.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {counselors.map((counselor) => (
                  <Card key={counselor.id} className="card-premium hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Avatar className="w-16 h-16">
                          {counselor.avatarUrl ? (
                            <AvatarImage src={counselor.avatarUrl} alt={counselor.name} />
                          ) : null}
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {counselor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-semibold text-foreground mb-1">
                            {counselor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">{counselor.title}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                            <span className="text-sm font-medium">{counselor.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({counselor.sessionsCount} sessions)
                            </span>
                          </div>
                          <Badge
                            variant={
                              counselor.availability.toLowerCase().includes("today")
                                ? "default"
                                : "secondary"
                            }
                          >
                            {counselor.availability}
                          </Badge>
                          <span className="text-sm text-muted-foreground ml-2">
                            Next: {counselor.nextSlot}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialties.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-foreground">{counselor.approach}</p>
                        <p className="text-sm text-muted-foreground">
                          {counselor.languages.join(", ")}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => openWhatsApp(counselor.whatsappUrl)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat on WhatsApp
                        </Button>
                        <Button
                          className="flex-1 btn-hero"
                          onClick={() => {
                            setSelectedCounselor(counselor);
                            setBookingStep(2);
                          }}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Book Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {bookingStep === 2 && selectedCounselor && (
          <div className="max-w-4xl mx-auto">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Schedule with {selectedCounselor.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Select Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => {
                        setSelectedDate(d);
                        setSelectedTime("");
                      }}
                      className="rounded-lg border"
                      disabled={(date) => {
                        const t = new Date();
                        t.setHours(0, 0, 0, 0);
                        return date < t;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Available Times</h3>
                    {loadingSlots ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : availableSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No slots left this day. Pick another date.
                      </p>
                    ) : (
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
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-foreground mb-4">Focus for this session (optional)</h3>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="What would you like to work on?"
                    className="min-h-[100px]"
                  />
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  Book anonymously
                </label>

                <div className="flex items-center justify-between mt-8">
                  <Button variant="outline" onClick={() => setBookingStep(1)} className="btn-minimal">
                    <X className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setBookingStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-hero"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {bookingStep === 3 && selectedCounselor && (
          <div className="max-w-2xl mx-auto">
            <Card className="card-warm">
              <CardHeader>
                <CardTitle>Confirm Your Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Counselor</span>
                    <span className="font-medium">{selectedCounselor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-medium capitalize">{sessionType}</span>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button variant="outline" onClick={() => setBookingStep(2)} className="btn-minimal">
                    Back
                  </Button>
                  <Button
                    onClick={() => void handleBookSession()}
                    disabled={submitting}
                    className="btn-hero"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Booking…
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
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

function BookingSuccess({
  booking,
  counselorName,
  selectedDate,
  selectedTime,
  onReset,
  openWhatsApp,
  whatsappUrl,
}: {
  booking: SessionBookingDto;
  counselorName: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  onReset: () => void;
  openWhatsApp: (url: string) => void;
  whatsappUrl: string;
}) {
  return (
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
            Your session with {counselorName} is scheduled for {selectedTime} on{" "}
            {selectedDate?.toLocaleDateString()}.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {booking.sessionType === "video" && booking.meetLink && (
              <Button asChild className="btn-hero w-full">
                <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                  <Video className="w-4 h-4 mr-2" />
                  Join Google Meet
                  <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
                </a>
              </Button>
            )}
            {booking.sessionType === "chat" && (
              <p className="text-sm text-muted-foreground">
                Use WhatsApp below to message your counselor at the scheduled time.
              </p>
            )}
            {whatsappUrl && (
              <Button variant="outline" className="w-full" onClick={() => openWhatsApp(whatsappUrl)}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => (window.location.href = "/dashboard")} className="btn-hero">
              Return to Dashboard
            </Button>
            <Button variant="outline" onClick={onReset} className="btn-minimal">
              Book Another Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
