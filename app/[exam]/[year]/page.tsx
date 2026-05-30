import { Metadata } from "next";
import { notFound } from "next/navigation";
import { exams } from "../../../lib/config/exams";
import { getHistoricalRanks, getExamFilterOptions } from "../../../lib/queries/historical-ranks";
import { getYearlyStats } from "../../../lib/queries/statistics";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { RanksTable } from "../../../components/RanksTable";
import { Card } from "../../../components/ui/Card";
import { BarChart3, TrendingUp, Trophy, Calendar } from "lucide-react";
import { generateSEOMetadata, generateStructuredData } from "../../../lib/seo";

interface PageProps {
  params: Promise<{ exam: string; year: string }>;
}

// Generate dynamic metadata for Google indexing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam: examSlug, year: yearStr } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam || !yearStr.endsWith("-ranks")) {
    return { title: "Data Table Not Found" };
  }

  const yearNum = parseInt(yearStr.replace("-ranks", ""));
  if (isNaN(yearNum)) return { title: "Data Table Not Found" };

  return generateSEOMetadata({
    examSlug: exam.slug,
    pageType: "yearRanks",
    year: yearNum,
    canonicalPath: `/${exam.slug}/${yearStr}`,
  });
}

export default async function YearRanksPage({ params }: PageProps) {
  const { exam: examSlug, year: yearStr } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam || !yearStr.endsWith("-ranks")) {
    notFound();
  }

  const year = parseInt(yearStr.replace("-ranks", ""));

  if (isNaN(year) || !exam.years.includes(year)) {
    notFound();
  }

  // 1. Fetch all records for this exam and year (category: "ALL" and gender: "ALL" selects everything)
  const records = await getHistoricalRanks({
    exam: examSlug,
    year: year,
    category: "ALL",
    gender: "ALL",
    limit: 500, // Fetch up to 500 records to populate the table densely
  });

  // 2. Fetch distinct filter options dynamically based on exam database content
  const filterOptions = await getExamFilterOptions(examSlug);

  // 3. Fetch specific yearly aggregate stats for our top showcase cards
  const statsList = await getYearlyStats(examSlug, year);
  const stats = statsList[0];

  // Generate structured schemas
  const breadcrumbsSchema = generateStructuredData("breadcrumbs", {
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: `${exam.name} Predictor`, url: `/${exam.slug}/rank-predictor` },
      { name: "Previous Year Ranks", url: `/${exam.slug}/previous-year-ranks` },
      { name: `${year} Table`, url: `/${exam.slug}/${yearStr}` },
    ],
  });

  const datasetStats = {
    recordCount: stats?.total_records || records.length || 0,
    highestMarks: Number(stats?.highest_marks || records[0]?.marks || exam.maxMarks),
    bestRank: Number(stats?.best_rank || 1),
  };
  const datasetSchema = generateStructuredData("dataset", {
    examName: exam.name,
    year,
    datasetStats,
  });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: `${exam.name} Predictor`, href: `/${exam.slug}/rank-predictor` },
          { label: "Previous Year Ranks", href: `/${exam.slug}/previous-year-ranks` },
          { label: `${year} Table`, href: `/${exam.slug}/${year}-ranks` },
        ]}
      />

      {/* Header and Aggregate metrics */}
      <div className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg w-fit dark:bg-indigo-950/50 dark:text-indigo-400">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Complete {year} Archive
          </span>

          <h1 className="text-4xl font-black text-slate-800 tracking-tight dark:text-zinc-50">
            {exam.name} {year} Marks vs Rank Table
          </h1>

          <p className="text-base sm:text-lg font-bold text-slate-400 max-w-3xl leading-relaxed dark:text-zinc-500">
            Search, sort, and filter through actual database records from the {year} examination. Reviewing scores with specific category tags clarifies admission benchmarks.
          </p>
        </div>

        {/* Stats Summary cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card variant="flat" className="p-5 border border-slate-200/80 bg-slate-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Total Records</div>
              <div className="text-2xl font-black text-slate-800 dark:text-zinc-200">{stats.total_records}</div>
            </Card>
            <Card variant="flat" className="p-5 border border-slate-200/80 bg-slate-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Highest Score</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.highest_marks} / {exam.maxMarks}</div>
            </Card>
            <Card variant="flat" className="p-5 border border-slate-200/80 bg-slate-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Average Marks</div>
              <div className="text-2xl font-black text-slate-800 dark:text-zinc-200">{stats.avg_marks}</div>
            </Card>
            <Card variant="flat" className="p-5 border border-slate-200/80 bg-slate-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Best Rank Logged</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">#{stats.best_rank}</div>
            </Card>
          </div>
        )}
      </div>

      {/* Interactive table */}
      <div className="mt-8">
        <RanksTable
          initialRecords={records}
          categories={filterOptions.categories}
          genders={filterOptions.genders}
          maxMarks={exam.maxMarks}
        />
      </div>

      {/* Dynamic Student Blog Callout */}
      <Card variant="flat" className="mt-12 p-6 bg-gradient-to-r from-amber-50/50 to-amber-100/20 border border-amber-100 rounded-3xl dark:from-zinc-900/50 dark:to-zinc-900/30 dark:border-amber-900/30 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 dark:bg-amber-950/50 dark:text-amber-400 text-lg">
          📝
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-base font-black text-slate-800 dark:text-zinc-200">
            Need guidance on picking the right engineering or medical stream?
          </h4>
          <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1">
            Browse our companion blog for student counseling reviews, branch selection advice, and college hacks!
          </p>
        </div>
        <a
          href="https://blog.studiva.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-extrabold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all shadow-[0_2px_0_0_#e2e8f0] active:translate-y-[2px] active:shadow-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_2px_0_0_#27272a] dark:hover:bg-zinc-850 shrink-0"
        >
          Explore Counseling Guides
        </a>
      </Card>

      {/* Explanatory footer */}
      <section className="mt-16 bg-slate-50 dark:bg-zinc-900/50 rounded-3xl p-8 border-2 border-slate-200/80 dark:border-zinc-800">
        <h2 className="text-xl font-black text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5.5 h-5.5 text-indigo-600" />
          Analyzing Category and Gender Reservation Cutoffs
        </h2>
        <p className="text-sm font-bold text-slate-400 leading-relaxed dark:text-zinc-500">
          The records in this database contain category details (e.g. OBC-NCL, SC, ST, EWS) and gender tags where submitted by candidates. Select your reservation category from the dropdown above to filter for the corresponding category ranks. This allows you to evaluate your specific counseling scenarios with maximum accuracy.
        </p>
      </section>
    </div>
  );
}
