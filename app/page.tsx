import StitchRail from "@/components/StitchRail";
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

      {/* ===== Hero ===== */}
      <section className="relative flex min-h-[640px] items-end overflow-hidden bg-gradient-to-br from-[#2E1C12] via-chestnut to-[#3A2416]">
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
              "radial-gradient(120% 90% at 15% 10%, rgba(139,90,43,.55), transparent 60%), radial-gradient(90% 70% at 85% 30%, rgba(92,26,26,.35), transparent 55%)"
          }}
        />

        <div className="relative z-10 grid w-full gap-4 px-5 pb-16 sm:px-14 sm:pb-24">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-beige">
            Fez, Morocco — since the 12th century
          </p>
          <h1 className="max-w-[14ch] font-display text-5xl leading-[1.02] text-ivory sm:text-7xl">
            Carried from the <em className="font-light italic text-beige">Chouara</em>{" "}
            tannery to your pocket.
          </h1>
          <p className="max-w-[38ch] text-ivory/80">
            Full-grain leather, vegetable-tanned by hand in the oldest tannery
            in the world. One wallet. No shortcuts.
          </p>
        </div>

        <div className="absolute bottom-7 left-5 z-10 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-beige sm:left-14">
          <span className="h-px w-7 animate-pulse bg-beige motion-reduce:animate-none" />
          Scroll
        </div>
      </section>

      {/* ===== Story teaser ===== */}
      <section id="story" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-14 sm:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br from-beige via-cognac to-chestnut">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-100 mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(100deg, rgba(0,0,0,.06) 0 2px, transparent 2px 7px)"
              }}
            />
            <span className="absolute bottom-4 left-4 z-10 font-mono text-[0.68rem] tracking-wide text-ivory">
              Chouara Tannery — Fez, Morocco
            </span>
          </div>

          <div>
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
              className="mt-2 inline-flex items-center gap-2 border-b border-oxblood pb-0.5 text-sm text-oxblood"
            >
              Read the full story →
            </a>
          </div>
        </div>
      </section>

      {/* ===== Product ===== */}
      <section id="product" className="bg-chestnut px-5 py-20 text-ivory sm:px-14 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="relative aspect-square rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-100 mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)"
              }}
            />
            {badgeLabel && (
              <span className="absolute left-4 top-4 z-10 border border-beige px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-beige">
                {badgeLabel}
              </span>
            )}
          </div>

          {product && price ? (
            <div>
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
            </div>
          ) : (
            // Honest empty state — no product row exists yet. Nothing
            // invented here; add one at /admin/products and this
            // section (and /shop) picks it up immediately.
            <div>
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
            </div>
          )}
        </div>
      </section>
    </>
  );
}
