import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Shop — Jeldi",
  description: "Hand-stitched leather goods from the Chouara Tannery in Fez, Morocco.",
  openGraph: {
    title: "Shop — Jeldi",
    description: "Hand-stitched leather goods from the Chouara Tannery in Fez, Morocco.",
    type: "website"
  }
};

// Shown only if the products table is empty or unreachable (Supabase
// not configured yet). Never invents a product — just explains the
// state honestly, same principle as the price/photo placeholders
// elsewhere in the site.
function EmptyState() {
  return (
    <div className="mx-auto max-w-[520px] rounded-sm border border-chestnut/25 px-6 py-10 text-center text-[#4A3B2E]">
      <p className="mb-2 font-display text-lg text-chestnut">
        Nothing in the shop yet.
      </p>
      <p>
        We&apos;re still finalizing the first piece with the artisan workshop
        in Fez.{" "}
        <Link href="/contact" className="underline">
          Sign up to hear when it launches
        </Link>
        .
      </p>
    </div>
  );
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <>
      <section className="relative overflow-hidden bg-chestnut px-5 pb-16 pt-40 text-ivory sm:px-14 sm:pb-20 sm:pt-48">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/shop/leather-flatlay.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-35 kenburns"
            priority
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(74,46,31,0.65) 0%, rgba(74,46,31,0.92) 100%)"
            }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px)"
          }}
        />
        <Reveal
          variant="up"
          duration={900}
          className="relative z-10 mx-auto max-w-[760px]"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
            Shop
          </p>
          <h1 className="max-w-[16ch] font-display text-4xl leading-[1.05] sm:text-5xl">
            Every Jeldi piece, in one place.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-14 sm:py-28">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const price = formatPrice(product);
              return (
                <Reveal
                  key={product.id}
                  variant="up"
                  delay={i * 100}
                  duration={600}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-sm bg-gradient-to-br from-[#6B4226] to-[#3A2416]">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <Image
                          src="/product/wallet-hero.jpg"
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-100 mix-blend-overlay transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(70deg, rgba(0,0,0,.12) 0 2px, transparent 2px 8px)"
                        }}
                      />
                      <span className="absolute left-3 top-3 z-10 border border-beige bg-chestnut/40 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-beige backdrop-blur-[2px]">
                        {STOCK_STATUS_LABEL[product.stock_status]}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h2 className="font-display text-xl text-chestnut transition-colors group-hover:text-cognac">
                        {product.name}
                      </h2>
                      <div className="mt-1 flex items-baseline gap-2 font-mono">
                        <span className="text-sm text-[#4A3B2E]">{price.amount}</span>
                        {price.isPending && (
                          <span className="text-[0.65rem] uppercase tracking-wide text-cognac">
                            Price pending
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
