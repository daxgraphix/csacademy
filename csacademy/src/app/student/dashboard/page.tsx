"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Shield, Zap, Trophy, ArrowRight, Flame, Calendar, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/primitives";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/index";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";
import { getToolByDay } from "@/features/ai-tools/data";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const { totalXP, level, currentStreak, badgesCount, recentXP } = useGamification();

  // For demo: assume day 1 is current if no progress yet
  const currentDay = 1;
  const todayTool  = getToolByDay(currentDay);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100">
            {greeting}, {profile?.full_name?.split(" ")[0] ?? "Learner"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge streak={currentStreak} size="sm" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Zap,    label: "Total XP",  value: totalXP.toLocaleString(), color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { icon: Flame,  label: "Streak",    value: `${currentStreak} days`,  color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20" },
          { icon: Trophy, label: "Badges",    value: badgesCount,              color: "text-purple-400",bg: "bg-purple-500/10",border: "border-purple-500/20" },
          { icon: Target, label: "Level",     value: level,                    color: "text-cyber-400", bg: "bg-cyber-500/10", border: "border-cyber-500/20" },
        ].map((s) => (
          <Card key={s.label} className={`${s.bg} ${s.border}`}>
            <CardContent className="p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="font-display text-xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP progress */}
      <Card>
        <CardContent className="p-5">
          <XPBar totalXP={totalXP} level={level} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's lesson */}
        <Card className="lg:col-span-2 border-cyber-500/20 bg-gradient-to-br from-cyber-500/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-cyber-400" /> Today's Lesson
              </CardTitle>
              <Badge variant="default">Day {currentDay} of 30</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todayTool && (
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: `${todayTool.color}15`, border: `1px solid ${todayTool.color}30` }}>
                  {todayTool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg text-slate-100">{todayTool.name}</h3>
                  <p className="text-sm text-slate-400">{todayTool.tagline}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px]">{todayTool.category}</Badge>
                    <span className="text-[10px] text-slate-500">~{5} min</span>
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/student/ai-journey/${currentDay}`}>
                    Start <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Access</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/student/cyber-academy", icon: Shield, label: "Cyber Academy", color: "text-purple-400" },
              { href: "/student/challenges",    icon: Zap,    label: "Challenges",    color: "text-amber-400" },
              { href: "/student/leaderboard",   icon: TrendingUp, label: "Leaderboard", color: "text-cyber-400" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-card transition-colors group">
                <l.icon className={`h-4 w-4 ${l.color}`} />
                <span className="text-sm text-slate-300 group-hover:text-slate-100 flex-1">{l.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Program progress overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket className="h-4 w-4 text-cyber-400" /> 30 Days of AI Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(currentDay / 30) * 100} className="mb-2" />
            <p className="text-xs text-slate-500">{currentDay} of 30 days completed</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
              <Link href="/student/ai-journey">Continue Journey</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-purple-400" /> Cybersecurity Awareness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={0} className="mb-2" indicatorClassName="bg-purple-500" />
            <p className="text-xs text-slate-500">0 of 14 days completed</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
              <Link href="/student/cyber-academy">Start Program</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      {recentXP && recentXP.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recentXP.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-slate-400">{tx.description ?? tx.source_type}</span>
                <span className="text-sm font-semibold text-amber-400">+{tx.amount} XP</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
