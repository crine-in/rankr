import React from "react";
import Link from "next/link";
import { exams } from "../lib/config/exams";
import { getYearlyStats, generateNaturalSummary } from "../lib/queries/statistics";
import { Card } from "./ui/Card";
import { Breadcrumbs } from "./Breadcrumbs";
import { HomePredictorWrapper } from "./HomePredictorWrapper";
import {
  Award,
  BookOpen,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";

interface PredictorLandingPageProps {
  examSlug: string;
}

export const PredictorLandingPage: React.FC<PredictorLandingPageProps> = async ({
  examSlug,
}) => {
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-800 dark:text-zinc-50">Exam Not Found</h1>
        <p className="text-slate-400 mt-2">The competitive exam you are looking for does not exist.</p>
        <Link href="/" className="text-indigo-600 font-bold hover:underline mt-4 inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  // 1. Query real statistics for this exam
  const statsList = await getYearlyStats(examSlug);
  const textSummary = await generateNaturalSummary(exam.name, examSlug);

  // 2. Prepare dynamic FAQs for JSON-LD schema
  const faqs = [
    {
      q: `How accurate is the Rankr ${exam.name} Rank Predictor?`,
      a: `Our predictor is highly accurate because it uses a real database of student scores from 2023, 2024, and 2025. By utilizing linear interpolation between the nearest actual scores above and below your inputs, we map your performance to highly granular, historically grounded ranges instead of using simple general estimations.`,
    },
    {
      q: `Do I need to sign up or log in to predict my ${exam.name} rank?`,
      a: `No! Rankr is built on a strictly anonymous, no-auth philosophy. You do not need to enter your email, name, phone number, or create an account. Simply input your marks to get your predicted rank instantly and for free.`,
    },
    {
      q: `How does category and gender filtering affect the rank prediction?`,
      a: `Competitive exams like ${exam.name} have distinct reservation categories and gender quotas which significantly affect candidate ranks. Our engine performs sequential query fallback: it first attempts an exact match on your selected category and gender. If insufficient data exists, it falls back to category-only and general exam-wide benchmarks, maintaining mathematical relevance at every level.`,
    },
    {
      q: `How does the linear interpolation algorithm work?`,
      a: `Linear interpolation is a mathematical method of curve fitting using linear polynomials to construct new data points within the range of a discrete set of known data points. If you enter a score of 195, and our database contains records for 200 marks (Rank 200) and 190 marks (Rank 300), the engine calculates the exact ratio to predict your rank at #250.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Dynamic SEO JSON-LD FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: `${exam.name} Predictor`, href: `/${exam.slug}/rank-predictor` }]} />

      {/* Hero layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
        {/* Left Side: Dynamic Text & Stats */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg w-fit dark:bg-indigo-950 dark:text-indigo-400">
            <Award className="w-4 h-4 text-indigo-500 fill-current" />
            Official Benchmark Platform
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight dark:text-zinc-50 leading-tight">
            {exam.name} Rank Predictor
          </h1>

          <p className="text-lg font-bold text-slate-500 leading-relaxed dark:text-zinc-400">
            {textSummary}
          </p>

          {/* Real Statistics Display Cards */}
          {statsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {statsList.map((stat) => (
                <Card variant="flat" key={stat.year} className="p-5 border border-slate-200/80 bg-slate-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black uppercase tracking-widest">{stat.year} Data</span>
                  </div>
                  <div className="text-2xl font-black text-slate-800 dark:text-zinc-200">
                    {stat.total_records}
                  </div>
                  <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-1">
                    Student Records
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href={`/${exam.slug}/marks-vs-rank`}
              className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-400 dark:hover:bg-indigo-900 rounded-xl transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              View Marks vs Rank Table
            </Link>

            <Link
              href={`/${exam.slug}/previous-year-ranks`}
              className="inline-flex items-center gap-1.5 px-5 py-3 text-sm font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Analyze Historical Trends
            </Link>
          </div>

          {/* Natural Callout: Handcrafted Exam Notes */}
          <Card variant="flat" className="mt-8 p-6 bg-gradient-to-r from-indigo-50/50 to-indigo-100/20 border border-indigo-100 rounded-3xl dark:from-zinc-900/50 dark:to-zinc-900/30 dark:border-indigo-900/30 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 dark:bg-indigo-950/50 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-base font-black text-slate-800 dark:text-zinc-200">
                Struggling with your {exam.name} prep?
              </h4>
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 mt-1">
                Grab free handcrafted study notes, solved previous papers, and quick syllabus mock tests to boost your final revision!
              </p>
            </div>
            <a
              href="https://www.studiva.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_2px_0_0_#4338ca] active:translate-y-[2px] active:shadow-none shrink-0"
            >
              Get Free Notes
            </a>
          </Card>
        </div>

        {/* Right Side: Prediction Form Wrapper */}
        <div className="lg:col-span-5 w-full sticky top-24">
          <HomePredictorWrapper initialExamSlug={examSlug} />
        </div>
      </div>

      {/* Bottom Segment: Playful FAQ section */}
      <section className="mt-20 border-t border-slate-200 pt-16 dark:border-zinc-800">
        <h2 className="text-3xl font-black text-slate-800 dark:text-zinc-50 tracking-tight flex items-center gap-2 mb-10">
          <HelpCircle className="w-7 h-7 text-indigo-600" />
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <Card key={index} variant="flat" className="p-6 bg-white dark:bg-zinc-900/50">
              <h3 className="text-lg font-black text-slate-800 dark:text-zinc-200 mb-2">
                {faq.q}
              </h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed dark:text-zinc-500">
                {faq.a}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
