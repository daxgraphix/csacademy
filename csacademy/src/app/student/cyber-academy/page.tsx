"use client";
import { Shield, Lock, Mail, Smartphone, Eye, AlertTriangle, Wifi, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TOPICS = [
  { icon: Lock,        title: "Password Security",  desc: "Build unbreakable passwords and use password managers", color: "#06B6D4" },
  { icon: Smartphone,  title: "MFA",                 desc: "Multi-factor authentication for every account",        color: "#7C3AED" },
  { icon: Mail,        title: "Phishing",            desc: "Spot fake emails and malicious links before they strike", color: "#EF4444" },
  { icon: UserX,       title: "Social Engineering",  desc: "Defend against manipulation tactics and impersonation",   color: "#F59E0B" },
  { icon: Wifi,        title: "Online Safety",       desc: "Safe browsing, public wifi risks, and VPN basics",        color: "#10B981" },
  { icon: Eye,         title: "Privacy",             desc: "Control your digital footprint and personal data",        color: "#EC4899" },
  { icon: Shield,      title: "Data Protection",     desc: "Encryption, backups, and securing sensitive information", color: "#8B5CF6" },
  { icon: AlertTriangle, title: "Scam Awareness",    desc: "Recognize common online scams and fraud patterns",        color: "#F97316" },
];

const LABS = [
  { icon: "🎣", title: "Phishing Lab",           desc: "Identify fake emails, links, and websites in simulated scenarios" },
  { icon: "🔑", title: "Password Lab",           desc: "Test password strength and practice MFA setup" },
  { icon: "🎭", title: "Social Engineering Lab", desc: "Navigate phone scams and impersonation scenarios" },
  { icon: "🤖", title: "Deepfake Awareness Lab", desc: "Learn to spot fake images, videos, and audio" },
];

export default function CyberAcademyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-400" /> Cyber Academy
        </h1>
        <p className="text-slate-400 text-sm mt-1">Build essential cyber defenses against modern digital threats.</p>
      </div>

      {/* Topics grid */}
      <div>
        <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">Core Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOPICS.map((t) => (
            <Card key={t.title} className="hover:shadow-card-hover transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                  <t.icon className="h-5 w-5" style={{ color: t.color }} />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm mb-1">{t.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cyber Labs */}
      <div>
        <h2 className="font-display font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">Interactive Cyber Labs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LABS.map((lab) => (
            <Card key={lab.title} className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="text-3xl">{lab.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-slate-100">{lab.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{lab.desc}</p>
                </div>
                <Button size="sm" variant="outline">Enter Lab</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">14-Day Cybersecurity Awareness Program</CardTitle>
            <Badge variant="purple">200 XP</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 mb-4">Complete all topics and labs to earn your Cyber Defender certificate.</p>
          <Button>Start Program</Button>
        </CardContent>
      </Card>
    </div>
  );
}
