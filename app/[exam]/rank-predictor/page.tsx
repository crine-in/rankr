import { Metadata } from "next";
import { notFound } from "next/navigation";
import { exams } from "../../../lib/config/exams";
import { PredictorLandingPage } from "../../../components/PredictorLandingPage";
import { generateSEOMetadata, generateStructuredData } from "../../../lib/seo";
import seoData from "../../../lib/config/seo-metadata.json";

interface PageProps {
  params: Promise<{ exam: string }>;
}

// Generate dynamic SEO metadata for any registered exam
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) return { title: "Predictor Not Found" };

  return generateSEOMetadata({
    examSlug: exam.slug,
    pageType: "predictor",
    canonicalPath: `/${exam.slug}/rank-predictor`,
  });
}

export default async function DynamicPredictorPage({ params }: PageProps) {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) {
    notFound();
  }

  // Generate structured data
  const breadcrumbsSchema = generateStructuredData("breadcrumbs", {
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: `${exam.name} Rank Predictor`, url: `/${exam.slug}/rank-predictor` },
    ],
  });

  const customFaq = (seoData.exams as any)[exam.slug]?.faq || [];
  const faqSchema = generateStructuredData("faq", { faqs: customFaq });
  const appSchema = generateStructuredData("software_application", { examName: exam.name });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <PredictorLandingPage examSlug={exam.slug} />
    </>
  );
}

