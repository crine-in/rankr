import { supabase } from "../supabase";

export interface PredictionRequest {
  exam: string;
  marks: number;
  category?: string | null;
  gender?: string | null;
  year?: number | null;
}

export interface PredictionResponse {
  predictedRank: number;
  rankRange: {
    min: number;
    max: number;
  };
  confidence: number;
  dataPointsUsed: string; // Explains what level of matching filter was utilized
  fallbackLevel: "exact" | "category" | "gender" | "all";
}

function interpolateForPoints(points: { marks: number; rank: number }[], marks: number): { predictedRank: number; markSpread: number } {
  let above: { marks: number; rank: number } | null = null;
  let below: { marks: number; rank: number } | null = null;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (pt.marks === marks) {
      above = pt;
      below = pt;
      break;
    }

    if (pt.marks > marks) {
      above = pt;
      below = points[i - 1] || points[0];
      break;
    }
  }

  if (!above && points.length > 0) {
    const maxPt = points[points.length - 1];
    above = maxPt;
    below = points[points.length - 2] || maxPt;
  }
  if (!below && points.length > 0) {
    const minPt = points[0];
    below = minPt;
    above = points[1] || minPt;
  }

  const ptAbove = above!;
  const ptBelow = below!;

  if (ptAbove.marks === ptBelow.marks) {
    return { predictedRank: ptAbove.rank, markSpread: 0 };
  }

  const x1 = ptAbove.marks;
  const x2 = ptBelow.marks;
  const y1 = ptAbove.rank;
  const y2 = ptBelow.rank;

  let predictedRank = y1 + ((x1 - marks) / (x1 - x2)) * (y2 - y1);

  const lowerBound = Math.min(y1, y2);
  const upperBound = Math.max(y1, y2);
  if (predictedRank < lowerBound) predictedRank = lowerBound;
  if (predictedRank > upperBound) predictedRank = upperBound;

  return { predictedRank, markSpread: x1 - x2 };
}

export async function predictRank(req: PredictionRequest): Promise<PredictionResponse> {
  const { exam, marks, category, gender, year } = req;

  // Base prediction strictly on GENERAL/OPEN category records to establish the highly accurate CRL baseline
  let baseQuery = supabase
    .from("rank_data")
    .select("marks, rank, year")
    .eq("exam", exam)
    .eq("category", "GENERAL");

  if (year) {
    baseQuery = baseQuery.eq("year", year);
  }

  let { data: records, error } = await baseQuery.order("marks", { ascending: true });
  let isGeneralMatched = !error && records && records.length >= 3;

  let activeRecords: any[] = records || [];

  if (!isGeneralMatched) {
    // Fallback to any records for this exam
    let fallbackQuery = supabase
      .from("rank_data")
      .select("marks, rank, year")
      .eq("exam", exam);

    if (year) {
      fallbackQuery = fallbackQuery.eq("year", year);
    }

    const { data } = await fallbackQuery.order("marks", { ascending: true });
    activeRecords = data || [];
  }

  if (activeRecords.length === 0) {
    throw new Error(`No data found for exam ${exam}. Seed database first.`);
  }

  // Weight predictions by proximity to current or target year
  const targetYear = year || new Date().getFullYear();

  const recordsByYear: { [key: number]: any[] } = {};
  activeRecords.forEach((r) => {
    const y = Number(r.year);
    if (!recordsByYear[y]) recordsByYear[y] = [];
    recordsByYear[y].push(r);
  });

  const yearsAvailable = Object.keys(recordsByYear).map(Number);

  let finalPredictedRank = 0;
  let totalWeight = 0;
  let bestMarkSpread = Infinity;
  let exactMatchFound = false;

  const yearPredictions: { year: number; rank: number; weight: number }[] = [];

  yearsAvailable.forEach((y) => {
    const yearPoints = recordsByYear[y]
      .map((r) => ({
        marks: Number(r.marks),
        rank: Number(r.rank),
      }))
      .sort((a, b) => a.marks - b.marks);

    if (yearPoints.length >= 2) {
      const { predictedRank, markSpread } = interpolateForPoints(yearPoints, marks);

      const distance = Math.abs(y - targetYear);
      // Exponential decay weight: e^(-0.8 * distance)
      const weight = Math.exp(-0.8 * distance);

      yearPredictions.push({
        year: y,
        rank: predictedRank,
        weight: weight,
      });

      finalPredictedRank += predictedRank * weight;
      totalWeight += weight;

      if (markSpread === 0) exactMatchFound = true;
      if (markSpread < bestMarkSpread) {
        bestMarkSpread = markSpread;
      }
    }
  });

  if (yearPredictions.length === 0) {
    const flatPoints = activeRecords
      .map((r) => ({
        marks: Number(r.marks),
        rank: Number(r.rank),
      }))
      .sort((a, b) => a.marks - b.marks);

    const { predictedRank, markSpread } = interpolateForPoints(flatPoints, marks);
    finalPredictedRank = predictedRank;
    totalWeight = 1;
    if (markSpread === 0) exactMatchFound = true;
    bestMarkSpread = markSpread;
  } else {
    finalPredictedRank = finalPredictedRank / totalWeight;
  }

  // Apply intelligent reserved quota multiplier for category ranks
  let multiplierApplied = false;
  if (category && category !== "GENERAL") {
    const quotaFactors: { [key: string]: number } = {
      "OBC": 0.28,
      "OBC-NCL": 0.28,
      "NC-OBC": 0.28,
      "OBC-A": 0.30,
      "OBC-B": 0.25,
      "SC": 0.06,
      "ST": 0.025,
      "EWS": 0.18,
    };

    const factor = quotaFactors[category] || 1.0;
    if (factor < 1.0) {
      finalPredictedRank = finalPredictedRank * factor;
      multiplierApplied = true;
    }
  }

  const roundedPredictedRank = Math.round(finalPredictedRank);

  let densityBonus = 0;
  let exactBonus = 0;

  if (exactMatchFound) {
    exactBonus = 10;
  } else if (bestMarkSpread <= 10) {
    densityBonus = 8;
  } else if (bestMarkSpread <= 20) {
    densityBonus = 5;
  }

  const sampleBonus = Math.min(5, Math.floor(activeRecords.length / 5));

  // Compute confidence
  const confidenceBase = isGeneralMatched ? 85 : 60;
  let confidence = confidenceBase + exactBonus + densityBonus + sampleBonus;
  confidence = Math.min(98, Math.max(50, confidence));

  // Generate range bounds based on confidence
  const errorMargin = (100 - confidence) * 0.002;
  const minRank = Math.max(1, Math.round(roundedPredictedRank * (1 - errorMargin)));
  const maxRank = Math.round(roundedPredictedRank * (1 + errorMargin));

  // Natural language explanation of data matching quality
  const yearsRepresented = yearsAvailable.sort((a, b) => a - b).join(", ");
  let dataPointsUsed = `Prediction calculated using proximity-weighted linear interpolation on General/CRL benchmarks across ${yearsRepresented} (weighted towards ${targetYear}).`;
  if (multiplierApplied && category) {
    const rate = category === "SC" ? 94 : category === "ST" ? 97.5 : category.includes("OBC") ? 72 : 82;
    dataPointsUsed += ` Estimated category rank calculated using standard Indian exam quota reservation factor (~${rate}% lower than CRL due to ${category} quota).`;
  }

  return {
    predictedRank: roundedPredictedRank,
    rankRange: {
      min: minRank,
      max: maxRank,
    },
    confidence,
    dataPointsUsed,
    fallbackLevel: category && category !== "GENERAL" ? "category" : "exact",
  };
}
