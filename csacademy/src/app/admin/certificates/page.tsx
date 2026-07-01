"use client";
import { useQuery } from "@tanstack/react-query";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

export default function AdminCertificatesPage() {
  const supabase = createClient();
  const { data: certs } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificates")
        .select("*, profiles(full_name, email), programs(title, icon)")
        .order("issued_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-400" /> Certificates
        </h1>
        <p className="text-slate-400 text-sm mt-1">All certificates issued on the platform.</p>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {certs?.map((c: any) => (
            <div key={c.id} className="flex items-center gap-4 p-3.5">
              <span className="text-xl">{c.programs?.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{c.profiles?.full_name}</p>
                <p className="text-xs text-slate-500">{c.programs?.title}</p>
              </div>
              <span className="text-xs text-slate-600 font-mono">{c.certificate_id}</span>
              <Badge variant={c.status === "issued" ? "success" : "destructive"} className="text-[10px] capitalize">{c.status}</Badge>
              <span className="text-xs text-slate-500 w-24 text-right">{formatDate(c.issued_at)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
