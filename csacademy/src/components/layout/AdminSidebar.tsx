"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, TrendingUp, Award, Settings, Rocket, LogOut, ChevronRight, Shield } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { href: "/admin/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users",        icon: Users,           label: "Users" },
  { href: "/admin/programs",     icon: BookOpen,        label: "Programs" },
  { href: "/admin/analytics",    icon: TrendingUp,      label: "Analytics" },
  { href: "/admin/certificates", icon: Award,           label: "Certificates" },
  { href: "/admin/settings",     icon: Settings,        label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyber-600 flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-display font-bold text-slate-100 text-sm">Admin Panel</span>
          <p className="text-[10px] text-slate-500">CSAcademy</p>
        </div>
      </div>

      {profile && (
        <div className="mx-3 mt-3 rounded-xl bg-card border border-border p-3 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
              {getInitials(profile.full_name || profile.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{profile.full_name}</p>
            <p className="text-xs text-purple-400 font-medium">Administrator</p>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:text-slate-100 hover:bg-card"
            )}>
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3 w-3 text-purple-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button onClick={async () => { await signOut(); router.push("/"); }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
