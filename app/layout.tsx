import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { Trophy, Award, Sparkles, BookOpen } from "lucide-react";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Rankr - Playful & Accurate Rank Predictor for Competitive Exams",
    template: "%s | Rankr",
  },
  description: "Predict your competitive exam rank instantly! High-impact, interpolation-backed analysis for JEE Main, NEET, GATE, and CAT with no login required.",
  keywords: ["JEE Main rank predictor", "NEET rank predictor", "GATE rank predictor", "CAT percentile predictor", "marks vs rank", "rank prediction"],
  authors: [{ name: "Rankr Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rankr.in"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rankr.in",
    siteName: "Rankr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rankr Prediction Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rankr - Competitive Exam Rank Predictor",
    description: "Fun, student-first rank prediction platform for JEE, NEET, GATE, and CAT. Zero signups, instant data-backed answers.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b-2 border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/80">
          <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-black text-2xl tracking-tight text-indigo-600 dark:text-indigo-400 group"
            >
              <div className="bg-indigo-600 text-white p-1.5 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[2px_2px_0_0_#4338ca]">
                <Trophy className="w-5 h-5" />
              </div>
              <span>Rank<span className="text-amber-500">r</span></span>
            </Link>

            <nav className="hidden sm:flex items-center gap-6 text-sm font-black">
              <Link href="/jee-main/rank-predictor" className="text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors">
                JEE Main
              </Link>
              <Link href="/neet/rank-predictor" className="text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors">
                NEET
              </Link>
              <Link href="/gate/rank-predictor" className="text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors">
                GATE
              </Link>
              <Link href="/cat/rank-predictor" className="text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors">
                CAT
              </Link>
              <Link href="/wbjee/rank-predictor" className="text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors">
                WBJEE
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/jee-main/rank-predictor"
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-[0_3px_0_0_#4338ca] active:translate-y-[3px] active:shadow-none"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try Predictor
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t-2 border-slate-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950 mt-auto">
          <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
                <div className="bg-indigo-600 text-white p-1 rounded-lg">
                  <Trophy className="w-4 h-4" />
                </div>
                <span>Rankr</span>
              </Link>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 text-center md:text-left">
                Playful & interactive entrance percentile analytics.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-slate-500 dark:text-zinc-400">
              <Link href="/jee-main/marks-vs-rank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                JEE Marks vs Rank
              </Link>
              <Link href="/neet/marks-vs-rank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                NEET Marks vs Rank
              </Link>
              <Link href="/gate/marks-vs-rank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                GATE Marks vs Rank
              </Link>
              <Link href="/cat/marks-vs-rank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                CAT Percentiles
              </Link>
              <Link href="/wbjee/marks-vs-rank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                WBJEE Marks vs Rank
              </Link>
            </div>

            <div className="text-xs font-black text-slate-400 dark:text-zinc-500">
              © {new Date().getFullYear()} Rankr. Created for Students.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
