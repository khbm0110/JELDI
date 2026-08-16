import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";
import Reveal from "@/components/Reveal";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product — Jeldi" };

  const title = `${product.name} — Jeldi`;
  // Uses the first real product photo once one exists (products.images);
  // falls back to no image (the site-wide default OG image from the
  // root layout applies) rather than pointing at a stock photo.
  const ogImage = product.images[0];

  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {})
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description: product.description
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);

  // A missing/unknown slug is a real 404, unlike a missing price
  // (which is an expected "pending" state) — there's no honest
  // fallback copy to show for a product that doesn't exist.
  if (!product) notFound();

  const price = formatPrice(product);
  const badgeLabel = STOCK_STATUS_LABEL[product.stock_status];

  const productImage = product.images && product.images[0]
    ? product.images[0]
    : "/product/wallet-hero.jpg";

  return (
    <section className="bg-chestnut px-5 pb-20 pt-40 text-ivory sm:px-14 sm:pb-32 sm:pt-48">
      <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <Reveal variant="left" duration={800} className="relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416]">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover kenburns"
            priority
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-100 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)"
            }}
          />
          <span className="absolute left-4 top-4 z-10 border border-beige bg-chestnut/40 px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-beige backdrop-blur-[2px]">
            {badgeLabel}
          </span>
        </Reveal>

        <Reveal variant="right" delay={120} duration={800}>
          <h1 className="mb-4 font-display text-4xl">{product.name}</h1>
          <p className="mb-7 max-w-[42ch] text-ivory/75">{product.description}</p>
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

          {/* Inline trust strip */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ivory/15 pt-6 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-beige/85">
            <div>
              <p className="mb-1 text-ivory/55">Material</p>
              <p>Full-grain leather</p>
            </div>
            <div>
              <p className="mb-1 text-ivory/55">Tannage</p>
              <p>Vegetable</p>
            </div>
            <div>
              <p className="mb-1 text-ivory/55">Stitch</p>
              <p>Saddle · by hand</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
