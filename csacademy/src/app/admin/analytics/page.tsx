"use client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { createClient } from "@/lib/supabase/client";

export default function AdminAnalyticsPage() {
  const supabase = createClient();

  const { data: roleDistribution } = useQuery({
    queryKey: ["role-distribution"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("role");
      const counts: Record<string, number> = {};
      data?.forEach((d) => { counts[d.role] = (counts[d.role] ?? 0) + 1; });
      return Object.entries(counts).map(([role, count]) => ({ role, count }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-purple-400" /> Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide learning analytics and insights.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">User Distribution by Role</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D47" />
              <XAxis dataKey="role" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ background: "#131D31", border: "1px solid #1E2D47", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
