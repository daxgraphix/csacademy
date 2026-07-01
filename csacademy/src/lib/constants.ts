export const APP_NAME = "CSAcademy";
export const APP_TAGLINE = "Master AI Tools in 30 Days";
export const APP_DESCRIPTION = "The gamified micro-learning platform for AI literacy, cybersecurity, and digital skills.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const VERIFY_URL = process.env.NEXT_PUBLIC_VERIFY_URL ?? "https://verify.csacademy.com";

export const XP_REWARDS = {
  LESSON_COMPLETE:   10,
  QUIZ_PASS:         20,
  CHALLENGE_SUBMIT:  30,
  MODULE_COMPLETE:   50,
  PROGRAM_COMPLETE: 100,
  STREAK_BONUS:       5,
  PERFECT_QUIZ:      10, // bonus on top of quiz pass
} as const;

export const STREAK_MILESTONES = [1, 3, 7, 14, 30, 60, 90] as const;

export const LEVEL_THRESHOLDS = [0, 500, 1000, 1500, 2000, 2500, 3000] as const;

export const PROGRAM_CATEGORIES = {
  ai_tools:       { label: "AI Tools",          color: "#06B6D4", icon: "🤖" },
  cybersecurity:  { label: "Cybersecurity",      color: "#7C3AED", icon: "🛡️" },
  ai_safety:      { label: "AI Safety",          color: "#F59E0B", icon: "⚖️" },
  digital_skills: { label: "Digital Skills",     color: "#10B981", icon: "💻" },
} as const;

export const NAV_STUDENT_LINKS = [
  { href: "/student/dashboard",     label: "Dashboard",     icon: "LayoutDashboard" },
  { href: "/student/ai-journey",    label: "AI Journey",    icon: "Rocket" },
  { href: "/student/cyber-academy", label: "Cyber Academy", icon: "Shield" },
  { href: "/student/challenges",    label: "Challenges",    icon: "Zap" },
  { href: "/student/achievements",  label: "Achievements",  icon: "Trophy" },
  { href: "/student/leaderboard",   label: "Leaderboard",   icon: "BarChart2" },
  { href: "/student/certificates",  label: "Certificates",  icon: "Award" },
  { href: "/student/community",     label: "Community",     icon: "Users" },
  { href: "/student/profile",       label: "Profile",       icon: "User" },
] as const;

export const NAV_INSTRUCTOR_LINKS = [
  { href: "/instructor/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/instructor/programs",  label: "Programs",  icon: "BookOpen" },
  { href: "/instructor/lessons",   label: "Lessons",   icon: "FileText" },
  { href: "/instructor/students",  label: "Students",  icon: "Users" },
  { href: "/instructor/reports",   label: "Reports",   icon: "BarChart2" },
] as const;

export const NAV_ADMIN_LINKS = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: "LayoutDashboard" },
  { href: "/admin/users",       label: "Users",       icon: "Users" },
  { href: "/admin/programs",    label: "Programs",    icon: "BookOpen" },
  { href: "/admin/analytics",   label: "Analytics",   icon: "TrendingUp" },
  { href: "/admin/certificates",label: "Certificates",icon: "Award" },
  { href: "/admin/settings",    label: "Settings",    icon: "Settings" },
] as const;

export const QUIZ_PASS_SCORE = 70;
export const ITEMS_PER_PAGE  = 20;

export const CARD_TYPES = {
  info:     { label: "Info",      color: "#06B6D4", bg: "bg-cyber-500/10" },
  feature:  { label: "Feature",   color: "#8B5CF6", bg: "bg-purple-500/10" },
  use_case: { label: "Use Case",  color: "#10B981", bg: "bg-green-500/10" },
  tip:      { label: "Tip",       color: "#F59E0B", bg: "bg-amber-500/10" },
  warning:  { label: "Warning",   color: "#EF4444", bg: "bg-red-500/10" },
} as const;
