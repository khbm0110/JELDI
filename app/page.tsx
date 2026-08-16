import Image from "next/image";
import StitchRail from "@/components/StitchRail";
import Reveal from "@/components/Reveal";
import { getFeaturedProduct, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";

export default async function HomePage() {
  // No hardcoded fallback product — if the table is empty, the
  // "Product" section below renders an honest empty state instead of
  // inventing a name/description. Every product now enters the site
  // exclusively through /admin/products.
  const product = await getFeaturedProduct();
  const price = product ? formatPrice(product) : null;
  const badgeLabel = product ? STOCK_STATUS_LABEL[product.stock_status] : null;

  return (
    <>
      <StitchRail />

      {/* ===== Hero with video background ===== */}
      <section className="relative flex min-h-[640px] items-end overflow-hidden bg-chestnut">
        {/* Video layer — muted, autoplay, loop, playsInline (mobile-safe) */}
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

        {/* Cinematic darkening + palette tint (kept inside brand palette) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(28,23,18,.30) 0%, rgba(74,46,31,.55) 55%, rgba(28,23,18,.82) 100%)"
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px), repeating-linear-gradient(25deg, rgba(255,255,255,.03) 0 1px, transparent 1px 5px)"
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 10%, rgba(139,90,43,.45), transparent 60%), radial-gradient(90% 70% at 85% 30%, rgba(92,26,26,.30), transparent 55%)"
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
          <h1 className="max-w-[14ch] font-display text-5xl leading-[1.02] text-ivory drop-shadow-[0_2px_24px_rgba(28,23,18,0.45)] sm:text-7xl">
            Carried from the <em className="font-light italic text-beige">Chouara</em>{" "}
            tannery to your pocket.
          </h1>
          <p className="max-w-[38ch] text-ivory/85">
            Full-grain leather, vegetable-tanned by hand in the oldest tannery
            in the world. One wallet. No shortcuts.
          </p>
        </Reveal>

        <div className="absolute bottom-7 left-5 z-10 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-beige sm:left-14">
          <span className="h-px w-7 animate-pulse bg-beige motion-reduce:animate-none" />
          Scroll
        </div>
      </section>

      {/* ===== Marquee ticker — adds motion without changing palette ===== */}
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
                "Chouara Tannery · Fez",
                "One piece at a time",
                "No middlemen"
              ].map((s, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="px-6">{s}</span>
                  <span className="text-cognac">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== Story teaser ===== */}
      <section id="story" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-14 sm:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal variant="left" duration={700} className="relative aspect-[4/5] overflow-hidden rounded-sm bg-beige">
            <Image
              src="/story/chouara-vats.jpg"
              alt="Stone vats of natural dye at the Chouara Tannery in Fez, Morocco"
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
                  "repeating-linear-gradient(100deg, rgba(0,0,0,.06) 0 2px, transparent 2px 7px)"
              }}
            />
            <span className="absolute bottom-4 left-4 z-10 bg-chestnut/70 px-2 py-1 font-mono text-[0.68rem] tracking-wide text-ivory backdrop-blur-[2px]">
              Chouara Tannery — Fez, Morocco
            </span>
          </Reveal>

          <Reveal variant="right" delay={120} duration={700}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              Our Story
            </p>
            <h2 className="mb-5 font-display text-3xl leading-tight text-chestnut sm:text-4xl">
              A thousand years of the same hands.
            </h2>
            <p className="mb-4 max-w-[46ch] text-[#4A3B2E]">
              In the medina of Fez, hides are still soaked in stone vats of
              natural dye — pigeon lime, cow urine, saffron, poppy — exactly
              as they were in the 14th century, when 86 tanneries worked this
              same ground.
            </p>
            <p className="mb-4 max-w-[46ch] text-[#4A3B2E]">
              We work directly with one workshop&apos;s artisans, no
              middlemen, so more of what you pay reaches the hands that made
              it.
            </p>
            <a
              href="/our-story"
              className="mt-2 inline-flex items-center gap-2 border-b border-oxblood pb-0.5 text-sm text-oxblood transition-colors hover:text-chestnut hover:border-chestnut"
            >
              Read the full story →
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===== Product ===== */}
      <section id="product" className="bg-chestnut px-5 py-20 text-ivory sm:px-14 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <Reveal variant="left" duration={700} className="relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416]">
            <Image
              src="/product/wallet-hero.jpg"
              alt={product?.name || "The hand-stitched Jeldi leather wallet"}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover kenburns"
              priority
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-100 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)"
              }}
            />
            {badgeLabel && (
              <span className="absolute left-4 top-4 z-10 border border-beige bg-chestnut/40 px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-beige backdrop-blur-[2px]">
                {badgeLabel}
              </span>
            )}
          </Reveal>

          {product && price ? (
            <Reveal variant="right" delay={140} duration={700}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-beige">
                The First Release
              </p>
              <h2 className="mb-4 font-display text-4xl">{product.name}</h2>
              <p className="mb-7 max-w-[42ch] text-ivory/75">
                {product.description}
              </p>
              <div className="mb-8 flex items-baseline gap-3 font-mono">
                <span className="text-2xl text-ivory">{price.amount}</span>
                {price.isPending && (
                  <span className="text-[0.72rem] tracking-wide text-beige">
                    FINAL PRICE PENDING ARTISAN NEGOTIATION
                  </span>
                )}
              </div>
              <a
                href={
                  price.isPending || product.stock_status === "sold_out"
                    ? "/contact"
                    : `/checkout?product=${encodeURIComponent(product.slug)}`
                }
                className="inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
              >
                {product.stock_status === "sold_out"
                  ? "Sold Out — Notify Me"
                  : price.isPending
                    ? "Notify Me at Launch"
                    : "Buy Now"}
              </a>
            </Reveal>
          ) : (
            <Reveal variant="right" delay={140} duration={700}>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-beige">
                Coming Soon
              </p>
              <h2 className="mb-4 font-display text-4xl">The first piece is on its way.</h2>
              <p className="mb-7 max-w-[42ch] text-ivory/75">
                We&apos;re still finalizing the details with the artisan
                workshop in Fez. Leave your email and we&apos;ll let you know
                the moment it&apos;s ready.
              </p>
              <a
                href="/contact"
                className="inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
              >
                Notify Me at Launch
              </a>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
