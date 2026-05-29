import Link from "next/link";
import { HomePredictorWrapper } from "../components/HomePredictorWrapper";
import { exams } from "../lib/config/exams";
import { Card } from "../components/ui/Card";
import {
  Sparkles,
  ChevronRight,
  GraduationCap,
  Zap,
  BarChart3,
  ShieldCheck,
  Play,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* 1. Hero & Instant Predictor Area */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-16 lg:py-24 border-b-2 border-slate-200/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:border-zinc-800">
        <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text & value prop */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black w-fit mx-auto lg:mx-0 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-500 fill-current animate-pulse" />
              Fun, Interactive & 100% Free
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight dark:text-zinc-50 leading-[1.1]">
              Dream Big. <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Predict Accurately.
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-bold text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed dark:text-zinc-400">
              Instantly estimate your competitive exam ranks and percentiles. Built on years of actual student admission data using advanced math.
            </p>

            {/* Playful Steps (Duolingo Style) */}
            <div className="hidden sm:flex flex-col gap-4 mt-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex gap-4 items-start">
                <div className="bg-indigo-100 text-indigo-600 font-extrabold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-indigo-950 dark:text-indigo-400">
                  1
                </div>
                <div>
                  <h3 className="font-black text-slate-700 dark:text-zinc-200">Select Your Exam</h3>
                  <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Supports JEE Main, NEET, GATE, and CAT</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-amber-100 text-amber-600 font-extrabold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-amber-950 dark:text-amber-400">
                  2
                </div>
                <div>
                  <h3 className="font-black text-slate-700 dark:text-zinc-200">Enter Your Marks</h3>
                  <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Provide category and gender details for higher accuracy</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-emerald-100 text-emerald-600 font-extrabold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-emerald-950 dark:text-emerald-400">
                  3
                </div>
                <div>
                  <h3 className="font-black text-slate-700 dark:text-zinc-200">Celebrate Your Target! 🎯</h3>
                  <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Get expected rank ranges and historical statistical context instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Predictor Wrapper Form */}
          <div className="lg:col-span-5 w-full">
            <HomePredictorWrapper />
          </div>
        </div>
      </section>

      {/* 2. Explore Supported Exams Grid */}
      <section className="py-20 bg-slate-50 dark:bg-zinc-950">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">
              Explore Entrance Benchmarks
            </h2>
            <p className="text-base sm:text-lg font-bold text-slate-400 dark:text-zinc-500 mt-3">
              Deep dive into historical mark-to-rank statistics and percentile maps for each test.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exams.map((exam) => (
              <Card
                key={exam.slug}
                className="flex flex-col h-full hover:scale-[1.01] transition-transform duration-200 border-b-4"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 px-3 py-1 rounded-lg">
                      {exam.years.length} Years of Data
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-50 mt-2">
                      {exam.name}
                    </h3>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl dark:bg-indigo-950 dark:text-indigo-400">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 leading-relaxed mb-6">
                  Analyze trends, categories ({exam.categories.join(", ")}), and expected outcomes. Perfect for evaluating college cutoffs.
                </p>

                {/* Grid Links */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link
                    href={`/${exam.slug}/rank-predictor`}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_3px_0_0_#4338ca] active:translate-y-[3px] active:shadow-none text-center"
                  >
                    Predictor
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/${exam.slug}/marks-vs-rank`}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-extrabold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all shadow-[0_3px_0_0_#e2e8f0] active:translate-y-[3px] active:shadow-none text-center dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_3px_0_0_#27272a] dark:hover:bg-zinc-850"
                  >
                    Marks vs Rank
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Engine Explanation (Why it works) */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-t-2 border-b-2 border-slate-200/50 dark:border-zinc-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphics/Math details */}
            <div className="lg:col-span-5 order-last lg:order-first">
              <Card variant="flat" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 relative overflow-hidden dark:from-indigo-950 dark:to-purple-950 border-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-300 fill-current" />
                  The Interpolation Math
                </h3>
                
                <p className="text-sm font-bold opacity-90 leading-relaxed mb-6">
                  Instead of random guesses or linear estimates, we utilize local weighted linear interpolation.
                </p>

                {/* Math Formulas representation */}
                <div className="bg-white/10 rounded-2xl p-4 font-mono text-xs flex flex-col gap-2">
                  <div className="text-white/60">// Linear Interpolation Formula</div>
                  <div className="font-extrabold text-amber-200 text-sm">
                    Y = Y₁ + ((X₁ - X) / (X₁ - X₂)) * (Y₂ - Y₁)
                  </div>
                  <hr className="border-white/10 my-1" />
                  <div className="text-white/60">X = User Score, Y = Expected Rank</div>
                  <div className="text-white/60">X₁, Y₁ = Closest upper data boundary</div>
                  <div className="text-white/60">X₂, Y₂ = Closest lower data boundary</div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-black text-amber-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  Guarantees realistic boundary ranges.
                </div>
              </Card>
            </div>

            {/* Right Value Propositions */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-zinc-50 tracking-tight">
                Designed for Visual Clarity & Mathematical Truth
              </h2>
              
              <p className="text-base sm:text-lg font-bold text-slate-400 dark:text-zinc-500 leading-relaxed">
                Rank predictors shouldn't feel like boring financial spreadsheets. We gamified the interface to be clear, rewarding, and extremely easy to read on mobile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="flex gap-3">
                  <div className="text-emerald-500 flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-700 dark:text-zinc-200">No Account Bloat</h4>
                    <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">We store zero personal data. No passwords to remember. Fully anonymous.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-indigo-500 flex-shrink-0 mt-0.5">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-700 dark:text-zinc-200">Highly Granular Filters</h4>
                    <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Filters dynamically fallback to baseline averages when sample rates are tight.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-amber-500 flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-700 dark:text-zinc-200">Continuous Updates</h4>
                    <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Materialized database views recalculate on the fly for latest year margins.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-rose-500 flex-shrink-0 mt-0.5">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-700 dark:text-zinc-200">Student First</h4>
                    <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Designed with a warm, premium color scheme to minimize entrance exam anxiety.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
