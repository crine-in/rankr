import type { Metadata } from "next";
import seoData from "./config/seo-metadata.json";

export interface SEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  examSlug?: string;
  pageType?: "predictor" | "previousYear" | "marksVsRank" | "yearRanks";
  year?: number;
}

/**
 * Generates Next.js Metadata dynamically using central configuration values
 */
export function generateSEOMetadata(options: SEOOptions): Metadata {
  const site = seoData.site;
  let finalTitle = options.title || site.defaultTitle;
  let finalDescription = options.description || site.defaultDescription;
  let finalKeywords = [...(options.keywords || []), ...site.defaultKeywords];
  const canonicalUrl = `${site.url}${options.canonicalPath || ""}`;
  const ogImg = options.ogImage || site.ogImage;

  // Attempt to resolve from Central JSON configuration
  if (options.examSlug) {
    const exam = (seoData.exams as any)[options.examSlug];
    if (exam) {
      // Merge keywords
      if (exam.keywords) {
        finalKeywords = [...exam.keywords, ...finalKeywords];
      }

      if (options.pageType === "predictor") {
        finalTitle = exam.predictorTitle;
        finalDescription = exam.predictorDescription;
      } else if (options.pageType === "previousYear") {
        finalTitle = exam.previousYearTitle;
        finalDescription = exam.previousYearDescription;
      } else if (options.pageType === "marksVsRank") {
        finalTitle = exam.marksVsRankTitle;
        finalDescription = exam.marksVsRankDescription;
      } else if (options.pageType === "yearRanks" && options.year) {
        finalTitle = exam.yearRanksTitleTemplate.replace(/{year}/g, String(options.year));
        finalDescription = exam.yearRanksDescriptionTemplate.replace(/{year}/g, String(options.year));
      }
    }
  }

  // Deduplicate keywords
  finalKeywords = Array.from(new Set(finalKeywords));

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      title: finalTitle,
      description: finalDescription,
      siteName: site.name,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: `${site.name} Prediction Platform`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImg],
      creator: site.twitterHandle,
    },
  };
}

/**
 * Builds JSON-LD structured data schemas for dynamic embedding
 */
export function generateStructuredData(
  type: "website" | "organization" | "breadcrumbs" | "faq" | "software_application" | "dataset",
  options: {
    breadcrumbs?: { name: string; url: string }[];
    faqs?: { q: string; a: string }[];
    examName?: string;
    year?: number;
    datasetStats?: {
      recordCount: number;
      highestMarks: number;
      bestRank: number;
    };
  }
) {
  const site = seoData.site;

  switch (type) {
    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": site.name,
        "url": site.url,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${site.url}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

    case "organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": site.name,
        "url": site.url,
        "logo": site.logoUrl,
        "sameAs": []
      };

    case "breadcrumbs":
      if (!options.breadcrumbs) return null;
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": options.breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${site.url}${item.url}`
        }))
      };

    case "faq":
      const faqsList = options.faqs || [];
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqsList.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };

    case "software_application":
      if (!options.examName) return null;
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `${options.examName} Expected Rank Calculator`,
        "operatingSystem": "All",
        "applicationCategory": "EducationalApplication",
        "browserRequirements": "Requires HTML5, Javascript, CSS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      };

    case "dataset":
      if (!options.examName || !options.year || !options.datasetStats) return null;
      const { recordCount, highestMarks, bestRank } = options.datasetStats;
      return {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": `${options.examName} ${options.year} Marks vs Rank Historical Records Table`,
        "description": `Searchable student database of actual candidate scores from the West Bengal Joint Entrance Examination / ${options.examName} in calendar year ${options.year}. Contains ${recordCount} student records, with the highest score logged at ${highestMarks} and the best rank at #${bestRank}.`,
        "license": "https://creativecommons.org/publicdomain/zero/1.0/",
        "creator": {
          "@type": "Organization",
          "name": site.name,
          "url": site.url
        },
        "temporalCoverage": `${options.year}`,
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Marks",
            "description": "Candidate raw test marks"
          },
          {
            "@type": "PropertyValue",
            "name": "Rank",
            "description": "Common merit list or category merit list rank"
          },
          {
            "@type": "PropertyValue",
            "name": "Category",
            "description": "Applicant reservation status"
          },
          {
            "@type": "PropertyValue",
            "name": "Gender",
            "description": "Applicant gender"
          }
        ]
      };

    default:
      return null;
  }
}
