export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "student" | "instructor" | "org_manager" | "admin";
export type ProgramCategory = "ai_tools" | "cybersecurity" | "ai_safety" | "digital_skills";
export type LessonType = "standard" | "lab" | "challenge";
export type QuizType = "multiple_choice" | "true_false" | "scenario";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type CertificateStatus = "issued" | "revoked";
export type SubscriptionPlan = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "trial";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          country: string | null;
          institution: string | null;
          occupation: string | null;
          subscription: SubscriptionPlan;
          total_xp: number;
          current_level: number;
          streak_days: number;
          longest_streak: number;
          last_active_at: string | null;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: ProgramCategory;
          icon: string;
          color: string;
          thumbnail: string | null;
          duration_days: number;
          xp_reward: number;
          is_featured: boolean;
          is_published: boolean;
          order_index: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["programs"]["Row"]> & { slug: string; title: string; description: string; category: ProgramCategory };
        Update: Partial<Database["public"]["Tables"]["programs"]["Row"]>;
      };
      modules: {
        Row: { id: string; program_id: string; title: string; description: string | null; order_index: number; xp_reward: number; is_published: boolean; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["modules"]["Row"]> & { program_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["modules"]["Row"]>;
      };
      lessons: {
        Row: {
          id: string; module_id: string; program_id: string; title: string; slug: string;
          description: string | null; lesson_type: LessonType; day_number: number | null;
          tool_name: string | null; tool_icon: string | null; tool_url: string | null;
          estimated_minutes: number; xp_reward: number; order_index: number;
          is_published: boolean; is_free: boolean; created_at: string; updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lessons"]["Row"]> & { module_id: string; program_id: string; title: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Row"]>;
      };
      lesson_cards: {
        Row: { id: string; lesson_id: string; card_type: string; title: string; content: string; media_url: string | null; order_index: number; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["lesson_cards"]["Row"]> & { lesson_id: string; title: string; content: string };
        Update: Partial<Database["public"]["Tables"]["lesson_cards"]["Row"]>;
      };
      quizzes: {
        Row: { id: string; lesson_id: string; title: string; pass_score: number; xp_reward: number; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["quizzes"]["Row"]> & { lesson_id: string };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Row"]>;
      };
      questions: {
        Row: { id: string; quiz_id: string; quiz_type: QuizType; question_text: string; options: Json; explanation: string | null; order_index: number; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["questions"]["Row"]> & { quiz_id: string; question_text: string; options: Json };
        Update: Partial<Database["public"]["Tables"]["questions"]["Row"]>;
      };
      challenges: {
        Row: { id: string; lesson_id: string; title: string; description: string; instructions: string; xp_reward: number; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["challenges"]["Row"]> & { lesson_id: string; title: string; description: string; instructions: string };
        Update: Partial<Database["public"]["Tables"]["challenges"]["Row"]>;
      };
      submissions: {
        Row: { id: string; challenge_id: string; user_id: string; content: string | null; file_url: string | null; status: SubmissionStatus; feedback: string | null; reviewed_by: string | null; reviewed_at: string | null; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["submissions"]["Row"]> & { challenge_id: string; user_id: string };
        Update: Partial<Database["public"]["Tables"]["submissions"]["Row"]>;
      };
      user_progress: {
        Row: { id: string; user_id: string; lesson_id: string; program_id: string; completed: boolean; score: number | null; time_spent: number; completed_at: string | null; created_at: string; updated_at: string; };
        Insert: Partial<Database["public"]["Tables"]["user_progress"]["Row"]> & { user_id: string; lesson_id: string; program_id: string };
        Update: Partial<Database["public"]["Tables"]["user_progress"]["Row"]>;
      };
      user_program_progress: {
        Row: { id: string; user_id: string; program_id: string; lessons_completed: number; total_lessons: number; current_day: number; completed: boolean; started_at: string; completed_at: string | null; };
        Insert: Partial<Database["public"]["Tables"]["user_program_progress"]["Row"]> & { user_id: string; program_id: string };
        Update: Partial<Database["public"]["Tables"]["user_program_progress"]["Row"]>;
      };
      user_streaks: {
        Row: { id: string; user_id: string; current_streak: number; longest_streak: number; last_activity_date: string | null; streak_frozen: boolean; freeze_used_at: string | null; created_at: string; updated_at: string; };
        Insert: Partial<Database["public"]["Tables"]["user_streaks"]["Row"]> & { user_id: string };
        Update: Partial<Database["public"]["Tables"]["user_streaks"]["Row"]>;
      };
      xp_transactions: {
        Row: { id: string; user_id: string; amount: number; source_type: string; source_id: string | null; description: string | null; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["xp_transactions"]["Row"]> & { user_id: string; amount: number; source_type: string };
        Update: Partial<Database["public"]["Tables"]["xp_transactions"]["Row"]>;
      };
      badges: {
        Row: { id: string; slug: string; name: string; description: string; icon: string; color: string; xp_required: number | null; category: string; rarity: string; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["badges"]["Row"]> & { slug: string; name: string; description: string; icon: string };
        Update: Partial<Database["public"]["Tables"]["badges"]["Row"]>;
      };
      user_badges: {
        Row: { id: string; user_id: string; badge_id: string; earned_at: string; };
        Insert: { user_id: string; badge_id: string; earned_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Row"]>;
      };
      leaderboard_entries: {
        Row: { id: string; user_id: string; period: string; xp_total: number; rank_position: number | null; updated_at: string; };
        Insert: Partial<Database["public"]["Tables"]["leaderboard_entries"]["Row"]> & { user_id: string; period: string };
        Update: Partial<Database["public"]["Tables"]["leaderboard_entries"]["Row"]>;
      };
      certificates: {
        Row: { id: string; certificate_id: string; user_id: string; program_id: string; status: CertificateStatus; issued_at: string; expires_at: string | null; metadata: Json; };
        Insert: Partial<Database["public"]["Tables"]["certificates"]["Row"]> & { user_id: string; program_id: string };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Row"]>;
      };
      communities: {
        Row: { id: string; slug: string; name: string; description: string | null; icon: string | null; cover_url: string | null; program_id: string | null; is_public: boolean; member_count: number; post_count: number; created_by: string | null; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["communities"]["Row"]> & { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["communities"]["Row"]>;
      };
      posts: {
        Row: { id: string; community_id: string; user_id: string; title: string | null; content: string; media_urls: Json; likes_count: number; reply_count: number; is_pinned: boolean; is_anonymous: boolean; created_at: string; updated_at: string; };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]> & { community_id: string; user_id: string; content: string };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
      };
      notifications: {
        Row: { id: string; user_id: string; type: string; title: string; message: string | null; data: Json; is_read: boolean; created_at: string; };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & { user_id: string; type: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      organizations: {
        Row: { id: string; slug: string; name: string; domain: string | null; logo_url: string | null; plan: SubscriptionPlan; seats_limit: number; seats_used: number; created_by: string | null; created_at: string; updated_at: string; };
        Insert: Partial<Database["public"]["Tables"]["organizations"]["Row"]> & { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
      };
    };
    Functions: {
      award_xp: { Args: { p_user_id: string; p_amount: number; p_source_type: string; p_source_id?: string; p_description?: string }; Returns: number };
      update_user_streak: { Args: { p_user_id: string }; Returns: number };
      issue_certificate: { Args: { p_user_id: string; p_program_id: string }; Returns: string };
      is_admin: { Args: Record<never, never>; Returns: boolean };
    };
  };
}
