"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read exact current layout class on hydration
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.theme = "light";
    }
  };

  if (!mounted) {
    return (
      <div className="w-9.5 h-9.5 rounded-xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex items-center justify-center w-9.5 h-9.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 hover:scale-105 active:scale-95 text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-400 transition-all duration-300 shadow-[2px_2px_0_0_#e2e8f0] dark:shadow-[2px_2px_0_0_#18181b] hover:shadow-[3px_3px_0_0_#e2e8f0] dark:hover:shadow-[3px_3px_0_0_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <span
          className={`absolute transform transition-all duration-500 ease-in-out ${
            theme === "dark" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-8 opacity-0 -rotate-90"
          }`}
        >
          <Moon className="w-5 h-5 text-indigo-500 fill-indigo-400 dark:text-indigo-400 dark:fill-indigo-500/20" />
        </span>
        <span
          className={`absolute transform transition-all duration-500 ease-in-out ${
            theme === "light" ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-8 opacity-0 rotate-90"
          }`}
        >
          <Sun className="w-5 h-5 text-amber-500 fill-amber-100" />
        </span>
      </div>
    </button>
  );
};
