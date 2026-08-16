import type { Metadata } from "next";
import { getStoryContent, section, paragraphs } from "@/lib/story";

export const metadata: Metadata = {
  title: "Our Story — Jeldi",
  description:
    "The Chouara Tannery in Fez: nearly a thousand years of hand tanning, the process, and why we work directly with the artisans who still practice it.",
  openGraph: {
    title: "Our Story — Jeldi",
    description:
      "The Chouara Tannery in Fez: nearly a thousand years of hand tanning, the process, and why we work directly with the artisans who still practice it.",
    type: "article"
  }
};

// Fallback copy — used whenever a section_key is missing from
// story_content (Supabase not configured yet, migrations not run, or
// that specific row hasn't been seeded). Keeps this page fully
// functional in local dev, same convention as FALLBACK_PRODUCT in
// app/page.tsx. Mirrors supabase/seed.sql exactly.
const FALLBACK = {
  hero_eyebrow: "Our Story",
  hero_title: "Nearly a thousand years, in the same six vats.",
  hero_body:
    "Every Jeldi piece starts at the Chouara Tannery, in the oldest quarter of Fez — a working tannery, not a museum, where hides are still turned into leather entirely by hand.",

  history_eyebrow: "A Working History",
  history_title: "Older than the country's modern borders.",
  history_body:
    "Fez el Bali, the old walled medina, has been a UNESCO World Heritage Site since 1981 — and the tanning quarter inside it predates that recognition by centuries. Chouara traces back to the 11th century, making it one of the oldest tanneries still operating anywhere in the world.\n\nAt its peak, medieval Fez held roughly 86 tannery houses. Today, three remain: Chouara, Sidi Moussa, and Ain Azliten. Chouara is the largest of the three, and the one most people picture when they think of Fez — the terraced stone vats, dyed in rings of color, seen from the leather-shop balconies above.\n\nThe tanners who work there now learned the craft the same way their predecessors did: standing next to someone who already knew it, for years, before working a vat alone.",

  process_eyebrow: "The Process",
  process_title: "Five steps. None of them shortcuts.",

  tanning_eyebrow: "Why It Matters",
  tanning_title: "Vegetable-tanned, not chrome-tanned.",
  tanning_closing:
    "Chrome tanning isn't inherently dishonest — it's how most of the world's leather goods are made, and it's faster and cheaper for a reason. We chose vegetable-tanned leather from Chouara because it's the material this specific craft produces, and because it ages the way we wanted a piece like this to age: getting better, not just older.",

  people_eyebrow: "The People",
  people_title: "A craft under real pressure.",
  people_body:
    "We're not going to pretend this trade is thriving simply because it's beautiful to look at. Cheap machine-made leather and synthetic alternatives have squeezed traditional tanneries for years, and the work itself — standing in these vats for hours — is genuinely hard, physical labor that fewer young tanners are choosing to learn.\n\nWhat keeps Chouara running is craftsmen who kept doing it anyway, and buyers willing to pay for hides tanned the slow way instead of the cheap way. That's the trade we're trying to be part of: we buy directly from the workshop, with no middleman between the artisan and the price you pay, so more of it actually reaches the hands that made your piece.",

  photo_note:
    "The colors above are real — they're the actual dye palette of the Chouara vats — but we haven't shot documentary photos or video in Fez yet. When we do, this page gets real footage of the tannery and the workshop, not stock imagery, and any AI-assisted footage will be labeled honestly as such. No stand-ins pretending to be real."
};

const VAT_COLORS = [
  { name: "Lime & cream", hex: "#EDE6D6" },
  { name: "Indigo", hex: "#2B3A55" },
  { name: "Poppy", hex: "#8C2F2F" },
  { name: "Saffron", hex: "#C08A2E" },
  { name: "Cognac", hex: "#8B5A2B" },
  { name: "Chestnut", hex: "#4A2E1F" }
];

const STEPS = [
  {
    n: "01",
    title: "Soak",
    body: "Raw hides go into stone vats of lime, salt, and water for two to three days. This loosens hair and residual flesh so it can be scraped away by hand."
  },
  {
    n: "02",
    title: "Soften",
    body: "The cleaned hides move to a second set of vats containing pigeon droppings diluted in water. It sounds crude, but it's precise chemistry — a natural enzyme bath that softens the hide so it can properly absorb dye."
  },
  {
    n: "03",
    title: "Tan",
    body: "Vegetable tanning with tree-bark tannins, not chrome salts. Where an industrial tannery finishes in hours, this step takes weeks — slow, on purpose."
  },
  {
    n: "04",
    title: "Dye",
    body: "Natural pigment, worked into the hide by hand and by foot: indigo for blue, poppy for red, saffron and pomegranate for yellow and gold. The famous rings of color you see in photos of Chouara are these dye vats, not a filter."
  },
  {
    n: "05",
    title: "Dry",
    body: "Finished hides are laid out on the rooftops of the medina to dry in open sun, the same way they have been for centuries, before they're cut and stitched into anything."
  }
];

export default async function OurStoryPage() {
  const content = await getStoryContent();

  const historyParagraphs = paragraphs(
    section(content, "history_body", FALLBACK.history_body)
  );
  const peopleParagraphs = paragraphs(
    section(content, "people_body", FALLBACK.people_body)
  );

  return (
    <>
      {/* ===== Hero / intro ===== */}
      <section className="relative overflow-hidden bg-chestnut px-5 pb-20 pt-40 text-ivory sm:px-14 sm:pb-28 sm:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px)"
          }}
        />
        <div className="relative z-10 mx-auto max-w-[760px]">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
            {section(content, "hero_eyebrow", FALLBACK.hero_eyebrow)}
          </p>
          <h1 className="mb-6 max-w-[16ch] font-display text-4xl leading-[1.05] sm:text-6xl">
            {section(content, "hero_title", FALLBACK.hero_title)}
          </h1>
          <p className="max-w-[52ch] text-lg text-ivory/80">
            {section(content, "hero_body", FALLBACK.hero_body)}
          </p>
        </div>
      </section>

      {/* ===== History ===== */}
      <section className="mx-auto max-w-[760px] px-5 py-20 sm:px-14 sm:py-28">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
          {section(content, "history_eyebrow", FALLBACK.history_eyebrow)}
        </p>
        <h2 className="mb-6 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
          {section(content, "history_title", FALLBACK.history_title)}
        </h2>
        <div className="space-y-5 text-[#4A3B2E]">
          {historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* ===== The vats — signature visual ===== */}
      <section className="bg-beige px-5 py-16 sm:px-14 sm:py-20">
        <div className="mx-auto max-w-[1180px]">
          <p className="mb-8 max-w-[46ch] font-mono text-xs uppercase tracking-[0.14em] text-chestnut/70">
            The colors of the vats are not a design choice — they're the actual dyes.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {VAT_COLORS.map((v) => (
              <div key={v.hex} className="aspect-square rounded-sm" style={{ backgroundColor: v.hex }}>
                <span className="sr-only">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Process steps ===== */}
      <section className="bg-chestnut px-5 py-20 text-ivory sm:px-14 sm:py-28">
        <div className="mx-auto max-w-[860px]">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
            {section(content, "process_eyebrow", FALLBACK.process_eyebrow)}
          </p>
          <h2 className="mb-14 max-w-[20ch] font-display text-3xl leading-tight sm:text-4xl">
            {section(content, "process_title", FALLBACK.process_title)}
          </h2>
          <ol className="space-y-10">
            {STEPS.map((step) => (
              <li key={step.n} className="flex gap-6 sm:gap-10">
                <span className="shrink-0 font-mono text-sm text-cognac">
                  {step.n}
                </span>
                <div>
                  <h3 className="mb-2 font-display text-xl text-ivory">
                    {step.title}
                  </h3>
                  <p className="max-w-[56ch] text-ivory/75">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Vegetable vs chemical tanning ===== */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-14 sm:py-28">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
          {section(content, "tanning_eyebrow", FALLBACK.tanning_eyebrow)}
        </p>
        <h2 className="mb-12 max-w-[24ch] font-display text-3xl leading-tight text-chestnut sm:text-4xl">
          {section(content, "tanning_title", FALLBACK.tanning_title)}
        </h2>
        <div className="grid gap-px overflow-hidden rounded-sm bg-beige sm:grid-cols-2">
          <div className="bg-ivory p-8 sm:p-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-cognac">
              Chouara — Vegetable Tanning
            </p>
            <ul className="space-y-3 text-[#4A3B2E]">
              <li>Tree-bark tannins, no synthetic chemicals</li>
              <li>Weeks in the vat, done entirely by hand</li>
              <li>Ages into a deeper patina the more you use it</li>
              <li>Firmer, more breathable leather</li>
            </ul>
          </div>
          <div className="bg-ivory p-8 sm:p-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-[#8a7a63]">
              Mass-Market — Chrome Tanning
            </p>
            <ul className="space-y-3 text-[#4A3B2E]">
              <li>Chromium salts, industrial by-products</li>
              <li>Finished in hours on a production line</li>
              <li>Stays visually static — doesn't develop character</li>
              <li>Softer initially, wears out faster</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 max-w-[60ch] text-[#4A3B2E]">
          {section(content, "tanning_closing", FALLBACK.tanning_closing)}
        </p>
      </section>

      {/* ===== The people / honest note on the craft ===== */}
      <section className="bg-ivory px-5 py-20 sm:px-14 sm:py-28">
        <div className="mx-auto max-w-[760px]">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-oxblood">
            {section(content, "people_eyebrow", FALLBACK.people_eyebrow)}
          </p>
          <h2 className="mb-6 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
            {section(content, "people_title", FALLBACK.people_title)}
          </h2>
          <div className="space-y-5 text-[#4A3B2E]">
            {peopleParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Photography note (honest placeholder) ===== */}
      <section className="border-t border-beige px-5 py-16 sm:px-14 sm:py-20">
        <div className="mx-auto max-w-[760px]">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
            A Note on the Photos Here
          </p>
          <p className="max-w-[56ch] text-[#4A3B2E]">
            {section(content, "photo_note", FALLBACK.photo_note)}
          </p>
        </div>
      </section>

      {/* ===== CTA back to product ===== */}
      <section className="bg-chestnut px-5 py-20 text-center text-ivory sm:px-14 sm:py-24">
        <h2 className="mb-6 font-display text-2xl sm:text-3xl">
          The first piece made this way is a wallet.
        </h2>
        <a
          href="/#product"
          className="inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
        >
          See the Fez Bifold
        </a>
      </section>
    </>
  );
}
