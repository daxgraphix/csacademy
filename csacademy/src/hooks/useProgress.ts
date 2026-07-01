"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export function useProgress(programId?: string) {
  const { profile } = useAuthStore();
  const supabase = createClient();
  const qc = useQueryClient();

  const { data: programProgress } = useQuery({
    queryKey: ["program-progress", profile?.id, programId],
    enabled:  !!profile && !!programId,
    queryFn:  async () => {
      const { data } = await supabase
        .from("user_program_progress")
        .select("*")
        .eq("user_id", profile!.id)
        .eq("program_id", programId!)
        .single();
      return data;
    },
  });

  const { data: completedLessons } = useQuery({
    queryKey: ["completed-lessons", profile?.id, programId],
    enabled:  !!profile && !!programId,
    queryFn:  async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", profile!.id)
        .eq("program_id", programId!)
        .eq("completed", true);
      return new Set(data?.map((r) => r.lesson_id) ?? []);
    },
  });

  const completeLesson = useMutation({
    mutationFn: async ({ lessonId, score }: { lessonId: string; score?: number }) => {
      if (!profile) throw new Error("Not authenticated");
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, programId, score }),
      });
      if (!res.ok) throw new Error("Failed to record progress");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["program-progress", profile?.id, programId] });
      qc.invalidateQueries({ queryKey: ["completed-lessons", profile?.id, programId] });
      qc.invalidateQueries({ queryKey: ["profile", profile?.id] });
    },
  });

  return { programProgress, completedLessons, completeLesson };
}
