"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/types";

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (v: boolean) => void;
  clearAuth: () => void;
  updateProfile: (updates: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: true,
      setProfile:    (profile) => set({ profile, isLoading: false }),
      setLoading:    (isLoading) => set({ isLoading }),
      clearAuth:     () => set({ profile: null, isLoading: false }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
    }),
    { name: "csa-auth", partialize: (s) => ({ profile: s.profile }) }
  )
);
