import Counselor from "../models/Counselor.js";

const DEFAULT_COUNSELORS = [
  {
    name: "Dr. Sarah Chen",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Student Stress"],
    rating: 4.9,
    sessionsCount: 847,
    languages: ["English", "Mandarin"],
    approach: "Cognitive Behavioral Therapy (CBT)",
    phone: "15551234001",
    availabilityNote: "Available today",
    nextSlotHint: "2:00 PM",
  },
  {
    name: "Dr. Marcus Johnson",
    title: "Licensed Therapist",
    specialties: ["Academic Pressure", "Social Anxiety", "ADHD"],
    rating: 4.8,
    sessionsCount: 623,
    languages: ["English", "Spanish"],
    approach: "Mindfulness-Based Therapy",
    phone: "15551234002",
    availabilityNote: "Available tomorrow",
    nextSlotHint: "10:30 AM",
  },
  {
    name: "Dr. Emily Rodriguez",
    title: "Mental Health Counselor",
    specialties: ["Relationship Issues", "Self-esteem", "Life Transitions"],
    rating: 4.9,
    sessionsCount: 1024,
    languages: ["English", "Spanish", "Portuguese"],
    approach: "Humanistic Therapy",
    phone: "15551234003",
    availabilityNote: "Available today",
    nextSlotHint: "4:15 PM",
  },
  {
    name: "Dr. Ahmed Hassan",
    title: "Psychiatric Specialist",
    specialties: ["Trauma", "PTSD", "Stress Management"],
    rating: 4.7,
    sessionsCount: 456,
    languages: ["English", "Arabic", "French"],
    approach: "EMDR & Trauma-Informed Care",
    phone: "15551234004",
    availabilityNote: "Available in 2 days",
    nextSlotHint: "1:00 PM",
  },
];

export async function seedCounselorsIfEmpty() {
  const count = await Counselor.countDocuments();
  if (count > 0) return;
  await Counselor.insertMany(DEFAULT_COUNSELORS);
  console.log(`Seeded ${DEFAULT_COUNSELORS.length} counselors`);
}
