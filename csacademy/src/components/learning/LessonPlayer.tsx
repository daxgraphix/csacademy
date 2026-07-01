"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, X, Zap,
  ExternalLink, BookOpen, Star, ArrowRight, Trophy, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { AITool } from "@/types";
import confetti from "canvas-confetti";

interface LessonPlayerProps {
  tool: AITool;
  dayNumber: number;
  onComplete: (score: number) => void;
  isCompleted?: boolean;
}

type Phase = "intro" | "cards" | "quiz" | "challenge" | "reward";

interface QuizState {
  currentQ:   number;
  selected:   number | null;
  answered:   boolean;
  correct:    number;
  answers:    Record<number, number>;
}

const CARD_TYPES = ["info", "feature", "use_case", "tip"] as const;

export function LessonPlayer({ tool, dayNumber, onComplete, isCompleted }: LessonPlayerProps) {
  const [phase, setPhase]       = useState<Phase>(isCompleted ? "reward" : "intro");
  const [cardIdx, setCardIdx]   = useState(0);
  const [direction, setDirection] = useState(0);
  const [quiz, setQuiz]         = useState<QuizState>({ currentQ: 0, selected: null, answered: false, correct: 0, answers: {} });
  const [showExplanation, setShowExplanation] = useState(false);

  /* Build the lesson cards from the tool data */
  const lessonCards = [
    { type: "info",     title: "What is " + tool.name + "?",  content: tool.description,                         emoji: "🧠" },
    { type: "feature",  title: "Key Features",                 content: tool.features.map((f) => `• ${f}`).join("\n"), emoji: "⚡" },
    { type: "use_case", title: "Use Cases",                    content: tool.useCases.map((u) => `**${u.role}:** ${u.example}`).join("\n\n"), emoji: "🎯" },
    { type: "tip",      title: "Pricing & Access",             content: tool.pricing,                             emoji: "💰" },
  ];

  const totalSteps = 4; // intro, cards, quiz, reward
  const progressMap: Record<Phase, number> = {
    intro: 5, cards: 30, quiz: 70, challenge: 85, reward: 100,
  };

  /* Card swipe handlers */
  const handlePrev = useCallback(() => {
    if (cardIdx === 0) { setPhase("intro"); return; }
    setDirection(-1);
    setCardIdx((i) => i - 1);
  }, [cardIdx]);

  const handleNext = useCallback(() => {
    if (cardIdx < lessonCards.length - 1) {
      setDirection(1);
      setCardIdx((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  }, [cardIdx, lessonCards.length]);

  /* Quiz handlers */
  function selectAnswer(optionIdx: number) {
    if (quiz.answered) return;
    const isCorrect = optionIdx === tool.quiz[quiz.currentQ].correct;
    setQuiz((q) => ({
      ...q,
      selected: optionIdx,
      answered: true,
      correct: isCorrect ? q.correct + 1 : q.correct,
      answers: { ...q.answers, [q.currentQ]: optionIdx },
    }));
    setShowExplanation(true);
  }

  function nextQuestion() {
    if (quiz.currentQ < tool.quiz.length - 1) {
      setQuiz((q) => ({ ...q, currentQ: q.currentQ + 1, selected: null, answered: false }));
      setShowExplanation(false);
    } else {
      setPhase("challenge");
    }
  }

  function completeLesson() {
    const score = Math.round((quiz.correct / tool.quiz.length) * 100);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#06B6D4", "#8B5CF6", "#F59E0B", "#10B981"] });
    setPhase("reward");
    onComplete(score);
  }

  const currentCard = lessonCards[cardIdx];
  const currentQ    = tool.quiz[quiz.currentQ];

  return (
    <div className="flex flex-col h-full min-h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}30` }}>
            {tool.icon}
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-100">Day {dayNumber}: {tool.name}</h2>
            <p className="text-xs text-slate-500">{tool.tagline}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">{tool.difficulty}</Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <Progress value={progressMap[phase]} className="h-1.5" />
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>Intro</span><span>Cards</span><span>Quiz</span><span>Complete</span>
        </div>
      </div>

      {/* ── INTRO PHASE ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-7xl"
            >
              {tool.icon}
            </motion.div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold text-slate-100">{tool.name}</h1>
              <p className="text-lg text-cyber-400 font-medium">{tool.tagline}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="secondary">{tool.category}</Badge>
                <Badge variant="outline">{tool.difficulty}</Badge>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyber-400 hover:text-cyber-300 transition-colors">
                  Visit site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">{tool.description.slice(0, 180)}...</p>
            <Button onClick={() => setPhase("cards")} size="lg" className="mt-2">
              Start Learning <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}

        {/* ── CARDS PHASE ─────────────────────────────── */}
        {phase === "cards" && (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col gap-4">
            {/* Card counter */}
            <div className="flex justify-center gap-2">
              {lessonCards.map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all", i === cardIdx ? "w-8 bg-cyber-500" : i < cardIdx ? "w-4 bg-cyber-500/40" : "w-4 bg-space-800")} />
              ))}
            </div>

            {/* Swipeable card */}
            <div className="relative flex-1 min-h-[360px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={cardIdx}
                  custom={direction}
                  initial={{ x: direction > 0 ? 200 : -200, opacity: 0, scale: 0.95 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: direction > 0 ? -200 : 200, opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0 rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 shadow-card"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentCard.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-slate-100">{currentCard.title}</h3>
                      <p className="text-xs text-slate-500 capitalize">{currentCard.type.replace("_", " ")} · {cardIdx + 1} of {lessonCards.length}</p>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {currentCard.type === "feature" ? (
                      <ul className="space-y-2.5">
                        {tool.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="h-5 w-5 rounded-full bg-cyber-500/15 border border-cyber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-3 w-3 text-cyber-400" />
                            </div>
                            <span className="text-slate-300 text-sm leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : currentCard.type === "use_case" ? (
                      <div className="space-y-3">
                        {tool.useCases.map((uc, i) => (
                          <div key={i} className="rounded-lg bg-surface border border-border p-3">
                            <p className="text-xs font-semibold text-cyber-400 mb-1">{uc.role}</p>
                            <p className="text-sm text-slate-300 leading-relaxed">{uc.example}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-300 leading-relaxed">{currentCard.content}</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext} className={cardIdx === lessonCards.length - 1 ? "" : "bg-cyber-500"}>
                {cardIdx === lessonCards.length - 1 ? "Take Quiz →" : "Next"} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── QUIZ PHASE ──────────────────────────────── */}
        {phase === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col gap-4">
            {/* Quiz header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                <span className="font-semibold text-slate-100">Quick Check</span>
              </div>
              <span className="text-sm text-slate-400">{quiz.currentQ + 1} / {tool.quiz.length}</span>
            </div>

            <Progress value={((quiz.currentQ) / tool.quiz.length) * 100} className="h-1" indicatorClassName="bg-purple-500" />

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quiz.currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="rounded-xl bg-card border border-border p-5">
                  <p className="font-semibold text-slate-100 leading-relaxed">{currentQ.question}</p>
                </div>

                <div className="space-y-2.5">
                  {currentQ.options.map((option, i) => {
                    const isSelected  = quiz.selected === i;
                    const isCorrect   = i === currentQ.correct;
                    const isWrong     = isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={i}
                        onClick={() => selectAnswer(i)}
                        disabled={quiz.answered}
                        whileHover={!quiz.answered ? { scale: 1.01 } : {}}
                        whileTap={!quiz.answered ? { scale: 0.99 } : {}}
                        className={cn(
                          "w-full text-left rounded-xl border p-4 text-sm transition-all flex items-center gap-3",
                          !quiz.answered && "hover:border-cyber-500/50 hover:bg-cyber-500/5 border-border bg-card cursor-pointer",
                          quiz.answered && isCorrect && "border-green-500 bg-green-500/10 text-green-300",
                          quiz.answered && isWrong   && "border-red-500 bg-red-500/10 text-red-300",
                          quiz.answered && !isSelected && !isCorrect && "border-border bg-card/50 text-slate-500 opacity-60",
                          !quiz.answered && "text-slate-300 border-border bg-card",
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold",
                          quiz.answered && isCorrect ? "border-green-500 bg-green-500 text-white" :
                          quiz.answered && isWrong   ? "border-red-500   bg-red-500   text-white" :
                          "border-border text-slate-500"
                        )}>
                          {quiz.answered && isCorrect ? <Check className="h-3.5 w-3.5" /> :
                           quiz.answered && isWrong   ? <X    className="h-3.5 w-3.5" /> :
                           String.fromCharCode(65 + i)}
                        </div>
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "rounded-xl p-4 text-sm",
                        quiz.selected === currentQ.correct
                          ? "bg-green-500/10 border border-green-500/30 text-green-300"
                          : "bg-red-500/10 border border-red-500/30 text-red-300"
                      )}
                    >
                      <p className="font-semibold mb-1">{quiz.selected === currentQ.correct ? "✓ Correct!" : "✗ Not quite."}</p>
                      <p className="text-xs leading-relaxed opacity-90">{currentQ.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {quiz.answered && (
                  <Button onClick={nextQuestion} className="w-full">
                    {quiz.currentQ < tool.quiz.length - 1 ? "Next Question" : "See Challenge"} →
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── CHALLENGE PHASE ─────────────────────────── */}
        {phase === "challenge" && (
          <motion.div key="challenge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col gap-5">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyber-500/10 border border-purple-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-100">Today's Challenge</h3>
                  <p className="text-xs text-purple-400">+30 XP on completion</p>
                </div>
              </div>

              <h4 className="font-semibold text-slate-100 mb-2">{tool.challenge.title}</h4>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">{tool.challenge.description}</p>

              <ol className="space-y-2.5">
                {tool.challenge.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-cyber-500/20 border border-cyber-500/30 flex items-center justify-center text-[10px] font-bold text-cyber-400 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-300">Complete the challenge and mark it done to earn your XP and keep your streak!</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setPhase("quiz")}>
                ← Back to Quiz
              </Button>
              <Button className="flex-1 gap-2" onClick={completeLesson}>
                <Check className="h-4 w-4" /> Mark Complete
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── REWARD PHASE ────────────────────────────── */}
        {phase === "reward" && (
          <motion.div key="reward" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-6xl"
            >
              🎉
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-slate-100">Day {dayNumber} Complete!</h2>
              <p className="text-slate-400">You've mastered <span className="text-cyber-400 font-semibold">{tool.name}</span></p>
            </div>

            {/* Rewards */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-5 py-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="text-lg font-bold text-amber-400">+{10 + 20 + 30}</span>
                <span className="text-[10px] text-amber-600">XP Earned</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-3">
                <span className="text-xl">🔥</span>
                <span className="text-lg font-bold text-red-400">+1</span>
                <span className="text-[10px] text-red-600">Day Streak</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-cyber-500/10 border border-cyber-500/20 px-5 py-3">
                <span className="text-xl">✓</span>
                <span className="text-lg font-bold text-cyber-400">{quiz.correct}/{tool.quiz.length}</span>
                <span className="text-[10px] text-cyber-600">Quiz Score</span>
              </div>
            </div>

            {dayNumber < 30 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Tomorrow: Day {dayNumber + 1} unlocks in 24 hours</p>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Back to Journey
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Trophy className="h-5 w-5" />
                  <span className="font-bold">You've completed the 30 Days of AI Tools!</span>
                </div>
                <Button asChild>
                  <a href="/student/certificates">Claim Your Certificate 🎓</a>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
