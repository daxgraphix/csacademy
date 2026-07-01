"use client";
import { useQuery } from "@tanstack/react-query";
import { BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { createClient } from "@/lib/supabase/client";

export default function InstructorReportsPage() {
  const supabase = createClient();

  const { data: completionData } = useQuery({
    queryKey: ["completion-trend"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("completed_at")
        .eq("completed", true)
        .order("completed_at", { ascending: true })
        .limit(200);

      const byDay: Record<string, number> = {};
      data?.forEach((d) => {
        if (!d.completed_at) return;
        const day = new Date(d.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        byDay[day] = (byDay[day] ?? 0) + 1;
      });
      return Object.entries(byDay).map(([day, count]) => ({ day, count }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-green-400" /> Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">Track student progress and engagement trends.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Lesson Completions Over Time</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ background: "#131D31", border: "1px solid #1E2D47", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
