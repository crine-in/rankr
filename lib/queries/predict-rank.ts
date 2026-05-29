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

  // Define fallback strategies in sequence
  // Fallback order:
  // 1. Exact match (exam, category, gender)
  // 2. Category only (exam, category)
  // 3. Gender only (exam, gender)
  // 4. Baseline (exam only)
  const strategies = [
    {
      name: "exact",
      label: "exact category and gender matching",
      filter: (q: any) => {
        let res = q.eq("exam", exam);
        if (year) res = res.eq("year", year);
        if (category) res = res.eq("category", category);
        else res = res.is("category", null);
        if (gender) res = res.eq("gender", gender);
        else res = res.is("gender", null);
        return res;
      },
      confidenceBase: 88,
    },
    {
      name: "category",
      label: "category-only matching",
      filter: (q: any) => {
        let res = q.eq("exam", exam);
        if (year) res = res.eq("year", year);
        if (category) res = res.eq("category", category);
        else res = res.is("category", null);
        return res;
      },
      confidenceBase: 75,
    },
    {
      name: "gender",
      label: "gender-only matching",
      filter: (q: any) => {
        let res = q.eq("exam", exam);
        if (year) res = res.eq("year", year);
        if (gender) res = res.eq("gender", gender);
        else res = res.is("gender", null);
        return res;
      },
      confidenceBase: 65,
    },
    {
      name: "all",
      label: "general exam-wide matching",
      filter: (q: any) => {
        let res = q.eq("exam", exam);
        if (year) res = res.eq("year", year);
        return res;
      },
      confidenceBase: 50,
    },
  ];

  let selectedStrategy = strategies[3]; // Default to 'all' baseline
  let records: any[] = [];
  
  // Attempt each matching strategy in order.
  // We need at least 3 records to interpolate reliably.
  for (const strategy of strategies) {
    // If filter criteria are not applicable, skip
    if (strategy.name === "exact" && !category && !gender) continue;
    if (strategy.name === "category" && !category) continue;
    if (strategy.name === "gender" && !gender) continue;

    const baseQuery = supabase.from("rank_data").select("marks, rank, year");
    const filteredQuery = strategy.filter(baseQuery);
    
    // Fetch all relevant points sorted by marks so we can search easily
    const { data, error } = await filteredQuery.order("marks", { ascending: true });
    
    if (!error && data && data.length >= 3) {
      records = data;
      selectedStrategy = strategy;
      break;
    }
  }

  // If still no records, default to any exam records whatsoever
  if (records.length === 0) {
    let fallbackQuery = supabase
      .from("rank_data")
      .select("marks, rank, year")
      .eq("exam", exam);
      
    if (year) {
      fallbackQuery = fallbackQuery.eq("year", year);
    }
    
    const { data } = await fallbackQuery.order("marks", { ascending: true });
    
    if (data && data.length > 0) {
      records = data;
    } else {
      // Complete backup failsafe in case database has no data whatsoever
      throw new Error(`No data found for exam ${exam}. Seed database first.`);
    }
  }

  // Weight predictions by proximity to current or target year
  const targetYear = year || new Date().getFullYear();
  
  const recordsByYear: { [key: number]: any[] } = {};
  records.forEach((r) => {
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
    const flatPoints = records
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

  const sampleBonus = Math.min(5, Math.floor(records.length / 5));

  // Compute confidence
  let confidence = selectedStrategy.confidenceBase + exactBonus + densityBonus + sampleBonus;
  confidence = Math.min(98, Math.max(50, confidence));

  // Generate range bounds based on confidence
  const errorMargin = (100 - confidence) * 0.002;
  const minRank = Math.max(1, Math.round(roundedPredictedRank * (1 - errorMargin)));
  const maxRank = Math.round(roundedPredictedRank * (1 + errorMargin));

  // Natural language explanation of data matching quality
  const yearsRepresented = yearsAvailable.sort((a, b) => a - b).join(", ");
  const dataPointsUsed = `Prediction calculated from ${selectedStrategy.label} over historical exam records from ${yearsRepresented} (weighted towards ${targetYear}).`;

  return {
    predictedRank: roundedPredictedRank,
    rankRange: {
      min: minRank,
      max: maxRank,
    },
    confidence,
    dataPointsUsed,
    fallbackLevel: selectedStrategy.name as "exact" | "category" | "gender" | "all",
  };
}
