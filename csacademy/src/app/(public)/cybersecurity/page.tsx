import Link from "next/link";
import { Shield, Lock, Mail, Smartphone, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TOPICS = [
  { icon: Lock, title: "Password Security" }, { icon: Smartphone, title: "Multi-Factor Authentication" },
  { icon: Mail, title: "Phishing Detection" }, { icon: Eye, title: "Privacy Protection" },
  { icon: AlertTriangle, title: "Scam Awareness" }, { icon: Shield, title: "Data Protection" },
];

export default function CybersecurityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Badge variant="purple" className="mb-4">14-Day Program</Badge>
        <h1 className="font-display text-4xl font-bold text-slate-100 mb-4">Cybersecurity Awareness</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Build essential cyber defenses through interactive labs and real-world scenarios.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-12">
        {TOPICS.map((t) => (
          <div key={t.title} className="rounded-xl border border-border bg-card p-5 text-center">
            <t.icon className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-200">{t.title}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/register">Start Learning →</Link>
        </Button>
      </div>
    </div>
  );
}
