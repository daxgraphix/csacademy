"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Check, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/primitives";
import { AI_TOOLS, TOOL_CATEGORIES } from "@/features/ai-tools/data";
import { cn } from "@/lib/utils";

export default function AIJourneyPage() {
  const currentDay = 1; // would come from user_program_progress

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">30 Days of AI Tools 🤖</h1>
        <p className="text-slate-400 text-sm mt-1">Master one AI tool every day. Build your complete AI toolkit.</p>
      </div>

      <Card className="border-cyber-500/20 bg-gradient-to-br from-cyber-500/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-200">Journey Progress</span>
            <span className="text-sm text-cyber-400 font-bold">{currentDay - 1} / 30 days</span>
          </div>
          <Progress value={((currentDay - 1) / 30) * 100} className="h-2.5" />
        </CardContent>
      </Card>

      {/* Category sections */}
      {TOOL_CATEGORIES.map((category) => {
        const tools = AI_TOOLS.filter((t) => t.category === category);
        return (
          <div key={category} className="space-y-3">
            <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {tools.map((tool) => {
                const isCompleted = tool.day < currentDay;
                const isActive    = tool.day === currentDay;
                const isLocked    = tool.day > currentDay;

                return (
                  <Link
                    key={tool.day}
                    href={isLocked ? "#" : `/student/ai-journey/${tool.day}`}
                    className={cn(
                      "group relative rounded-xl border p-3 flex flex-col items-center gap-2 text-center transition-all",
                      isCompleted && "day-node-complete cursor-pointer hover:scale-105",
                      isActive    && "day-node-active cursor-pointer hover:scale-105",
                      isLocked    && "day-node-locked cursor-not-allowed opacity-60"
                    )}
                  >
                    <span className="absolute top-2 right-2 text-[9px] font-bold text-slate-600">D{tool.day}</span>
                    <div className="text-2xl">{isLocked ? <Lock className="h-5 w-5 text-slate-600" /> : tool.icon}</div>
                    <p className={cn("text-xs font-semibold leading-tight", isLocked ? "text-slate-600" : "text-slate-200")}>
                      {tool.name}
                    </p>
                    {isCompleted && (
                      <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-cyber-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-space-900" />
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center animate-glow-pulse">
                        <Play className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
