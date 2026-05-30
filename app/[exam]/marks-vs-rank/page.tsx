import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { exams } from "../../../lib/config/exams";
import { predictRank } from "../../../lib/queries/predict-rank";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Card } from "../../../components/ui/Card";
import { LineChart, Sparkles, TrendingUp, HelpCircle, ArrowRight } from "lucide-react";
import { generateSEOMetadata, generateStructuredData } from "../../../lib/seo";
import seoData from "../../../lib/config/seo-metadata.json";

interface PageProps {
  params: Promise<{ exam: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) return { title: "Trends Not Found" };

  return generateSEOMetadata({
    examSlug: exam.slug,
    pageType: "marksVsRank",
    canonicalPath: `/${exam.slug}/marks-vs-rank`,
  });
}

export default async function MarksVsRankPage({ params }: PageProps) {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) {
    notFound();
  }

  // Define custom score milestones per exam
  const getMilestones = () => {
    if (examSlug === "jee-main") return [260, 220, 180, 150, 120, 90, 60];
    if (examSlug === "neet") return [680, 640, 600, 550, 500, 400, 300];
    if (examSlug === "gate") return [85, 75, 65, 55, 45, 35];
    return [160, 130, 100, 80, 60, 40]; // CAT default
  };

  const milestones = getMilestones();
  const sortedYears = [...exam.years].sort((a, b) => b - a); // descending order (2025 first)

  // Trigger parallel interpolation queries across all milestones and years
  const comparativeData = await Promise.all(
    milestones.map(async (marks) => {
      const predictions = await Promise.all(
        sortedYears.map(async (year) => {
          try {
            const pred = await predictRank({
              exam: examSlug,
              marks,
              year,
            });
            return { year, rank: pred.predictedRank };
          } catch (err) {
            console.error(`Failed prediction for ${examSlug} ${year} marks ${marks}:`, err);
            return { year, rank: null };
          }
        })
      );
      return { marks, predictions };
    })
  );

  const breadcrumbsSchema = generateStructuredData("breadcrumbs", {
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: `${exam.name} Predictor`, url: `/${exam.slug}/rank-predictor` },
      { name: "Marks vs Rank Trends", url: `/${exam.slug}/marks-vs-rank` },
    ],
  });

  const customFaq = (seoData.exams as any)[exam.slug]?.faq || [];
  const faqSchema = generateStructuredData("faq", { faqs: customFaq });

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: `${exam.name} Predictor`, href: `/${exam.slug}/rank-predictor` },
          { label: "Marks vs Rank Trends", href: `/${exam.slug}/marks-vs-rank` },
        ]}
      />

      {/* Header and explanation */}
      <div className="mt-6 flex flex-col gap-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg w-fit dark:bg-indigo-950/50 dark:text-indigo-400">
          <LineChart className="w-4 h-4 text-indigo-500" />
          Multi-Year Comparative Index
        </span>

        <h1 className="text-4xl font-black text-slate-800 tracking-tight dark:text-zinc-50">
          {exam.name} Marks vs Rank Trends
        </h1>

        <p className="text-base sm:text-lg font-bold text-slate-500 max-w-3xl leading-relaxed dark:text-zinc-400">
          Compare how the exact same score mapped to entrance ranks in 2023, 2024, and 2025. Evaluating these shifts reveals preparation depth and scoring inflation.
        </p>
      </div>

      {/* Ranks comparison grid card */}
      <Card variant="flat" className="p-0 overflow-hidden bg-white border border-slate-200/80 mt-10 dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
                <th className="px-6 py-4.5 text-sm font-black uppercase tracking-wider">Marks Target</th>
                {sortedYears.map((year) => (
                  <th key={year} className="px-6 py-4.5 text-sm font-black uppercase tracking-wider">
                    {year} Expected Rank
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {comparativeData.map((row) => (
                <tr
                  key={row.marks}
                  className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors font-bold text-slate-700 dark:text-zinc-300"
                >
                  <td className="px-6 py-5 text-lg font-black text-slate-900 dark:text-zinc-100">
                    {row.marks} marks
                  </td>
                  {row.predictions.map((p) => (
                    <td key={p.year} className="px-6 py-5">
                      {p.rank ? (
                        <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-black ${
                          p.year === 2025 
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                            : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}>
                          #{p.rank.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-slate-400 dark:text-zinc-500">N/A</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Callouts & Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Link to predictor */}
        <Card variant="playful" className="flex flex-col p-6 items-start">
          <div className="bg-indigo-100 text-indigo-600 p-2.5 rounded-xl mb-4 dark:bg-indigo-950 dark:text-indigo-400">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-zinc-100">Test Your Custom Marks</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
            Our multi-year index above is based on milestone points. Use the live rank predictor to calculate your exact expected score mapped instantly via dynamic falling filter queries.
          </p>
          <Link
            href={`/${exam.slug}/rank-predictor`}
            className="mt-6 flex items-center gap-1.5 text-indigo-600 font-extrabold hover:underline dark:text-indigo-400"
          >
            Open Live Predictor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        {/* Link to granular tables */}
        <Card variant="playful" className="flex flex-col p-6 items-start">
          <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl mb-4 dark:bg-amber-950 dark:text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-zinc-100">Analyze Detailed Ranks Tables</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
            Want to see candidate category ranks, quotas, and gender benchmarks row-by-row? View the full tabulated historical directories for each calendar year.
          </p>
          <Link
            href={`/${exam.slug}/previous-year-ranks`}
            className="mt-6 flex items-center gap-1.5 text-amber-600 font-extrabold hover:underline dark:text-amber-400"
          >
            Explore Historical Years
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>

      {/* Dynamic Student Blog Callout */}
      <Card variant="flat" className="mt-12 p-6 bg-gradient-to-r from-amber-50/50 to-amber-100/20 border border-amber-100 rounded-3xl dark:from-zinc-900/50 dark:to-zinc-900/30 dark:border-amber-900/30 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 dark:bg-amber-950/50 dark:text-amber-400 text-lg">
          📖
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-base font-black text-slate-800 dark:text-zinc-200">
            Confused about college choices or counseling?
          </h4>
          <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1">
            Read helpful branch-picking guides, prep strategies, and honest campus reviews written by fellow students!
          </p>
        </div>
        <a
          href="https://blog.studiva.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-extrabold text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all shadow-[0_2px_0_0_#e2e8f0] active:translate-y-[2px] active:shadow-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_2px_0_0_#27272a] dark:hover:bg-zinc-850 shrink-0"
        >
          Read Student Blog
        </a>
      </Card>

      {/* Informative description */}
      <section className="mt-16 bg-white dark:bg-zinc-900/50 rounded-3xl p-8 border-2 border-slate-200/80 dark:border-zinc-800">
        <h2 className="text-xl font-black text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
          <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
          How to Interpret score-vs-rank changes
        </h2>
        <p className="text-sm font-bold text-slate-400 leading-relaxed dark:text-zinc-500 mb-4">
          When reviewing our multi-year comparison, you will notice that for the same marks, ranks can fluctuate. This is normal. A rise in the rank number (meaning a worse rank) indicates score inflation, which typically occurs when an exam paper is easier or preparation quality reaches higher benchmarks.
        </p>
        <p className="text-sm font-bold text-slate-400 leading-relaxed dark:text-zinc-500">
          Comparing these numbers provides a realistic upper and lower limit. If your marks are 180, you can safely estimate that your rank is highly likely to lie within the bounds defined by the best-case difficulty year and the worst-case difficulty year.
        </p>
      </section>
    </div>
  );
}
