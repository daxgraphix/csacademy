"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function ProgramsPage() {
  const supabase = createClient();
  const { data: programs } = useQuery({
    queryKey: ["public-programs"],
    queryFn: async () => {
      const { data } = await supabase.from("programs").select("*").eq("is_published", true).order("order_index");
      return data ?? [];
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-slate-100 mb-4">All Programs</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Choose your learning path and start building real digital skills today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs?.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-6 hover:shadow-card-hover transition-all">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{p.icon}</div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-slate-100">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{p.description}</p>
                <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                  <Badge variant="secondary">{p.duration_days} days</Badge>
                  <Badge variant="xp">{p.xp_reward} XP</Badge>
                </div>
              </div>
            </div>
            <Button className="mt-5 w-full" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
