import type { Database } from "./database";

// ——— Table row re-exports ———
export type Profile         = Database["public"]["Tables"]["profiles"]["Row"];
export type Program         = Database["public"]["Tables"]["programs"]["Row"];
export type Module          = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson          = Database["public"]["Tables"]["lessons"]["Row"];
export type LessonCard      = Database["public"]["Tables"]["lesson_cards"]["Row"];
export type Quiz            = Database["public"]["Tables"]["quizzes"]["Row"];
export type Question        = Database["public"]["Tables"]["questions"]["Row"];
export type Challenge       = Database["public"]["Tables"]["challenges"]["Row"];
export type Submission      = Database["public"]["Tables"]["submissions"]["Row"];
export type UserProgress    = Database["public"]["Tables"]["user_progress"]["Row"];
export type UserProgramProgress = Database["public"]["Tables"]["user_program_progress"]["Row"];
export type UserStreak      = Database["public"]["Tables"]["user_streaks"]["Row"];
export type XPTransaction   = Database["public"]["Tables"]["xp_transactions"]["Row"];
export type Badge           = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge       = Database["public"]["Tables"]["user_badges"]["Row"];
export type Certificate     = Database["public"]["Tables"]["certificates"]["Row"];
export type Community       = Database["public"]["Tables"]["communities"]["Row"];
export type Post            = Database["public"]["Tables"]["posts"]["Row"];
export type Notification    = Database["public"]["Tables"]["notifications"]["Row"];

// ——— Composite / enriched types ———
export interface LessonWithCards extends Lesson {
  lesson_cards: LessonCard[];
  quiz?: Quiz & { questions: QuestionWithOptions[] };
  challenge?: Challenge;
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface ProfileWithStats extends Profile {
  badges_count?: number;
  certificates_count?: number;
  programs_count?: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  streak_days: number;
}

export interface ProgramWithProgress extends Program {
  progress?: UserProgramProgress;
  lessons_count?: number;
}

// ——— Auth ———
export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
}

// ——— UI State ———
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "xp" | "badge";
  title: string;
  message?: string;
  xp?: number;
  duration?: number;
}

// ——— AI Tools specific ———
export interface AITool {
  day: number;
  name: string;
  icon: string;
  tagline: string;
  category: string;
  url: string;
  color: string;
  description: string;
  features: string[];
  useCases: { role: string; example: string }[];
  pricing: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  quiz: { question: string; options: string[]; correct: number; explanation: string }[];
  challenge: { title: string; description: string; steps: string[] };
}

// ——— Form types ———
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  role?: "student" | "instructor";
}

export interface ProfileUpdateForm {
  full_name: string;
  username: string;
  bio: string;
  institution: string;
  occupation: string;
  country: string;
}
