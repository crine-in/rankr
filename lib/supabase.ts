import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Use service role key when available (for server-side bypass / seeding) or publishable key for public endpoints
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  // Let it fail or warn during server initialization rather than breaking the build
  if (process.env.NODE_ENV === "production") {
    console.warn("CRITICAL: Supabase environment variables are missing!");
  } else {
    console.warn("Warning: Supabase credentials are not configured in your environment.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Disables local storage session caching since this is an SSR server context
  },
});
