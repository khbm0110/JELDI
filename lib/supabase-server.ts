import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Service-role client — bypasses Row Level Security entirely.
// Import this ONLY in Route Handlers / Server Actions (e.g. the PayPal
// webhook that creates/updates rows in `orders`). The `server-only`
// import above makes it a build error to accidentally pull this into
// a Client Component bundle.
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});
