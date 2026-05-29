"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./ui/Card";
import { Sparkles, Star, Gauge, ShieldAlert, ArrowLeftRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ResultCardProps {
  predictedRank: number;
  rankRange: {
    min: number;
    max: number;
  };
  confidence: number;
  dataPointsUsed: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  predictedRank,
  rankRange,
  confidence,
  dataPointsUsed,
  onReset,
}) => {
  const [displayRank, setDisplayRank] = useState<number>(1);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Trigger celebration confetti and count-up on mount
  useEffect(() => {
    // 1. Confetti burst!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#3b82f6"],
    });

    // 2. Continuous side confetti for premium experience
    const duration = 1.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // 3. Count up animation
    let start = 1;
    const end = predictedRank;
    if (end <= 1) {
      setDisplayRank(1);
      setIsRevealed(true);
      return;
    }

    const durationMs = 1200;
    const stepTime = Math.max(10, Math.floor(durationMs / 30));
    const stepValue = Math.max(1, Math.floor(end / (durationMs / stepTime)));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setDisplayRank(end);
        setIsRevealed(true);
        clearInterval(timer);
      } else {
        setDisplayRank(start);
      }
    }, stepTime);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [predictedRank]);

  // Confidence category color
  const getConfidenceColor = () => {
    if (confidence >= 90) return "bg-emerald-500 text-emerald-700 dark:text-emerald-400";
    if (confidence >= 75) return "bg-lime-500 text-lime-700 dark:text-lime-400";
    if (confidence >= 60) return "bg-amber-500 text-amber-700 dark:text-amber-400";
    return "bg-rose-500 text-rose-700 dark:text-rose-400";
  };

  const getConfidenceLabel = () => {
    if (confidence >= 90) return "Extremely High";
    if (confidence >= 75) return "High Confidence";
    if (confidence >= 60) return "Moderate";
    return "Estimation (Low Data)";
  };

  return (
    <Card className="w-full relative p-8 text-center animate-fade-in border-4 border-indigo-200 dark:border-indigo-950/50 shadow-[8px_8px_0px_0px_rgba(99,102,241,0.2)]">
      {/* Decorative stars */}
      <div className="absolute top-6 left-6 text-yellow-400 animate-bounce">
        <Star className="w-6 h-6 fill-current" />
      </div>
      <div className="absolute top-6 right-6 text-yellow-400 animate-bounce delay-150">
        <Star className="w-6 h-6 fill-current" />
      </div>

      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full dark:bg-indigo-950 dark:text-indigo-300">
        <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
        Prediction Ready!
      </span>

      <p className="text-slate-500 dark:text-zinc-400 font-bold text-lg mt-4">
        Your Expected Rank is
      </p>

      {/* Ranks showcase */}
      <div className="my-6 flex flex-col items-center">
        <div className="text-7xl sm:text-8xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter filter drop-shadow-[0_2px_4px_rgba(99,102,241,0.1)]">
          #{displayRank.toLocaleString()}
        </div>

        {/* Expected Rank Range */}
        <div className="mt-3 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-2.5 dark:bg-zinc-900 dark:border-zinc-800">
          <ArrowLeftRight className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
          <span className="text-sm font-bold text-slate-400 dark:text-zinc-400">
            Expected Range:
          </span>
          <span className="text-base font-black text-slate-700 dark:text-zinc-200">
            #{rankRange.min.toLocaleString()} – #{rankRange.max.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Confidence meter */}
      <div className="my-6 p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 text-left dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-600 dark:text-zinc-300 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-indigo-500" />
            Prediction Confidence:
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-zinc-200">
            {confidence}%
          </span>
        </div>
        
        {/* Playful animated bar */}
        <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              confidence >= 90 ? "bg-emerald-500" : confidence >= 75 ? "bg-lime-500" : confidence >= 60 ? "bg-amber-500" : "bg-rose-500"
            }`}
            style={{ width: `${isRevealed ? confidence : 0}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2.5">
          <span className="text-xs font-extrabold text-slate-400 dark:text-zinc-500">
            Engine assessment:
          </span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${getConfidenceColor()}`}>
            {getConfidenceLabel()}
          </span>
        </div>
      </div>

      {/* Dynamic Data source context */}
      <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed dark:text-zinc-500">
        {dataPointsUsed}
      </p>

      {/* Reset button */}
      <div className="mt-8">
        <button
          onClick={onReset}
          className="font-bold text-indigo-600 hover:text-indigo-500 text-base cursor-pointer hover:underline transition-all dark:text-indigo-400 flex items-center gap-1.5 mx-auto"
        >
          ← Predict Another Score
        </button>
      </div>
    </Card>
  );
};
