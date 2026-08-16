import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Client for use in client components / browser context, and in Server
// Components for public reads (products, story_content). Respects RLS —
// per supabase/migrations/0001_init.sql this can only read, never write.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
