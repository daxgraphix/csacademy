"use client";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeGrid } from "@/components/gamification/index";
import { createClient } from "@/lib/supabase/client";
import { useGamification } from "@/hooks/useGamification";

export default function AchievementsPage() {
  const supabase = createClient();
  const { badges: userBadges, badgesCount } = useGamification();

  const { data: allBadges } = useQuery({
    queryKey: ["all-badges"],
    queryFn: async () => {
      const { data } = await supabase.from("badges").select("*").order("category");
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-400" /> Achievements
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          You've earned {badgesCount} of {allBadges?.length ?? 0} badges
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <BadgeGrid userBadges={(userBadges ?? []) as never} allBadges={allBadges ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
