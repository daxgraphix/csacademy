import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  { name: "Free", price: "$0", period: "forever", features: ["Access to AI Tools challenge", "Basic gamification", "Community access", "1 certificate per program"], cta: "Start Free", featured: false },
  { name: "Pro", price: "$9", period: "/month", features: ["All Free features", "All premium programs", "Priority support", "Advanced analytics", "Unlimited certificates"], cta: "Go Pro", featured: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["All Pro features", "Team management", "Custom branding", "Dedicated support", "SSO & advanced security"], cta: "Contact Sales", featured: false },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-slate-100 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-400">Start free. Upgrade when you're ready for more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.name} className={`rounded-2xl border p-6 ${p.featured ? "border-cyber-500/40 bg-cyber-500/5 scale-105" : "border-border bg-card"}`}>
            {p.featured && <Badge className="mb-3">Most Popular</Badge>}
            <h3 className="font-display font-bold text-xl text-slate-100">{p.name}</h3>
            <div className="mt-2 mb-6">
              <span className="font-display text-3xl font-bold text-slate-100">{p.price}</span>
              <span className="text-slate-500 text-sm">{p.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                  <Check className="h-4 w-4 text-cyber-400 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={p.featured ? "default" : "outline"} asChild>
              <Link href="/register">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
