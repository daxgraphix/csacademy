"use client";
import { useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { createClient } from "@/lib/supabase/client";
import { getInitials, getLevelColor, getLevelName } from "@/lib/utils";
import { useGamification } from "@/hooks/useGamification";
import { toast } from "@/hooks/useToast";

export default function ProfilePage() {
  const { profile } = useAuth();
  const { updateProfile } = useAuthStore();
  const { totalXP, level, currentStreak, badgesCount } = useGamification();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name:   profile?.full_name ?? "",
    username:    profile?.username ?? "",
    bio:         profile?.bio ?? "",
    institution: profile?.institution ?? "",
    occupation:  profile?.occupation ?? "",
  });

  async function handleSave() {
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", profile.id);
    if (!error) {
      updateProfile(form);
      toast({ title: "Profile updated successfully", variant: "default" });
    }
    setLoading(false);
  }

  if (!profile) return null;
  const levelColor = getLevelColor(level);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <User className="h-6 w-6 text-cyber-400" /> Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information.</p>
      </div>

      {/* Stats summary */}
      <Card>
        <CardContent className="p-5 flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2" style={{ borderColor: levelColor }}>
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="text-lg" style={{ background: `${levelColor}20`, color: levelColor }}>
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg text-slate-100">{profile.full_name}</h2>
            <p className="text-sm" style={{ color: levelColor }}>Level {level} — {getLevelName(level)}</p>
          </div>
          <div className="flex gap-4 text-center">
            <div><p className="font-bold text-amber-400">{totalXP}</p><p className="text-[10px] text-slate-500">XP</p></div>
            <div><p className="font-bold text-red-400">{currentStreak}</p><p className="text-[10px] text-slate-500">Streak</p></div>
            <div><p className="font-bold text-purple-400">{badgesCount}</p><p className="text-[10px] text-slate-500">Badges</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Institution</Label>
              <Input value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} placeholder="University of Dar es Salaam" />
            </div>
            <div className="space-y-1.5">
              <Label>Occupation</Label>
              <Input value={form.occupation} onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))} placeholder="Student, Developer, etc." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tell us about yourself..." />
          </div>
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
