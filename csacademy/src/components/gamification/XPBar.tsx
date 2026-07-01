"use client";
import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { cn, formatXP, getLevelName, getLevelColor, getXPForNextLevel } from "@/lib/utils";

interface XPBarProps {
  totalXP: number;
  level: number;
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function XPBar({ totalXP, level, compact = false, showLabel = true, className }: XPBarProps) {
  const { progress } = getXPForNextLevel(totalXP);
  const levelName    = getLevelName(level);
  const levelColor   = getLevelColor(level);
  const nextLevel    = Math.min(level + 1, 7);
  const isMaxLevel   = level >= 7;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-amber-400">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-bold">{formatXP(totalXP)}</span>
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-space-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <span className="text-xs text-slate-500">Lv.{level}</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5" style={{ color: levelColor }}>
            <Star className="h-3.5 w-3.5" />
            <span className="font-semibold">Level {level} — {levelName}</span>
          </div>
          <span className="text-slate-400">
            {isMaxLevel ? "MAX" : `${formatXP(totalXP)} XP`}
          </span>
        </div>
      )}
      <div className="relative h-3 rounded-full bg-space-800 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${levelColor}99, ${levelColor})` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
        {/* Shimmer */}
        <div className="absolute inset-0 shimmer rounded-full" />
      </div>
      {!isMaxLevel && (
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>Level {level}</span>
          <span>Level {nextLevel}</span>
        </div>
      )}
    </div>
  );
}

interface XPGainPopupProps {
  amount: number;
  visible: boolean;
}

export function XPGainPopup({ amount, visible }: XPGainPopupProps) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -40, scale: 1 }}
      exit={{ opacity: 0, y: -70 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 right-0 pointer-events-none z-50"
    >
      <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 rounded-full px-3 py-1">
        <Zap className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-amber-400 font-bold text-sm">+{amount} XP</span>
      </div>
    </motion.div>
  );
}
