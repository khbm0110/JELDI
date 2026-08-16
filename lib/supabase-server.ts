import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Same reasoning as lib/supabase.ts: createClient() throws at module
// load if given an empty string, before any call site's try/catch can
// run. Every /admin/* route imports this file, so without the
// fallback, a build (or a cold start) with the service-role key not
// yet set would crash immediately on import, not just at query time.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

// Service-role client — bypasses Row Level Security entirely.
// Import this ONLY in Route Handlers / Server Actions (e.g. the PayPal
// webhook that creates/updates rows in `orders`). The `server-only`
// import above makes it a build error to accidentally pull this into
// a Client Component bundle.
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});
