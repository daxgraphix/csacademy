"use client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function InstructorProgramsPage() {
  const supabase = createClient();
  const { data: programs } = useQuery({
    queryKey: ["instructor-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("programs").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-400" /> Programs
          </h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage your learning programs.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Program</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {programs?.map((p) => (
          <Card key={p.id} className="hover:shadow-card-hover transition-all cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="text-3xl">{p.icon}</div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-slate-100">{p.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px]">{p.duration_days} days</Badge>
                  {p.is_published ? <Badge variant="success" className="text-[10px]">Live</Badge> : <Badge variant="outline" className="text-[10px]">Draft</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
