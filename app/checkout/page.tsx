import type { Metadata } from "next";
import { getProduct, formatPrice } from "@/lib/products";
import CheckoutForm from "@/components/CheckoutForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Checkout — Jeldi",
  // Transactional page, varies per query string (?product=), and has
  // nothing useful to show a search visitor — keep it out of the index.
  robots: { index: false, follow: false }
};

type Props = {
  searchParams: { product?: string };
};

export default async function CheckoutPage({ searchParams }: Props) {
  // No hardcoded default slug — every "Buy Now" link on the site now
  // passes ?product=<slug> explicitly (see app/page.tsx and
  // app/products/[slug]/page.tsx). Landing here with no slug at all
  // just means there's nothing to check out, same as an unknown one.
  const slug = searchParams.product;
  const product = slug ? await getProduct(slug) : null;
  const price = product ? formatPrice(product) : { amount: "$—", isPending: true };

  return (
    <>
      <section className="relative overflow-hidden bg-chestnut px-5 pb-16 pt-40 text-ivory sm:px-14 sm:pb-20 sm:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px)"
          }}
        />
        <Reveal
          variant="up"
          duration={900}
          className="relative z-10 mx-auto max-w-[640px]"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
            Checkout
          </p>
          <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            {product?.name ?? "Checkout"}
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[640px] px-5 py-20 sm:px-14 sm:py-28">
        {!slug || !product || price.isPending ? (
          <Reveal variant="up" duration={600}>
            <div className="rounded-sm border border-chestnut/25 px-6 py-8 text-[#4A3B2E]">
              <p className="mb-2 font-display text-lg text-chestnut">
                Not available for checkout yet.
              </p>
              <p>
                {!slug || !product
                  ? "We couldn't find that product."
                  : "The price is still being finalized with the artisan workshop."}{" "}
                <a href="/shop" className="underline">
                  Browse the shop
                </a>{" "}
                instead.
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal variant="up" duration={700}>
            <CheckoutForm
              slug={slug}
              productName={product.name}
              priceLabel={price.amount}
            />
          </Reveal>
        )}
      </section>
    </>
  );
}
