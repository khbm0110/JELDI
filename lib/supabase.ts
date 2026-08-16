import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// createClient() throws synchronously — "supabaseUrl is required." — if
// given an empty string, and it throws at MODULE LOAD TIME, before any
// call site's try/catch (see getAllProducts in lib/products.ts) gets a
// chance to run. That crashed the Vercel build in "Collecting page
// data" for /sitemap.xml, since env vars aren't set during that step.
//
// Falling back to a well-formed placeholder means createClient() never
// throws here — any actual request against it (missing real
// credentials) fails as a normal network/auth error instead, which the
// try/catch in every caller already handles by returning null/[].
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Client for use in client components / browser context, and in Server
// Components for public reads (products, story_content). Respects RLS —
// per supabase/migrations/0001_init.sql this can only read, never write.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
