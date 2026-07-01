"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, MessageSquare, Heart, Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { getInitials, timeAgo } from "@/lib/utils";

export default function CommunityPage() {
  const supabase = createClient();

  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data } = await supabase.from("communities").select("*").order("member_count", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="h-6 w-6 text-cyber-400" /> Community
        </h1>
        <p className="text-slate-400 text-sm mt-1">Connect, share, and learn together with fellow students.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(communities ?? []).map((c) => (
          <Card key={c.id} className="hover:shadow-card-hover transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-slate-100">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.member_count}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {c.post_count}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!communities || communities.length === 0) && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="p-12 text-center text-slate-500 text-sm">
              No communities yet. Check back soon!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
