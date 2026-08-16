import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";

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

  return (
    <section className="bg-chestnut px-5 pb-20 pt-40 text-ivory sm:px-14 sm:pb-32 sm:pt-48">
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
          <span className="absolute left-4 top-4 z-10 border border-beige px-2.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-beige">
            {badgeLabel}
          </span>
        </div>

        <div>
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
        </div>
      </div>
    </section>
  );
}
