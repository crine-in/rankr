import React from "react";
import { Loader2 } from "lucide-react";

export default function ExamLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="flex gap-2 items-center mb-6">
        <div className="h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <span className="text-slate-300 dark:text-zinc-700">/</span>
        <div className="h-4 w-28 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* 2. Header Skeleton */}
      <div className="flex flex-col gap-3 mb-10">
        <div className="h-6 w-36 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-10 w-2/3 max-w-lg bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl" />
        <div className="h-4 w-full max-w-2xl bg-slate-200 dark:bg-zinc-800 rounded-lg mt-2" />
      </div>

      {/* 3. Grid Content Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Stats/Trends Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card stats list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 bg-white border border-slate-200/60 dark:bg-zinc-900/40 dark:border-zinc-800/80 rounded-3xl flex flex-col gap-3"
              >
                <div className="h-4 w-12 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-8 w-20 bg-slate-300 dark:bg-zinc-700 rounded-xl" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Large mock list/table */}
          <div className="bg-white border border-slate-200/60 dark:bg-zinc-900/40 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col gap-4">
            <div className="h-5 w-1/3 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
            <div className="space-y-3 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-900/60">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-4 w-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Card Skeleton */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-6 items-center py-12">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <div className="h-6 w-32 bg-slate-300 dark:bg-zinc-700 rounded-lg" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
            <div className="w-full space-y-3 mt-4">
              <div className="h-12 w-full bg-slate-100 dark:bg-zinc-950 rounded-2xl" />
              <div className="h-12 w-full bg-slate-100 dark:bg-zinc-950 rounded-2xl" />
              <div className="h-12 w-full bg-slate-100 dark:bg-zinc-950 rounded-2xl" />
            </div>
            <div className="h-12 w-full bg-indigo-500 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
