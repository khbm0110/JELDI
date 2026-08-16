"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Everything expected (missing env vars, empty tables, a bad
    // slug) is already handled with a safe fallback in lib/products.ts
    // and lib/story.ts — this only fires for something genuinely
    // unexpected, so it's worth logging.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-chestnut px-5 text-center text-ivory">
      <div className="max-w-[440px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
          Something went wrong
        </p>
        <h1 className="mb-5 font-display text-3xl leading-tight sm:text-4xl">
          We hit a snag.
        </h1>
        <p className="mb-8 text-ivory/75">
          Nothing was lost — try again, or head back and pick up where you
          left off.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
