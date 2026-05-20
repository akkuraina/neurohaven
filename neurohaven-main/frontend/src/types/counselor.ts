export type CounselorDto = {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  sessionsCount: number;
  avatarUrl: string;
  languages: string[];
  approach: string;
  phone: string;
  whatsappUrl: string;
  availability: string;
  nextSlot: string;
};

export type SessionBookingDto = {
  id: string;
  sessionType: "video" | "chat";
  scheduledStart: string;
  scheduledEnd: string;
  timeSlotLabel: string;
  reason: string;
  isAnonymous: boolean;
  meetLink: string;
  status: string;
  counselor: {
    id: string;
    name: string;
    title: string;
    phone: string;
    whatsappUrl: string;
  } | null;
  createdAt: string;
};
