"use client";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function InstructorLessonsPage() {
  const supabase = createClient();
  const { data: lessons } = useQuery({
    queryKey: ["instructor-lessons"],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*, programs(title, icon)").order("day_number").limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-green-400" /> Lessons
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage individual lessons across your programs.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Lesson</Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {lessons?.map((l: any) => (
            <div key={l.id} className="flex items-center gap-4 p-3.5">
              <span className="text-lg">{l.programs?.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{l.title}</p>
                <p className="text-xs text-slate-500">{l.programs?.title} {l.day_number ? `· Day ${l.day_number}` : ""}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">{l.lesson_type}</Badge>
              <Badge variant="xp" className="text-[10px]">{l.xp_reward} XP</Badge>
            </div>
          ))}
          {(!lessons || lessons.length === 0) && (
            <div className="p-8 text-center text-slate-500 text-sm">No lessons yet. Create your first lesson to get started.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
