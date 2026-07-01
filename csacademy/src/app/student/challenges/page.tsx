"use client";
import { Zap, Check, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AI_TOOLS } from "@/features/ai-tools/data";

export default function ChallengesPage() {
  const challenges = AI_TOOLS.slice(0, 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-400" /> Challenges
        </h1>
        <p className="text-slate-400 text-sm mt-1">Hands-on challenges to apply what you've learned.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((tool) => (
          <Card key={tool.day} className="hover:shadow-card-hover transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <Badge variant="purple" className="text-[10px]">+30 XP</Badge>
              </div>
              <h3 className="font-display font-bold text-slate-100 text-sm mb-1">{tool.challenge.title}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{tool.challenge.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Clock className="h-3 w-3" /> Day {tool.day}
                </span>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
