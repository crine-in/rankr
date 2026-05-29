-- SQL Schema for Rankr --
-- Run these statements in the Supabase SQL Editor --

-- 1. Create the main Rank Data table
CREATE TABLE IF NOT EXISTS rank_data (
    id BIGSERIAL PRIMARY KEY,
    exam TEXT NOT NULL,
    year INTEGER NOT NULL,
    marks NUMERIC NOT NULL,
    category TEXT NULL,
    gender TEXT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create optimized performance indexes for lookups and filtering
CREATE INDEX IF NOT EXISTS idx_exam_marks 
ON rank_data(exam, marks);

CREATE INDEX IF NOT EXISTS idx_exam_category_gender_marks 
ON rank_data(exam, category, gender, marks);

CREATE INDEX IF NOT EXISTS idx_exam_year 
ON rank_data(exam, year);

-- 3. Create the Materialized View for fast historical aggregates & SEO
CREATE MATERIALIZED VIEW IF NOT EXISTS yearly_rank_stats AS
SELECT
  exam,
  year,
  COUNT(*) as total_records,
  AVG(marks)::numeric(10,2) as avg_marks,
  AVG(rank)::numeric(10,2) as avg_rank,
  MIN(rank) as best_rank,
  MAX(marks)::numeric(10,2) as highest_marks
FROM rank_data
GROUP BY exam, year;

-- 4. Create a unique index on the materialized view to allow CONCURRENT refreshes
CREATE UNIQUE INDEX IF NOT EXISTS idx_yearly_rank_stats_exam_year 
ON yearly_rank_stats(exam, year);

-- 5. Create helper function to refresh materialized view via RPC/Supabase client
-- Hardened with explicit search_path to prevent search-path hijacking privilege escalation
CREATE OR REPLACE FUNCTION refresh_yearly_rank_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY yearly_rank_stats;
END;
$$;

-- 6. Grant SELECT-only privileges to public roles (prevents DB tampering)
GRANT SELECT ON public.rank_data TO anon, authenticated;
GRANT SELECT ON public.yearly_rank_stats TO anon, authenticated;

-- Grant full write privileges ONLY to service_role (for secure administrative scripts)
GRANT ALL PRIVILEGES ON public.rank_data TO service_role;
GRANT ALL PRIVILEGES ON public.yearly_rank_stats TO service_role;
GRANT ALL ON SEQUENCE public.rank_data_id_seq TO service_role;

-- Revoke function execution from public roles to prevent Denial of Service (DoS) spam attacks
REVOKE EXECUTE ON FUNCTION public.refresh_yearly_rank_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_yearly_rank_stats() TO service_role;


-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.rank_data ENABLE ROW LEVEL SECURITY;

-- 8. Create policy allowing anyone to read (SELECT) data for rank predictions
CREATE POLICY "Allow public read access" 
ON public.rank_data 
FOR SELECT 
TO anon, authenticated 
USING (true);



