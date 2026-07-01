"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { getLevelFromXP, getXPForNextLevel } from "@/lib/utils";

export function useGamification() {
  const { profile } = useAuthStore();
  const supabase = createClient();

  const { data: streak } = useQuery({
    queryKey: ["streak", profile?.id],
    enabled:  !!profile,
    queryFn:  async () => {
      const { data } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", profile!.id)
        .single();
      return data;
    },
  });

  const { data: badges } = useQuery({
    queryKey: ["user-badges", profile?.id],
    enabled:  !!profile,
    queryFn:  async () => {
      const { data } = await supabase
        .from("user_badges")
        .select("*, badges(*)")
        .eq("user_id", profile!.id)
        .order("earned_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: recentXP } = useQuery({
    queryKey: ["recent-xp", profile?.id],
    enabled:  !!profile,
    queryFn:  async () => {
      const { data } = await supabase
        .from("xp_transactions")
        .select("*")
        .eq("user_id", profile!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const totalXP   = profile?.total_xp ?? 0;
  const level     = getLevelFromXP(totalXP);
  const xpDetails = getXPForNextLevel(totalXP);

  return {
    streak,
    badges,
    recentXP,
    totalXP,
    level,
    xpDetails,
    currentStreak: streak?.current_streak ?? 0,
    longestStreak: streak?.longest_streak ?? 0,
    badgesCount:   badges?.length ?? 0,
  };
}
