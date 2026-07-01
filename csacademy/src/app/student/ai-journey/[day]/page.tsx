"use client";
import { useRouter } from "next/navigation";
import { use } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonPlayer } from "@/components/learning/LessonPlayer";
import { getToolByDay } from "@/features/ai-tools/data";
import { toast } from "@/hooks/useToast";

export default function DayLessonPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = use(params);
  const router  = useRouter();
  const dayNum  = parseInt(day, 10);
  const tool    = getToolByDay(dayNum);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-slate-400">Day {dayNum} not found.</p>
        <Button variant="outline" onClick={() => router.push("/student/ai-journey")}>
          <ArrowLeft className="h-4 w-4" /> Back to Journey
        </Button>
      </div>
    );
  }

  async function handleComplete(score: number) {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: `day-${dayNum}-${tool!.name.toLowerCase().replace(/\s+/g, "-")}`,
          programId: "30-days-ai-tools",
          score,
        }),
      });
      const data = await res.json();
      if (data.xpAwarded) {
        toast({ title: `+${data.xpAwarded} XP earned! 🎉`, variant: "default" });
      }
      if (data.isProgramComplete) {
        toast({ title: "Program Complete! 🎓", description: "Your certificate is ready." });
      }
    } catch {
      // Progress saved locally even if API fails — non-blocking for UX
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.push("/student/ai-journey")} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back to Journey
      </Button>
      <LessonPlayer tool={tool} dayNumber={dayNum} onComplete={handleComplete} />
    </div>
  );
}
