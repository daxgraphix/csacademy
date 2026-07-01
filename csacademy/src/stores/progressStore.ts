"use client";

import { create } from "zustand";
import type { UserProgramProgress } from "@/types";

interface ProgressState {
  programProgress: Record<string, UserProgramProgress>;
  completedLessons: Set<string>;
  setProgramProgress: (programId: string, data: UserProgramProgress) => void;
  markLessonComplete: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()((set, get) => ({
  programProgress: {},
  completedLessons: new Set(),
  setProgramProgress: (programId, data) =>
    set((s) => ({ programProgress: { ...s.programProgress, [programId]: data } })),
  markLessonComplete: (lessonId) =>
    set((s) => {
      const next = new Set(s.completedLessons);
      next.add(lessonId);
      return { completedLessons: next };
    }),
  isLessonCompleted: (lessonId) => get().completedLessons.has(lessonId),
  reset: () => set({ programProgress: {}, completedLessons: new Set() }),
}));
