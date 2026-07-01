"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Rocket, Shield, Zap, Trophy, BarChart2,
  Award, Users, User, LogOut, ChevronRight, Flame, Star,
} from "lucide-react";
import { cn, getLevelName, getLevelColor, getXPForNextLevel, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives";
import { Progress } from "@/components/ui/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";

const NAV = [
  { href: "/student/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/student/ai-journey",    icon: Rocket,          label: "AI Journey",    badge: "30 Days" },
  { href: "/student/cyber-academy", icon: Shield,          label: "Cyber Academy" },
  { href: "/student/challenges",    icon: Zap,             label: "Challenges" },
  { href: "/student/achievements",  icon: Trophy,          label: "Achievements" },
  { href: "/student/leaderboard",   icon: BarChart2,       label: "Leaderboard" },
  { href: "/student/certificates",  icon: Award,           label: "Certificates" },
  { href: "/student/community",     icon: Users,           label: "Community" },
  { href: "/student/profile",       icon: User,            label: "Profile" },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, signOut } = useAuth();
  const { totalXP, level, currentStreak, xpDetails } = useGamification();

  const levelColor = getLevelColor(level);
  const levelName  = getLevelName(level);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center shadow-cyber">
          <Rocket className="h-4 w-4 text-white" />
        </div>
        <span className="font-display font-bold text-slate-100">
          CS<span className="text-cyber-400">Academy</span>
        </span>
      </div>

      {/* User card */}
      {profile && (
        <div className="mx-3 mt-3 rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-card" style={{ ringColor: levelColor }}>
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback style={{ background: `${levelColor}20`, color: levelColor }}>
                {getInitials(profile.full_name || profile.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-100 truncate">{profile.full_name || "Learner"}</p>
              <p className="text-xs font-medium" style={{ color: levelColor }}>
                Lv.{level} {levelName}
              </p>
            </div>
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-red-400">
                <Flame className="h-3.5 w-3.5" />
                {currentStreak}
              </div>
            )}
          </div>
          {/* XP bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">XP</span>
              <span className="text-amber-400 font-semibold">{totalXP.toLocaleString()}</span>
            </div>
            <Progress value={xpDetails.progress} className="h-1.5" indicatorClassName="bg-amber-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 no-scrollbar">
        {NAV.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-cyber-500/15 text-cyber-400 border border-cyber-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-card"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-cyber-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyber-500/20 text-cyber-400">{badge}</span>
              )}
              {active && <ChevronRight className="h-3 w-3 text-cyber-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
