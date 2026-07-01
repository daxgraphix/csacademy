import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getLevelFromXP(xp: number): number {
  return Math.min(7, Math.floor(xp / 500) + 1);
}

export function getXPForNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXP(xp);
  const current = (level - 1) * 500;
  const next = level * 500;
  const progress = level >= 7 ? 100 : ((xp - current) / (next - current)) * 100;
  return { current, next, progress: Math.round(progress) };
}

export const LEVEL_NAMES: Record<number, string> = {
  1: "Beginner",
  2: "Explorer",
  3: "Learner",
  4: "Practitioner",
  5: "Specialist",
  6: "Expert",
  7: "Champion",
};

export const LEVEL_COLORS: Record<number, string> = {
  1: "#94A3B8",
  2: "#06B6D4",
  3: "#3B82F6",
  4: "#8B5CF6",
  5: "#EC4899",
  6: "#F59E0B",
  7: "#10B981",
};

export function getLevelName(level: number): string {
  return LEVEL_NAMES[level] ?? "Champion";
}

export function getLevelColor(level: number): string {
  return LEVEL_COLORS[level] ?? "#10B981";
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function generateCertificateId(): string {
  return `CSA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clampProgress(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function pluralize(count: number, word: string, plural?: string): string {
  return count === 1 ? `${count} ${word}` : `${count} ${plural ?? word + "s"}`;
}
