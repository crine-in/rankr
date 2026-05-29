import { Metadata } from "next";
import { notFound } from "next/navigation";
import { exams } from "../../../lib/config/exams";
import { PredictorLandingPage } from "../../../components/PredictorLandingPage";

interface PageProps {
  params: Promise<{ exam: string }>;
}

// Generate dynamic SEO metadata for any registered exam
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) return { title: "Predictor Not Found" };

  return {
    title: `${exam.name} Rank Predictor - Predict Expected Rank Instantly`,
    description: `Calculate your expected ${exam.name} CRL and category ranks instantly! Data-backed linear interpolation based on actual historical score datasets.`,
    keywords: [`${exam.name} rank predictor`, `${exam.name} rank vs marks`, `expected rank`, `${exam.name} rank calculator`],
  };
}

export default async function DynamicPredictorPage({ params }: PageProps) {
  const { exam: examSlug } = await params;
  const exam = exams.find((e) => e.slug === examSlug);

  if (!exam) {
    notFound();
  }

  return <PredictorLandingPage examSlug={exam.slug} />;
}
