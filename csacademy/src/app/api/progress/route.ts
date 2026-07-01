import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { XP_REWARDS } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, programId, score } = await request.json();
  if (!lessonId || !programId) {
    return NextResponse.json({ error: "Missing lessonId or programId" }, { status: 400 });
  }

  // 1. Upsert lesson progress
  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      program_id: programId,
      completed: true,
      score: score ?? null,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );
  if (progressError) return NextResponse.json({ error: progressError.message }, { status: 500 });

  // 2. Award XP (lesson + quiz pass + challenge bonus, simplified into one call)
  let totalXP = XP_REWARDS.LESSON_COMPLETE;
  if (typeof score === "number") {
    totalXP += XP_REWARDS.QUIZ_PASS;
    if (score === 100) totalXP += XP_REWARDS.PERFECT_QUIZ;
  }
  totalXP += XP_REWARDS.CHALLENGE_SUBMIT;

  await supabase.rpc("award_xp", {
    p_user_id: user.id,
    p_amount: totalXP,
    p_source_type: "lesson",
    p_source_id: lessonId,
    p_description: `Completed lesson`,
  });

  // 3. Update streak
  const { data: newStreak } = await supabase.rpc("update_user_streak", { p_user_id: user.id });

  // 4. Update program progress
  const { data: existingProgress } = await supabase
    .from("user_program_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("program_id", programId)
    .single();

  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("program_id", programId)
    .eq("is_published", true);

  const { count: completedCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("program_id", programId)
    .eq("completed", true);

  const isProgramComplete = (completedCount ?? 0) >= (totalLessons ?? 1);

  if (existingProgress) {
    await supabase.from("user_program_progress").update({
      lessons_completed: completedCount ?? 0,
      total_lessons: totalLessons ?? 0,
      current_day: (existingProgress.current_day ?? 1) + 1,
      completed: isProgramComplete,
      completed_at: isProgramComplete ? new Date().toISOString() : null,
    }).eq("id", existingProgress.id);
  } else {
    await supabase.from("user_program_progress").insert({
      user_id: user.id,
      program_id: programId,
      lessons_completed: completedCount ?? 0,
      total_lessons: totalLessons ?? 0,
      current_day: 2,
      completed: isProgramComplete,
    });
  }

  // 5. Issue certificate if program complete
  let certificateId: string | null = null;
  if (isProgramComplete) {
    const { data: certData } = await supabase.rpc("issue_certificate", {
      p_user_id: user.id,
      p_program_id: programId,
    });
    certificateId = certData;
    await supabase.rpc("award_xp", {
      p_user_id: user.id,
      p_amount: XP_REWARDS.PROGRAM_COMPLETE,
      p_source_type: "program",
      p_source_id: programId,
      p_description: "Program completed",
    });
  }

  // 6. Check & award streak/milestone badges (simplified inline logic)
  await checkAndAwardBadges(supabase, user.id, newStreak ?? 0);

  return NextResponse.json({
    success: true,
    xpAwarded: totalXP,
    newStreak,
    isProgramComplete,
    certificateId,
  });
}

async function checkAndAwardBadges(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  streak: number
) {
  const streakBadgeMap: Record<number, string> = {
    3: "streak-3", 7: "streak-7", 14: "streak-14", 30: "streak-30", 60: "streak-60",
  };
  const slug = streakBadgeMap[streak];
  if (!slug) return;

  const { data: badge } = await supabase.from("badges").select("id").eq("slug", slug).single();
  if (!badge) return;

  await supabase.from("user_badges").upsert(
    { user_id: userId, badge_id: badge.id },
    { onConflict: "user_id,badge_id", ignoreDuplicates: true }
  );
}
