import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exams } from "../../../lib/config/exams";
import { getYearlyStats } from "../../../lib/queries/statistics";
import { Card } from "../../../components/ui/Card";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import {
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  LineChart,
} from "lucide-react";

interface PageProps {
  params: Promise<{ exam: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) return { title: "Exam Not Found" };

  return {
    title: `${exam.name} Previous Year Ranks - Historical Marks vs Rank`,
    description: `Explore multi-year marks-vs-rank databases for ${exam.name}. Compare candidate records from 2023, 2024, and 2025 to evaluate admission trends.`,
  };
}

export default async function PreviousYearRanksPage({ params }: PageProps) {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) {
    notFound();
  }

  // Fetch yearly statistics aggregates from our database
  const statsList = await getYearlyStats(examSlug);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: `${exam.name} Predictor`, href: `/${exam.slug}/rank-predictor` },
          { label: "Previous Year Ranks", href: `/${exam.slug}/previous-year-ranks` },
        ]}
      />

      <div className="mt-6 flex flex-col gap-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-black rounded-lg w-fit dark:bg-amber-950/50 dark:text-amber-400">
          <LineChart className="w-4 h-4 text-amber-500" />
          Competition Trend Indexes
        </span>

        <h1 className="text-4xl font-black text-slate-800 tracking-tight dark:text-zinc-50">
          {exam.name} Previous Year Ranks
        </h1>

        <p className="text-base sm:text-lg font-bold text-slate-500 max-w-3xl leading-relaxed dark:text-zinc-400">
          Analyze historical scoring thresholds to discover how entrance cutoffs have evolved. Understanding marks-vs-rank inflation is essential for pinpointing college target bands.
        </p>
      </div>

      {/* Grid of Available Years */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {exam.years.map((year) => {
          const stats = statsList.find((s) => s.year === year);

          return (
            <Card
              key={year}
              className="flex flex-col border-b-4 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl dark:bg-indigo-950 dark:text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-800 dark:text-zinc-50">
                    {year} Database
                  </span>
                </div>
              </div>

              {stats ? (
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 dark:border-zinc-900">
                    <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">Student Records:</span>
                    <span className="text-sm font-black text-slate-700 dark:text-zinc-200">{stats.total_records}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 dark:border-zinc-900">
                    <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">Highest Score:</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{stats.highest_marks} / {exam.maxMarks}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 dark:border-zinc-900">
                    <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">Average Marks:</span>
                    <span className="text-sm font-black text-slate-700 dark:text-zinc-200">{stats.avg_marks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">Best Rank:</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">#{stats.best_rank}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 mb-8 dark:text-zinc-500">
                  Aggregated statistics currently processing.
                </p>
              )}

              <Link
                href={`/${exam.slug}/${year}-ranks`}
                className="mt-auto flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_3px_0_0_#4338ca] active:translate-y-[3px] active:shadow-none text-center"
              >
                Explore {year} Ranks Table
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>

      {/* SEO Explanatory Section */}
      <section className="mt-16 bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border-2 border-slate-200/80 dark:border-zinc-800">
        <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Understanding Score Inflation and Rank Shifts
        </h2>
        <p className="text-sm font-bold text-slate-400 leading-relaxed mb-4 dark:text-zinc-500">
          In competitive entrance tests, scoring shifts occur due to variations in paper difficulty, increase in total applicants, and changes in student preparation depth. For instance, obtaining 200 marks in a highly challenging paper might secure a Top 500 rank, whereas the same score on a simpler test paper in a subsequent year might slide back to a Rank 1,500.
        </p>
        <p className="text-sm font-bold text-slate-400 leading-relaxed dark:text-zinc-500">
          By comparing the historical databases above, you can measure rank-inflation curves. This is why looking at multi-year reports side-by-side provides a much more robust baseline than relying solely on the most recent cycle.
        </p>
      </section>
    </div>
  );
}
