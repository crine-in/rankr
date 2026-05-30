import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import { Trophy, Award, Sparkles, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/react";
import { generateSEOMetadata } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  ...generateSEOMetadata({}),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rankr.crine.in"),
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
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
              <ThemeToggle />
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

        {/* Top Infinite Marquee Promotion Banner (sitting below navigation header) */}
        <div className="relative w-full overflow-hidden bg-slate-900 text-white py-2 text-xs font-black tracking-wide border-b border-slate-800 dark:bg-zinc-950 dark:border-zinc-900 select-none animate-marquee-hover-pause">
          <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
            {/* Slide block 1 */}
            <div className="flex items-center gap-16">
              <span>
                🚀 Handcrafted study notes, mock tests & exam prep at{" "}
                <a
                  href="https://www.studiva.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-indigo-400 hover:text-indigo-300 transition-colors font-extrabold"
                >
                  www.studiva.co.in
                </a>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span>
                💻 Need a website or mobile app? Let's build your project at{" "}
                <a
                  href="https://www.crine.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-400 hover:text-emerald-300 transition-colors font-extrabold"
                >
                  www.crine.in
                </a>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
            {/* Slide block 2 (Duplicate for infinite seamless looping) */}
            <div className="flex items-center gap-16">
              <span>
                🚀 Handcrafted study notes, mock tests & exam prep at{" "}
                <a
                  href="https://www.studiva.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-indigo-400 hover:text-indigo-300 transition-colors font-extrabold"
                >
                  www.studiva.co.in
                </a>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span>
                💻 Need a website or mobile app? Let's build your project at{" "}
                <a
                  href="https://www.crine.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-emerald-400 hover:text-emerald-300 transition-colors font-extrabold"
                >
                  www.crine.in
                </a>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t-2 border-slate-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950 mt-auto">
          <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Column 1: Brand & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Link href="/" className="flex items-center gap-2 font-black text-xl text-indigo-600 dark:text-indigo-400">
                <div className="bg-indigo-600 text-white p-1 rounded-lg">
                  <Trophy className="w-4 h-4" />
                </div>
                <span>Rankr</span>
              </Link>
              <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 text-center md:text-left leading-relaxed">
                Playful & interactive entrance percentile analytics built by students, for students.
              </p>
              <div className="text-xs font-black text-slate-400 dark:text-zinc-500 mt-4">
                © {new Date().getFullYear()} Rankr. Created for Students.
              </div>
            </div>

            {/* Column 2: Entrance Analytics Links */}
            <div className="flex flex-col gap-3 items-center md:items-start">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Entrance Analytics
              </span>
              <div className="flex flex-col items-center md:items-start gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400">
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
            </div>

            {/* Column 3: Partner Resources / Ecosystem Promos */}
            <div className="flex flex-col gap-3 items-center md:items-start">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                Free Student Resources
              </span>
              <div className="flex flex-col items-center md:items-start gap-2 text-sm font-bold text-slate-500 dark:text-zinc-400">
                <a
                  href="https://www.studiva.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Handcrafted Study Notes
                </a>
                <a
                  href="https://blog.studiva.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Student Counseling Blog
                </a>
                <a
                  href="https://www.crine.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-extrabold text-indigo-600 dark:text-indigo-400"
                >
                  Build a Custom Website or App
                </a>
              </div>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
