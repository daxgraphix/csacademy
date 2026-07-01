"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import type { Profile } from "@/types";

export function useAuth() {
  const { profile, isLoading, setProfile, setLoading, clearAuth } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) { setLoading(false); return; }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (mounted) setProfile(profileData as Profile);
      } catch {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) { clearAuth(); return; }
      if (event === "SIGNED_IN" && session.user) {
        const { data } = await supabase
          .from("profiles").select("*").eq("id", session.user.id).single();
        if (data) setProfile(data as Profile);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    clearAuth();
  }

  return { profile, isLoading, isAuthenticated: !!profile, signOut };
}
