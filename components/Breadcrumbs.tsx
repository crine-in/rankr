import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  // Dynamically generate Google breadcrumb structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": typeof window !== "undefined" ? window.location.origin + item.href : `https://rankr.in${item.href}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full py-4 px-1 select-none">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm font-bold text-slate-400 dark:text-zinc-500">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && <span className="text-slate-300 dark:text-zinc-700">/</span>}
              
              {isLast ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold max-w-[200px] truncate sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
