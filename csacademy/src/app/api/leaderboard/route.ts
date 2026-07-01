import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "all_time";
  const limit  = Number(searchParams.get("limit") ?? 50);

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, total_xp, current_level, streak_days")
    .order("total_xp", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ranked = (data ?? []).map((row, i) => ({ rank: i + 1, ...row }));
  return NextResponse.json({ leaderboard: ranked, period });
}
