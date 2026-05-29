"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Card } from "../../components/ui/Card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ExamError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console or error tracker
    console.error("Exam dynamic segment error boundary caught:", error);
  }, [error]);

  return (
    <div className="container max-w-xl mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[60vh]">
      <Card variant="playful" className="flex flex-col items-center text-center p-8 border-2 border-rose-200 dark:border-rose-950/50 bg-white dark:bg-zinc-900">
        <div className="bg-rose-50 text-rose-500 p-4 rounded-full mb-6 dark:bg-rose-950/50 dark:text-rose-400">
          <AlertCircle className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight dark:text-zinc-50 leading-tight">
          Oops, something went sideways!
        </h1>

        <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 mt-3 leading-relaxed max-w-sm">
          We encountered an issue fetching database stats or executing the interpolation engine. Let's get you back on track!
        </p>

        <div className="bg-slate-50 dark:bg-zinc-950 rounded-2xl p-3.5 font-mono text-xs text-slate-500 dark:text-zinc-400 mt-6 w-full max-w-sm overflow-hidden text-ellipsis whitespace-nowrap border border-slate-100 dark:border-zinc-800">
          Error: {error.message || "Unknown dynamic query error"}
        </div>

        {/* Dynamic Retry and Navigate Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-[0_4px_0_0_#4338ca] active:translate-y-[4px] active:shadow-none cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-reverse" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-black text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-200/80 rounded-2xl transition-all shadow-[0_4px_0_0_#e2e8f0] active:translate-y-[4px] active:shadow-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_4px_0_0_#27272a]"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
