import Link from "next/link";
import { Rocket, Shield, Zap, Trophy, ArrowRight, Check, Star, Users, Award, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AI_TOOLS } from "@/features/ai-tools/data";

const STATS = [
  { value: "30",   label: "AI Tools",          icon: "🤖" },
  { value: "10+",  label: "Cyber Topics",       icon: "🛡️" },
  { value: "7",    label: "Skill Levels",        icon: "⭐" },
  { value: "100+", label: "Badges & Rewards",   icon: "🏆" },
];

const FEATURES = [
  { icon: Rocket,   title: "30 Days of AI Tools",       desc: "Master one AI tool every day — from ChatGPT to Midjourney and beyond.", color: "text-cyber-400", bg: "bg-cyber-500/10", border: "border-cyber-500/20" },
  { icon: Shield,   title: "Cybersecurity Awareness",   desc: "Learn to identify phishing, protect accounts, and defend against modern threats.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: Trophy,   title: "Gamified Learning",         desc: "XP, streaks, badges, and leaderboards that make every lesson rewarding.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: Award,    title: "Verified Certificates",     desc: "Earn shareable certificates with QR verification for every program you complete.", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  { icon: Zap,      title: "Micro-Learning Format",     desc: "3–10 minute daily lessons built for busy learners. No fluff, just skills.", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { icon: Users,    title: "Community & Challenges",    desc: "Learn alongside peers, share achievements, and compete on leaderboards.", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

const FIRST_5_TOOLS = AI_TOOLS.slice(0, 5);

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-dark-mesh pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-1.5 text-sm text-cyber-400 mb-6 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-500" />
            </span>
            The 30 Days of AI Tools Challenge is now live
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-100 leading-tight mb-6 animate-fade-up">
            Master{" "}
            <span className="relative">
              <span className="gradient-text">AI Tools</span>
            </span>
            {" "}in<br />30 Days
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up">
            The gamified micro-learning platform for AI literacy, cybersecurity, and digital skills.
            Learn one powerful tool every day through interactive lessons, quizzes, and real challenges.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up">
            <Button size="xl" asChild className="gap-2">
              <Link href="/register">
                Start for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/programs">Explore Programs</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card/50 backdrop-blur p-4">
                <p className="text-2xl mb-0.5">{s.icon}</p>
                <p className="font-display text-2xl font-bold text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling tool cards */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden pointer-events-none">
          <div className="flex gap-4 animate-[scroll_20s_linear_infinite] w-max">
            {[...AI_TOOLS, ...AI_TOOLS].map((tool, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2">
                <span>{tool.icon}</span>
                <span className="text-xs text-slate-400 whitespace-nowrap">Day {tool.day}: {tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">The 30-Day Journey</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              One Tool. Every Day. 30 Days.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Each day unlocks a new AI tool with interactive cards, a quiz, and a hands-on challenge.</p>
          </div>

          {/* Day cards preview */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {AI_TOOLS.slice(0, 10).map((tool, i) => (
                <div
                  key={tool.day}
                  className="flex-shrink-0 w-52 rounded-xl border border-border bg-card p-4 hover:border-cyber-500/40 hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500">Day {tool.day}</span>
                    <Badge variant="secondary" className="text-[10px]">{tool.difficulty}</Badge>
                  </div>
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="font-display font-bold text-slate-100 text-sm mb-1">{tool.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{tool.tagline}</p>
                  <div className="mt-3 text-[10px] text-slate-600 font-medium">{tool.category}</div>
                </div>
              ))}
              <div className="flex-shrink-0 w-52 rounded-xl border border-dashed border-border bg-card/30 p-4 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">🚀</span>
                <p className="text-sm text-slate-500 text-center">+ 20 more tools to unlock</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/ai-tools">View All <ChevronRight className="h-3 w-3" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-surface/30 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-4">Platform Features</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              Learning that actually sticks
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Designed with the science of habit formation, gamification, and practical application.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className={`rounded-xl border ${f.border} ${f.bg} p-5 hover:shadow-card-hover transition-all`}>
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${f.bg} border ${f.border} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-display font-bold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">All Programs</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Choose your learning path</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: "🤖", title: "30 Days of AI Tools", desc: "Master 30 AI tools in 30 days", days: 30, xp: 300, color: "#06B6D4", featured: true },
              { icon: "🛡️", title: "Cybersecurity Awareness", desc: "Essential cyber defense skills", days: 14, xp: 200, color: "#7C3AED", featured: true },
              { icon: "⚖️", title: "AI Safety & Ethics", desc: "Navigate AI responsibility and risks", days: 10, xp: 150, color: "#F59E0B", featured: false },
              { icon: "💻", title: "Digital Skills Essentials", desc: "Modern workplace digital skills", days: 10, xp: 150, color: "#10B981", featured: false },
            ].map((p) => (
              <div key={p.title} className={`rounded-2xl border p-6 hover:shadow-card-hover transition-all ${p.featured ? "border-opacity-40 bg-card" : "border-border bg-card/50"}`}
                style={p.featured ? { borderColor: `${p.color}40` } : {}}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{p.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-slate-100">{p.title}</h3>
                      {p.featured && <Badge variant="default" className="text-[10px]">Featured</Badge>}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{p.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>📅 {p.days} days</span>
                      <span>⚡ {p.xp} XP</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" asChild style={p.featured ? { background: p.color } : {}}>
                    <Link href="/register">Start Now</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/programs">Learn more</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center rounded-2xl border border-cyber-500/20 bg-gradient-to-br from-cyber-500/5 via-card to-purple-500/5 p-12">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Start your AI journey today
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of learners mastering AI tools, earning badges, and building the digital skills of the future — for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild>
              <Link href="/register">Create Free Account <ArrowRight className="h-5 w-5" /></Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Free forever plan</span>
            <span className="flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Instant access</span>
          </div>
        </div>
      </section>
    </div>
  );
}
