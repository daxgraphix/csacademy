"use client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export default function InstructorDashboard() {
  const { profile } = useAuth();
  const supabase = createClient();

  const { data: stats } = useQuery({
    queryKey: ["instructor-stats", profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const [programs, lessons, students] = await Promise.all([
        supabase.from("programs").select("*", { count: "exact", head: true }).eq("created_by", profile!.id),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      ]);
      return { programs: programs.count ?? 0, lessons: lessons.count ?? 0, students: students.count ?? 0 };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100">Welcome, {profile?.full_name?.split(" ")[0]} 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your courses and track student progress.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: "My Programs", value: stats?.programs ?? 0, color: "#10B981" },
          { icon: FileText, label: "Total Lessons", value: stats?.lessons ?? 0, color: "#06B6D4" },
          { icon: Users,    label: "Active Students", value: stats?.students ?? 0, color: "#8B5CF6" },
        ].map((s) => (
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
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-400" /> Getting Started</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>1. Create a new program from the Programs tab</li>
            <li>2. Add modules and lessons with interactive cards</li>
            <li>3. Build quizzes and challenges for each lesson</li>
            <li>4. Publish and track student progress in Reports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
