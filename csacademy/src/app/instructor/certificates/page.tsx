"use client";
import { useQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

export default function InstructorCertificatesPage() {
  const supabase = createClient();
  const { data: certs } = useQuery({
    queryKey: ["instructor-certificates"],
    queryFn: async () => {
      const { data } = await supabase.from("certificates").select("*, profiles(full_name), programs(title, icon)").order("issued_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-green-400" /> Certificates
        </h1>
        <p className="text-slate-400 text-sm mt-1">Certificates earned by your students.</p>
      </div>
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {certs?.map((c: any) => (
            <div key={c.id} className="flex items-center gap-4 p-3.5">
              <span className="text-lg">{c.programs?.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{c.profiles?.full_name}</p>
                <p className="text-xs text-slate-500">{c.programs?.title}</p>
              </div>
              <span className="text-xs text-slate-500">{formatDate(c.issued_at)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
