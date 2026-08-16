"use client";

import { useState } from "react";
import type { StoryContentBlock } from "@/lib/database.types";

export default function StoryContentEditor({
  block,
  action
}: {
  block: StoryContentBlock;
  action: (formData: FormData) => Promise<void>;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isLong = block.content_type === "markdown";

  return (
    <form
      action={async (formData) => {
        setStatus("saving");
        try {
          await action(formData);
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 1800);
        } catch {
          setStatus("error");
        }
      }}
      className="border border-chestnut/20 bg-white px-6 py-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-cognac">
          {block.section_key}
        </span>
        {block.content_type === "markdown" && (
          <span className="font-mono text-[0.65rem] uppercase tracking-wide text-chestnut/50">
            paragraphs separated by a blank line
          </span>
        )}
      </div>
      <textarea
        name="content"
        rows={isLong ? 6 : 2}
        defaultValue={block.content}
        className="w-full border border-chestnut/25 bg-[#FBF9F4] px-3 py-2 text-sm outline-none focus:border-cognac"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          className="border border-chestnut bg-chestnut px-5 py-2 text-xs uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut"
        >
          Save
        </button>
        {status === "saving" && (
          <span className="font-mono text-xs text-chestnut/60">Saving…</span>
        )}
        {status === "saved" && (
          <span className="font-mono text-xs text-[#3A7D44]">Saved</span>
        )}
        {status === "error" && (
          <span className="font-mono text-xs text-[#A33]">Couldn&apos;t save — try again.</span>
        )}
      </div>
    </form>
  );
}
