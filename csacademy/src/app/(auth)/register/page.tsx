"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Rocket, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "student",    label: "Learner",     icon: GraduationCap, desc: "I want to learn AI tools & cyber skills" },
  { id: "instructor", label: "Instructor",  icon: BookOpen,       desc: "I want to create and teach courses" },
] as const;

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [form,     setForm]     = useState({ email: "", password: "", full_name: "", role: "student" as "student" | "instructor" });

  const update = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, role: form.role },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) { setError(error.message); return; }
      router.push("/student/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-border bg-surface shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyber-500 to-purple-600 flex items-center justify-center shadow-cyber">
              <Rocket className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Join thousands of learners mastering AI tools</p>
        </div>

        {/* Google */}
        <Button variant="outline" className="w-full mb-4 gap-3" onClick={handleGoogle} type="button">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs text-slate-500 bg-surface px-2">or register with email</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role picker */}
          <div className="space-y-1.5">
            <Label>I am a…</Label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id} type="button"
                  onClick={() => update("role", r.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all text-xs",
                    form.role === r.id
                      ? "border-cyber-500 bg-cyber-500/10 text-cyber-400"
                      : "border-border bg-card text-slate-400 hover:border-border/80"
                  )}
                >
                  <r.icon className="h-5 w-5" />
                  <span className="font-semibold">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" placeholder="Amara Diallo" required
              value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required autoComplete="email"
              value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" required className="pr-10"
                value={form.password} onChange={(e) => update("password", e.target.value)} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account →"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          By registering, you agree to our{" "}
          <a href="#" className="text-cyber-400 hover:underline">Terms</a> &amp;{" "}
          <a href="#" className="text-cyber-400 hover:underline">Privacy Policy</a>.
        </p>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-cyber-400 hover:text-cyber-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
