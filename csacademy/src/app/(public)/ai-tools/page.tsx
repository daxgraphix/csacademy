import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AI_TOOLS } from "@/features/ai-tools/data";

export default function AIToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <Badge className="mb-4">30 Days of AI Tools</Badge>
        <h1 className="font-display text-4xl font-bold text-slate-100 mb-4">Every Tool You'll Master</h1>
        <p className="text-slate-400 max-w-xl mx-auto">From ChatGPT to ElevenLabs — explore the complete 30-day curriculum.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {AI_TOOLS.map((tool) => (
          <div key={tool.day} className="rounded-xl border border-border bg-card p-4 text-center hover:border-cyber-500/40 transition-all">
            <p className="text-[10px] text-slate-600 font-bold mb-2">DAY {tool.day}</p>
            <div className="text-3xl mb-2">{tool.icon}</div>
            <h3 className="font-display font-bold text-sm text-slate-100">{tool.name}</h3>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tool.tagline}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button size="lg" asChild>
          <Link href="/register">Start the Challenge →</Link>
        </Button>
      </div>
    </div>
  );
}
