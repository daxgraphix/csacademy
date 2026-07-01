"use client";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

export default function InstructorStudentsPage() {
  const supabase = createClient();
  const { data: students } = useQuery({
    queryKey: ["instructor-students"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("role", "student").order("total_xp", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="h-6 w-6 text-green-400" /> Students
        </h1>
        <p className="text-slate-400 text-sm mt-1">{students?.length ?? 0} students enrolled</p>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {students?.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-3.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-card">{getInitials(s.full_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{s.full_name}</p>
                <p className="text-xs text-slate-500">{s.email}</p>
              </div>
              <span className="text-xs text-amber-400 font-semibold">{s.total_xp} XP</span>
              <span className="text-xs text-red-400">🔥 {s.streak_days}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
