import { supabase } from "./supabase";
import type { StoryContentBlock } from "./database.types";

export type StoryContentMap = Record<string, StoryContentBlock>;

/**
 * Fetches every row from `story_content` and returns it as a map keyed by
 * `section_key`, for use in Server Components. Returns null on any failure
 * (missing env vars, empty table, network error) so pages can fall back to
 * static copy instead of crashing — same convention as `getProduct` in
 * `lib/products.ts`.
 */
export async function getStoryContent(): Promise<StoryContentMap | null> {
  try {
    const { data, error } = await supabase
      .from("story_content")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return null;

    return Object.fromEntries(data.map((block) => [block.section_key, block]));
  } catch {
    return null;
  }
}

/**
 * Reads a single section's text out of a (possibly missing) content map,
 * falling back to the hardcoded copy in the page if the row isn't there
 * yet. Never throws, never returns an empty string silently — always
 * something render-able.
 */
export function section(
  content: StoryContentMap | null,
  key: string,
  fallback: string
): string {
  return content?.[key]?.content ?? fallback;
}

/**
 * Splits a `markdown` content_type block into paragraphs on blank lines,
 * for the sections (history_body, people_body) that are stored as a few
 * paragraphs of freeform text rather than a single line.
 */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
}
