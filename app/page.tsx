import Image from "next/image";
import StitchRail from "@/components/StitchRail";
import Reveal from "@/components/Reveal";
import { getAllProducts, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";

/* ========== Static Data ========== */

const FEATURES = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "From Fez",
    desc: "A city of knowledge, tradition and craft.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "+1000 Years",
    desc: "A heritage passed down through generations.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Chouara Tannery",
    desc: "The oldest tannery in continuous operation.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.15m3.15-3.15a1.575 1.575 0 113.15 0v3.15m-3.15 0v6.375c0 .621.504 1.125 1.125 1.125h3.15c.621 0 1.125-.504 1.125-1.125v-6.375m-6.3 0h6.3m-6.3 0a1.575 1.575 0 00-1.575-1.575M15.75 7.575a1.575 1.575 0 011.575-1.575M20.25 4.575a1.575 1.575 0 00-3.15 0" />
      </svg>
    ),
    title: "Handcrafted",
    desc: "Made by real hands, for a lifetime.",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Preparing the hide",
    desc: "Hides are selected and cleaned with natural ingredients — lime, salt, and water — to remove hair and residual flesh. This initial soak lasts two to three days in stone vats that have been used for centuries.",
    image: "/story/chouara-vats.jpg",
  },
  {
    n: "02",
    title: "Vegetable tanning",
    desc: "The cleaned hides are soaked in natural tannins extracted from tree bark and plant matter. Where an industrial tannery finishes in hours, this step takes weeks — slow, on purpose, with no chromium salts or synthetic chemicals.",
    image: "/story/vats-from-above.jpg",
  },
  {
    n: "03",
    title: "Drying & resting",
    desc: "Finished hides are carried to the rooftops of the medina and laid out in open sun to dry and rest. This slow drying period allows the leather to gain strength and deepen in character, the same way it has been done for centuries.",
    image: "/story/hides-drying.jpg",
  },
  {
    n: "04",
    title: "Hand stitching",
    desc: "The tanned leather is cut, shaped, and stitched by hand using the traditional saddle stitch technique — two needles working in tandem through a single thread, creating a seam that strengthens rather than weakens with age.",
    image: "/product/wallet-hero.jpg",
  },
  {
    n: "05",
    title: "Finishing",
    desc: "Edges are burnished smooth with beeswax and friction. The leather is polished naturally, developing a subtle sheen that will only deepen with use. Each piece is inspected before it leaves the workshop.",
    image: "/story/artisan-hands.jpg",
  },
];

const COMPARE_ROWS = [
  { label: "Process", veg: "Natural tree-bark tannins", chrome: "Chromium salts & chemicals" },
  { label: "Aging", veg: "Develops rich patina over time", chrome: "Stays visually static" },
  { label: "Feel", veg: "Firm, full character, breathable", chrome: "Softer initially, less breathable" },
  { label: "Durability", veg: "Made to last decades", chrome: "Average lifespan of a few years" },
  { label: "Impact", veg: "Eco-friendly, biodegradable", chrome: "Higher environmental impact" },
];

/* ========== Page Component ========== */

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <StitchRail />

      {/* ===== 1. HERO SECTION ===== */}
      <section className="relative flex min-h-[640px] items-end overflow-hidden bg-chestnut">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/product/wallet-hero.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero/leather-push.mp4" type="video/mp4" />
        </video>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,23,18,.30) 0%, rgba(74,46,31,.55) 55%, rgba(28,23,18,.82) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px), repeating-linear-gradient(25deg, rgba(255,255,255,.03) 0 1px, transparent 1px 5px)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, rgba(139,90,43,.45), transparent 60%), radial-gradient(90% 70% at 85% 30%, rgba(92,26,26,.30), transparent 55%)",
          }}
        />

        <Reveal
          variant="up"
          duration={900}
          className="relative z-10 grid w-full gap-4 px-5 pb-16 sm:px-14 sm:pb-24"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-beige">
            Fez, Morocco — since the 12th century
          </p>
          <h1 className="max-w-[14ch] font-display text-4xl leading-[1.02] text-ivory drop-shadow-[0_2px_24px_rgba(28,23,18,0.45)] sm:text-5xl md:text-7xl">
            Carried from the <em className="font-light italic text-beige">Chouara</em>{" "}
            tannery to your pocket.
          </h1>
          <p className="max-w-[38ch] text-ivory/85">
            Full-grain leather, vegetable-tanned by hand in the oldest tannery
            in the world. One wallet. No shortcuts.
          </p>
          <a
            href="/our-story"
            className="mt-2 inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
          >
            Discover Our Story &rarr;
          </a>
        </Reveal>

        <div className="absolute bottom-7 left-5 z-10 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-beige sm:left-14">
          <span className="h-px w-7 animate-pulse bg-beige motion-reduce:animate-none" />
          Scroll
        </div>
      </section>

      {/* ===== 2. MARQUEE TICKER ===== */}
      <div
        aria-hidden="true"
        className="border-y border-cognac/30 bg-chestnut py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-beige overflow-hidden"
      >
        <div className="marquee-track flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0">
              {[
                "Full-grain leather",
                "Vegetable-tanned",
                "Hand-stitched saddle stitch",
                "Chouara Tannery \u00b7 Fez",
                "One piece at a time",
                "No middlemen",
              ].map((s, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="px-6">{s}</span>
                  <span className="text-cognac">&#10022;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== 3. FEATURES / VALUE PROPS STRIP ===== */}
      <section className="bg-ink px-5 py-14 sm:px-14 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              variant="up"
              delay={i * 80}
              duration={600}
              className="flex items-start gap-4"
            >
              <div className="shrink-0 text-cognac">{f.icon}</div>
              <div>
                <h3 className="mb-1 font-display text-base text-ivory">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-ivory/55">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 4. HERITAGE SECTION ===== */}
      <section className="px-5 py-20 sm:px-14 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-2 md:items-center">
          <Reveal variant="right" delay={120} duration={700}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              Our Heritage
            </p>
            <h2 className="mb-5 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
              A story that begins in the 12th century.
            </h2>
            <p className="mb-4 max-w-[46ch] text-[#4A3B2E]">
              In the medina of Fez, hides are still soaked in stone vats of
              natural dye — pigeon lime, cow urine, saffron, poppy — exactly
              as they were in the 14th century, when 86 tanneries worked this
              same ground.
            </p>
            <p className="mb-4 max-w-[46ch] text-[#4A3B2E]">
              The word &ldquo;maroquinerie&rdquo; — leather craft in French —
              comes from Maroc itself. This is where the world learned to tan
              leather, and the Chouara Tannery has never stopped.
            </p>
            <p className="mb-6 max-w-[46ch] text-[#4A3B2E]">
              We work directly with one workshop&apos;s artisans, no
              middlemen, so more of what you pay reaches the hands that made
              it.
            </p>
            <a
              href="/our-story"
              className="inline-flex items-center gap-2 border-b border-oxblood pb-0.5 text-sm text-oxblood transition-colors hover:text-chestnut hover:border-chestnut"
            >
              Explore the History &rarr;
            </a>
          </Reveal>

          <Reveal variant="left" duration={700} className="relative aspect-[4/5] overflow-hidden rounded-sm bg-beige">
            <Image
              src="/story/chouara-vats.jpg"
              alt="Panoramic golden-hour view of the ancient medina of Fez, Morocco"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover kenburns"
              priority={false}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(100deg, rgba(0,0,0,.06) 0 2px, transparent 2px 7px)",
              }}
            />
            <span className="absolute bottom-4 left-4 z-10 bg-chestnut/70 px-2 py-1 font-mono text-[0.68rem] tracking-wide text-ivory backdrop-blur-[2px]">
              Chouara Tannery — Fez el Bali
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===== 5. PROCESS / CRAFTSMANSHIP SECTION ===== */}
      <section className="bg-chestnut px-5 py-20 text-ivory sm:px-14 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
              Our Process
            </p>
            <h2 className="mb-16 max-w-[28ch] font-display text-3xl leading-tight sm:text-4xl">
              Vegetable tanning. A slow and natural process.
            </h2>
          </Reveal>

          <div className="space-y-16 lg:space-y-20">
            {PROCESS_STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <Reveal
                  key={step.n}
                  variant={isEven ? "left" : "right"}
                  delay={i * 60}
                  duration={700}
                >
                  <div className="grid gap-8 items-center md:grid-cols-2">
                    {/* Image */}
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416] ${
                        !isEven ? "md:order-2" : ""
                      }`}
                    >
                      <Image
                        src={step.image}
                        alt={`${step.title} — leather craftsmanship step at Chouara Tannery`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover kenburns"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-100 mix-blend-overlay"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)",
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div className={!isEven ? "md:order-1" : ""}>
                      <span className="mb-3 block font-mono text-sm text-cognac">
                        {step.n}
                      </span>
                      <h3 className="mb-3 font-display text-2xl text-ivory">
                        {step.title}
                      </h3>
                      <p className="max-w-[48ch] text-ivory/70">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 6. COMPARISON SECTION ===== */}
      <section className="px-5 py-20 sm:px-14 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1fr_1fr_1fr] lg:items-center">
          {/* Left image — vegetable tanned */}
          <Reveal variant="left" duration={700} className="relative aspect-[4/5] overflow-hidden rounded-sm bg-beige order-2 lg:order-1">
            <Image
              src="/product/wallet-hero.jpg"
              alt="Close-up texture of vegetable-tanned leather showing natural grain"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 z-10 bg-chestnut/70 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ivory backdrop-blur-[2px]">
              Vegetable Tanned
            </span>
          </Reveal>

          {/* Center comparison */}
          <Reveal variant="up" delay={120} duration={700} className="order-1 lg:order-2">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              The Difference
            </p>
            <h2 className="mb-8 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
              Why we choose vegetable tanned leather.
            </h2>
            <div className="space-y-4">
              {COMPARE_ROWS.map((row) => (
                <div key={row.label} className="border-b border-beige/40 pb-4">
                  <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-cognac">
                    {row.label}
                  </p>
                  <div className="grid gap-2">
                    <div className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-chestnut" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-[#4A3B2E]">{row.veg}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#8a7a63]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-[#4A3B2E]/70">{row.chrome}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right image — chrome tanned placeholder */}
          <Reveal variant="right" delay={240} duration={700} className="relative aspect-[4/5] overflow-hidden rounded-sm bg-beige order-3">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#9a9a9a] to-[#6b6b6b]">
              <div className="text-center px-6">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/50">
                  Chrome Tanned
                </p>
                <p className="mt-2 text-sm text-white/30">Uniform. Synthetic. No patina.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 7. TESTIMONIAL / ARTISAN QUOTE SECTION ===== */}
      <section className="bg-ink px-5 py-20 text-ivory sm:px-14 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-2 md:items-center">
          {/* Artisan photo */}
          <Reveal variant="left" duration={700} className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image
              src="/story/artisan-hands.jpg"
              alt="Ahmed, a master leather artisan, working in his workshop in Fez"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover kenburns"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(28,23,18,0) 50%, rgba(28,23,18,0.85) 100%)",
              }}
            />
            <p className="absolute bottom-4 left-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-beige">
              Ahmed — Master Artisan, Fez
            </p>
          </Reveal>

          {/* Quote */}
          <Reveal variant="right" delay={120} duration={700}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              The Hand Behind Each Piece
            </p>
            <h2 className="mb-6 font-display text-3xl leading-tight sm:text-4xl">
              Made by real hands.
            </h2>
            <p className="mb-6 max-w-[46ch] text-ivory/70">
              The artisans who work in the Chouara quarter are not hobbyists or
              heritage performers — they are working craftsmen who learned this
              trade standing next to someone who already knew it, for years,
              before working a vat alone. They work side by side, valuing time,
              skill, and dignity over speed and volume.
            </p>
            <blockquote className="mb-6 border-l-2 border-cognac pl-6">
              <p className="font-display text-xl italic leading-relaxed text-beige">
                &ldquo;Good leather is not in a rush. It takes time, and so do
                the things worth keeping.&rdquo;
              </p>
              <footer className="mt-3 font-mono text-sm text-ivory/50">
                — Ahmed, Master Artisan in Fez
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ===== 8. VIDEO / STORYTELLING CTA ===== */}
      <section className="px-5 py-20 sm:px-14 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-2 md:items-center">
          <Reveal variant="left" duration={700}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              Our Story, Told with Care
            </p>
            <h2 className="mb-5 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
              Our story, told with care.
            </h2>
            <p className="mb-6 max-w-[46ch] text-[#4A3B2E]">
              We created a short film that blends real footage from the Chouara
              Tannery with AI-enhanced visuals to share the spirit of the craft
              with the world. The result is an honest, artistic portrayal of a
              tradition that has survived for over a thousand years.
            </p>
            <a
              href="/our-story"
              className="inline-flex items-center gap-2 border-b border-oxblood pb-0.5 text-sm text-oxblood transition-colors hover:text-chestnut hover:border-chestnut"
            >
              Watch the Film &rarr;
            </a>
          </Reveal>

          <Reveal variant="right" delay={120} duration={700} className="relative aspect-video overflow-hidden rounded-sm bg-chestnut">
            <Image
              src="/story/chouara-vats.jpg"
              alt="Stone vats of natural dye at the Chouara Tannery"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-ink/40"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ivory/80 bg-ivory/20 backdrop-blur-[4px] transition-transform hover:scale-110">
                <svg className="ml-1 h-6 w-6 text-ivory" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-4 right-4 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-ivory/50">
              AI-Enhanced Storytelling
            </span>
          </Reveal>
        </div>
      </section>

      {/* ===== 9. PRODUCT COLLECTION ===== */}
      <section id="product" className="bg-chestnut px-5 py-20 text-ivory sm:px-14 sm:py-28">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
                  Our Collection
                </p>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">
                  Timeless pieces, crafted to last.
                </h2>
              </div>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 border-b border-beige pb-0.5 text-sm text-beige transition-colors hover:text-ivory hover:border-ivory"
              >
                Discover the Collection &rarr;
              </a>
            </div>
          </Reveal>

          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => {
                const price = formatPrice(product);
                const productImage = product.images && product.images[0]
                  ? product.images[0]
                  : "/product/wallet-hero.jpg";
                return (
                  <Reveal
                    key={product.id}
                    variant="up"
                    delay={i * 80}
                    duration={600}
                  >
                    <a
                      href={`/products/${product.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416]">
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-100 mix-blend-overlay transition-transform duration-300 group-hover:scale-[1.03]"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)",
                          }}
                        />
                        <span className="absolute left-3 top-3 z-10 border border-beige bg-chestnut/40 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-beige backdrop-blur-[2px]">
                          {STOCK_STATUS_LABEL[product.stock_status]}
                        </span>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-display text-base text-ivory transition-colors group-hover:text-beige">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-baseline gap-2 font-mono">
                          <span className="text-sm text-ivory/60">{price.amount}</span>
                          {price.isPending && (
                            <span className="text-[0.65rem] uppercase tracking-wide text-beige">
                              Price pending
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <Reveal variant="up" duration={600}>
              <div className="mx-auto max-w-[520px] rounded-sm border border-ivory/20 px-6 py-12 text-center">
                <p className="mb-2 font-display text-lg text-ivory">
                  Nothing in the shop yet.
                </p>
                <p className="text-ivory/55">
                  We&apos;re still finalizing the first piece with the artisan workshop
                  in Fez.{" "}
                  <a href="/contact" className="underline">
                    Sign up to hear when it launches
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
