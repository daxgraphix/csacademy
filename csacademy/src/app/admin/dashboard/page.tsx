"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Award, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const supabase = createClient();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, programs, certificates, posts] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        programs: programs.count ?? 0,
        certificates: certificates.count ?? 0,
        posts: posts.count ?? 0,
      };
    },
  });

  const { data: recentUsers } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(8);
      return data ?? [];
    },
  });

  const STAT_CARDS = [
    { icon: Users,       label: "Total Users",       value: stats?.users ?? 0,        color: "#06B6D4" },
    { icon: BookOpen,    label: "Programs",          value: stats?.programs ?? 0,     color: "#7C3AED" },
    { icon: Award,       label: "Certificates Issued",value: stats?.certificates ?? 0, color: "#F59E0B" },
    { icon: Activity,    label: "Community Posts",   value: stats?.posts ?? 0,        color: "#10B981" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide overview and management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className="h-5 w-5 mb-2" style={{ color: s.color }} />
              <p className="font-display text-2xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-cyber-400" /> Recently Joined</CardTitle></CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {recentUsers?.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-sm font-medium text-slate-200">{u.full_name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-cyber-500/10 text-cyber-400 capitalize">{u.role}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
