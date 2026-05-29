import { supabase } from "../supabase";

export interface YearlyStats {
  exam: string;
  year: number;
  total_records: number;
  avg_marks: number;
  avg_rank: number;
  best_rank: number;
  highest_marks: number;
}

export async function getYearlyStats(exam: string, year?: number): Promise<YearlyStats[]> {
  let query = supabase.from("yearly_rank_stats").select("*").eq("exam", exam);

  if (year) {
    query = query.eq("year", year);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    // If the materialized view fails or is not refreshed, fall back to a raw database aggregation query
    console.warn("yearly_rank_stats query failed, falling back to direct aggregation of rank_data");
    
    let rawQuery = supabase
      .from("rank_data")
      .select("year, marks, rank")
      .eq("exam", exam);
      
    if (year) {
      rawQuery = rawQuery.eq("year", year);
    }
    
    const { data: rawData, error: rawError } = await rawQuery;
    
    if (rawError || !rawData || rawData.length === 0) {
      return [];
    }
    
    // Group and aggregate manually
    const groups: { [key: number]: any[] } = {};
    rawData.forEach((r: any) => {
      const y = r.year;
      if (!groups[y]) groups[y] = [];
      groups[y].push(r);
    });
    
    return Object.keys(groups).map((yrStr) => {
      const yr = Number(yrStr);
      const rows = groups[yr];
      const marks = rows.map((r) => Number(r.marks));
      const ranks = rows.map((r) => Number(r.rank));
      
      const sumMarks = marks.reduce((a, b) => a + b, 0);
      const sumRanks = ranks.reduce((a, b) => a + b, 0);
      
      return {
        exam,
        year: yr,
        total_records: rows.length,
        avg_marks: Number((sumMarks / rows.length).toFixed(2)),
        avg_rank: Number((sumRanks / rows.length).toFixed(2)),
        best_rank: Math.min(...ranks),
        highest_marks: Number(Math.max(...marks).toFixed(2)),
      };
    });
  }

  return data.map((r: any) => ({
    exam: r.exam,
    year: Number(r.year),
    total_records: Number(r.total_records),
    avg_marks: Number(r.avg_marks),
    avg_rank: Number(r.avg_rank),
    best_rank: Number(r.best_rank),
    highest_marks: Number(r.highest_marks),
  }));
}

export async function generateNaturalSummary(examName: string, examSlug: string, year?: number): Promise<string> {
  const statsList = await getYearlyStats(examSlug, year);
  
  if (statsList.length === 0) {
    return `Analyze historical rank-to-marks benchmarks for ${examName} to predict your expected percentile and entrance outcomes.`;
  }
  
  if (year) {
    const stats = statsList[0];
    return `For ${examName} in ${year}, we analyzed a total of ${stats.total_records} historical student records. The highest score recorded in our database is ${stats.highest_marks.toFixed(1)} marks, achieving a stellar rank of #${stats.best_rank}. Across all candidates, the average marks were ${stats.avg_marks.toFixed(1)} with a corresponding average rank of #${Math.round(stats.avg_rank)}. Use these metrics to benchmark your performance.`;
  } else {
    // Generate a multi-year comparative summary
    const totalRecords = statsList.reduce((sum, s) => sum + s.total_records, 0);
    const overallBestRank = Math.min(...statsList.map((s) => s.best_rank));
    const highestMarks = Math.max(...statsList.map((s) => s.highest_marks));
    const recentYear = Math.max(...statsList.map((s) => s.year));
    
    return `Across ${statsList.length} years of analyzed ${examName} exams (including ${recentYear}), our prediction engine references ${totalRecords} individual data rows. The absolute highest score logged is ${highestMarks.toFixed(1)} marks, matching a top rank of #${overallBestRank}. This historical depth provides highly accurate, data-backed interpolation ranges for competitive percentiles.`;
  }
}
