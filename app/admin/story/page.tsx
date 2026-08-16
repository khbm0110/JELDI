import type { Metadata } from "next";
import AdminTopbar from "@/components/AdminTopbar";
import StoryContentEditor from "@/components/StoryContentEditor";
import { supabaseAdmin } from "@/lib/supabase-server";
import { updateStoryContent } from "./actions";

// Every /admin/* page reads live data straight from Supabase
// (orders, products, messages...) behind a login wall — there is
// no correct cached/static version of any of these. Marking them
// force-dynamic also stops Next.js from trying to prerender them
// at BUILD time, which would run these queries against whatever
// Supabase credentials (or lack of them) the build environment has
// and fail the build the same way /sitemap.xml did before the
// lib/supabase.ts fallback fix — same root cause, different route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Story Content — Jeldi Admin",
  robots: { index: false, follow: false }
};

export default async function AdminStoryPage() {
  const { data: blocks, error } = await supabaseAdmin
    .from("story_content")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <>
      <AdminTopbar />
      <h1 className="mb-2 font-display text-2xl text-chestnut">Story Content</h1>
      <p className="mb-8 text-sm text-[#4A3B2E]">
        Edits the text on{" "}
        <a href="/our-story" target="_blank" rel="noreferrer" className="underline">
          /our-story
        </a>
        . If a row is missing here, that section is currently reading a
        fallback baked into the page code (see app/our-story/page.tsx) — add
        the row with matching values from supabase/seed.sql to make it
        editable here instead.
      </p>

      {!blocks || blocks.length === 0 ? (
        <p className="border border-chestnut/20 bg-white px-6 py-8 text-center text-[#4A3B2E]">
          No rows in story_content yet — the page is running entirely on its
          built-in fallback text. Run supabase/seed.sql to populate this
          table and start editing here.
        </p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <StoryContentEditor
              key={block.id}
              block={block}
              action={updateStoryContent.bind(null, block.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
