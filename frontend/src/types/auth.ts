export interface AuthUser {
  id: string;
  email: string;
  name: string;
  wellnessScore?: number;
  streak?: number;
  sessionsCompleted?: number;
}
