"use client";
import { motion } from "framer-motion";
import { Flame, Trophy, Lock } from "lucide-react";
import { cn, getLevelName, getLevelColor } from "@/lib/utils";
import type { Badge, UserBadge } from "@/types";

/* ─── Streak Badge ─────────────────────────────────────── */
interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakBadge({ streak, size = "md", className }: StreakBadgeProps) {
  const isActive = streak > 0;
  const sizes = { sm: "h-8 w-8 text-sm", md: "h-12 w-12 text-xl", lg: "h-16 w-16 text-3xl" };
  const labelSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <motion.div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2",
          sizes[size],
          isActive
            ? "border-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
            : "border-border bg-card"
        )}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Flame className={cn(isActive ? "text-red-400" : "text-slate-600", size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8")} />
      </motion.div>
      <div className="text-center">
        <p className={cn("font-bold text-red-400", labelSizes[size])}>{streak}</p>
        <p className={cn("text-slate-500", size === "sm" ? "text-[9px]" : "text-[10px]")}>Day streak</p>
      </div>
    </div>
  );
}

/* ─── Level Badge ──────────────────────────────────────── */
interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function LevelBadge({ level, size = "md", showLabel = true, className }: LevelBadgeProps) {
  const color = getLevelColor(level);
  const name  = getLevelName(level);
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-12 w-12 text-sm", lg: "h-16 w-16 text-lg" };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn("flex items-center justify-center rounded-full border-2 font-bold font-display", sizes[size])}
        style={{ borderColor: color, background: `${color}20`, color }}
      >
        {level}
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-[10px] font-semibold" style={{ color }}>{name}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Single Badge Card ────────────────────────────────── */
interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  earnedAt?: string;
  size?: "sm" | "md";
}

const RARITY_COLORS: Record<string, string> = {
  common:    "#94A3B8",
  rare:      "#06B6D4",
  epic:      "#8B5CF6",
  legendary: "#F59E0B",
};

export function BadgeCard({ badge, earned = false, earnedAt, size = "md" }: BadgeCardProps) {
  const rarityColor = RARITY_COLORS[badge.rarity] ?? "#94A3B8";

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
        size === "sm" ? "p-2" : "p-3",
        earned
          ? "border-border bg-card hover:border-opacity-60"
          : "border-border/30 bg-card/30 opacity-50"
      )}
      style={earned ? { borderColor: `${rarityColor}30` } : {}}
    >
      {/* Rarity glow */}
      {earned && (
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: `radial-gradient(circle at center, ${rarityColor}08 0%, transparent 70%)` }} />
      )}

      {/* Icon */}
      <div
        className={cn("flex items-center justify-center rounded-full text-xl", size === "sm" ? "h-10 w-10 text-lg" : "h-14 w-14 text-2xl")}
        style={{ background: earned ? `${rarityColor}15` : "#1E2D4720", border: `1px solid ${earned ? rarityColor + "40" : "#1E2D47"}` }}
      >
        {earned ? badge.icon : <Lock className="h-5 w-5 text-slate-600" />}
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <p className={cn("font-semibold leading-tight", size === "sm" ? "text-xs" : "text-sm", earned ? "text-slate-200" : "text-slate-600")}>
          {badge.name}
        </p>
        {size !== "sm" && (
          <p className="text-[10px] text-slate-500 line-clamp-2">{badge.description}</p>
        )}
        {earned && (
          <p className="text-[10px] font-semibold capitalize" style={{ color: rarityColor }}>{badge.rarity}</p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Badge Grid ───────────────────────────────────────── */
interface BadgeGridProps {
  userBadges: (UserBadge & { badges: Badge })[];
  allBadges?: Badge[];
  compact?: boolean;
}

export function BadgeGrid({ userBadges, allBadges, compact = false }: BadgeGridProps) {
  const earnedIds  = new Set(userBadges.map((ub) => ub.badge_id));
  const earnedMap  = new Map(userBadges.map((ub) => [ub.badge_id, ub.earned_at]));
  const displayBadges = allBadges ?? userBadges.map((ub) => ub.badges);

  return (
    <div className={cn("grid gap-3", compact ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4")}>
      {displayBadges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          earned={earnedIds.has(badge.id)}
          earnedAt={earnedMap.get(badge.id)}
          size={compact ? "sm" : "md"}
        />
      ))}
    </div>
  );
}
