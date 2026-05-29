import { MetadataRoute } from "next";
import { exams } from "../lib/config/exams";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://rankr.in";
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Dynamic paths for each exam from our configuration
  exams.forEach((exam) => {
    // 1. Exam Landing Predictor
    routes.push({
      url: `${domain}/${exam.slug}/rank-predictor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // 2. Exam Previous Year list
    routes.push({
      url: `${domain}/${exam.slug}/previous-year-ranks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // 3. Exam Marks vs Rank comparisons
    routes.push({
      url: `${domain}/${exam.slug}/marks-vs-rank`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // 4. Specific Year Tables
    exam.years.forEach((year) => {
      routes.push({
        url: `${domain}/${exam.slug}/${year}-ranks`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  return routes;
}
