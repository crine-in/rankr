import { supabase } from "../supabase";

export interface HistoricalRanksFilter {
  exam: string;
  year?: number | null;
  category?: string | null;
  gender?: string | null;
  sortBy?: "marks_desc" | "marks_asc" | "rank_asc" | "rank_desc";
  limit?: number;
}

export interface HistoricalRecord {
  id: number;
  exam: string;
  year: number;
  marks: number;
  category: string | null;
  gender: string | null;
  rank: number;
  created_at: string;
}

export async function getHistoricalRanks(filter: HistoricalRanksFilter): Promise<HistoricalRecord[]> {
  const { exam, year, category, gender, sortBy = "marks_desc", limit = 100 } = filter;

  let query = supabase
    .from("rank_data")
    .select("*")
    .eq("exam", exam);

  // Apply year filter if provided
  if (year) {
    query = query.eq("year", year);
  }

  // Apply category filter if provided. If category is null/undefined in DB, select it accordingly
  if (category) {
    if (category === "ALL") {
      // Do nothing, match all
    } else {
      query = query.eq("category", category);
    }
  } else {
    query = query.is("category", null);
  }

  // Apply gender filter if provided
  if (gender) {
    if (gender === "ALL") {
      // Do nothing, match all
    } else {
      query = query.eq("gender", gender);
    }
  } else {
    query = query.is("gender", null);
  }

  // Apply sorting
  switch (sortBy) {
    case "marks_desc":
      query = query.order("marks", { ascending: false });
      break;
    case "marks_asc":
      query = query.order("marks", { ascending: true });
      break;
    case "rank_asc": // Best rank (1) to worst rank
      query = query.order("rank", { ascending: true });
      break;
    case "rank_desc": // Worst rank to best rank (1)
      query = query.order("rank", { ascending: false });
      break;
    default:
      query = query.order("marks", { ascending: false });
  }

  // Apply limit
  query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching historical ranks:", error);
    return [];
  }

  return (data || []).map((r: any) => ({
    ...r,
    marks: Number(r.marks),
    rank: Number(r.rank),
  }));
}

// Retrieve distinct categories and genders present in the database for an exam to populate filters
export async function getExamFilterOptions(exam: string): Promise<{ categories: string[]; genders: string[] }> {
  const { data, error } = await supabase
    .from("rank_data")
    .select("category, gender")
    .eq("exam", exam);

  if (error || !data) {
    return { categories: [], genders: [] };
  }

  const categoriesSet = new Set<string>();
  const gendersSet = new Set<string>();

  data.forEach((r: any) => {
    if (r.category) categoriesSet.add(r.category);
    if (r.gender) gendersSet.add(r.gender);
  });

  return {
    categories: Array.from(categoriesSet),
    genders: Array.from(gendersSet),
  };
}
