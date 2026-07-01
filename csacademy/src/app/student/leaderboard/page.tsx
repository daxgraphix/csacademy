"use client";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives";
import { getInitials, getLevelColor, getLevelName } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number; id: string; full_name: string; username: string | null;
  avatar_url: string | null; total_xp: number; current_level: number; streak_days: number;
}

const RANK_COLORS = ["#F59E0B", "#94A3B8", "#B45309"]; // gold, silver, bronze

export default function LeaderboardPage() {
  const { profile } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "all_time"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard?period=all_time&limit=50");
      const json = await res.json();
      return json.leaderboard as LeaderboardEntry[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-400" /> Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">See how you rank among CSAcademy learners.</p>
      </div>

      <Tabs defaultValue="all_time">
        <TabsList>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="all_time">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="all_time" className="mt-4">
          {/* Top 3 podium */}
          {data && data.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[data[1], data[0], data[2]].map((entry, idx) => {
                const actualRank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                const color = RANK_COLORS[actualRank - 1];
                return (
                  <Card key={entry.id} className={cn("text-center", actualRank === 1 && "scale-105 border-amber-500/40")}>
                    <CardContent className="p-4">
                      <div className="relative inline-block mb-2">
                        <Avatar className="h-14 w-14 mx-auto ring-2" style={{ borderColor: color }}>
                          <AvatarImage src={entry.avatar_url ?? undefined} />
                          <AvatarFallback style={{ background: `${color}20`, color }}>{getInitials(entry.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: color }}>
                          {actualRank}
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-slate-100 truncate">{entry.full_name}</p>
                      <p className="text-xs font-bold mt-1" style={{ color }}>{entry.total_xp.toLocaleString()} XP</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Full list */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {isLoading && <div className="p-8 text-center text-slate-500 text-sm">Loading leaderboard...</div>}
              {data?.map((entry) => {
                const isMe = entry.id === profile?.id;
                const levelColor = getLevelColor(entry.current_level);
                return (
                  <div key={entry.id} className={cn("flex items-center gap-4 p-3.5", isMe && "bg-cyber-500/5 border-l-2 border-cyber-500")}>
                    <span className={cn("w-6 text-center font-bold text-sm", entry.rank <= 3 ? "text-amber-400" : "text-slate-500")}>
                      {entry.rank}
                    </span>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={entry.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs" style={{ background: `${levelColor}20`, color: levelColor }}>
                        {getInitials(entry.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">{entry.full_name} {isMe && <span className="text-cyber-400 text-xs">(you)</span>}</p>
                      <p className="text-xs" style={{ color: levelColor }}>{getLevelName(entry.current_level)}</p>
                    </div>
                    {entry.streak_days > 0 && (
                      <span className="flex items-center gap-1 text-xs text-red-400 font-semibold">
                        <Flame className="h-3 w-3" /> {entry.streak_days}
                      </span>
                    )}
                    <span className="text-sm font-bold text-amber-400 w-16 text-right">{entry.total_xp.toLocaleString()}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Weekly leaderboard resets every Monday.</CardContent></Card>
        </TabsContent>
        <TabsContent value="monthly" className="mt-4">
          <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Monthly leaderboard resets on the 1st.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
