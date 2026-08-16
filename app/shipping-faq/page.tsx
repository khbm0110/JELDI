import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Shipping & Customs FAQ — Jeldi",
  description:
    "Where Jeldi ships from, how customs and import duties work, and what to expect."
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where do you ship from?",
    a: (
      <>
        Every order ships from Fez, Morocco, where each piece is made. It&apos;s
        not warehoused elsewhere first.
      </>
    )
  },
  {
    q: "Do you ship internationally?",
    a: <>Yes — Jeldi ships worldwide, including the US, Canada, and the EU.</>
  },
  {
    q: "How long does shipping take?",
    a: (
      <>
        Carrier and delivery-time estimates will be published here and shown
        at checkout once our fulfillment partner is finalized. Because each
        piece is hand-finished in small batches, please allow a short
        processing window before it ships — we&apos;ll be upfront about
        exact timing before you order, the same way we&apos;re upfront that
        pricing is still being finalized with the artisan workshop.
      </>
    )
  },
  {
    q: "Will I owe customs or import duties?",
    a: (
      <>
        Possibly, depending on your country. Import duties, taxes, and
        customs fees are set by your local government, are the buyer&apos;s
        responsibility, and aren&apos;t included in the item price or
        collected by Jeldi at checkout. If your country charges them,
        you&apos;ll pay them to the carrier or customs authority on
        arrival.
      </>
    )
  },
  {
    q: "Can I track my order?",
    a: (
      <>
        Yes — once your order ships, you&apos;ll get a confirmation email
        with tracking, as soon as our shipping carrier is confirmed.
      </>
    )
  },
  {
    q: "What if my order arrives damaged?",
    a: (
      <>
        Contact us within 14 days of delivery and we&apos;ll sort it out —
        see our{" "}
        <a
          href="/terms"
          className="underline decoration-cognac/40 underline-offset-4"
        >
          Terms &amp; Conditions
        </a>{" "}
        for the full returns policy.
      </>
    )
  },
  {
    q: "I have another question.",
    a: (
      <>
        Reach out any time at{" "}
        <a
          href="mailto:hello@jeldi.com"
          className="underline decoration-cognac/40 underline-offset-4"
        >
          hello@jeldi.com
        </a>{" "}
        or through the{" "}
        <a
          href="/contact"
          className="underline decoration-cognac/40 underline-offset-4"
        >
          contact page
        </a>
        .
      </>
    )
  }
];

export default function ShippingFaqPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-chestnut px-5 pb-16 pt-40 text-ivory sm:px-14 sm:pb-20 sm:pt-48">
        <div className="absolute inset-0 z-0">
          <Image
            src="/faq/shipping-package.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-30 kenburns"
            priority
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(74,46,31,0.70) 0%, rgba(74,46,31,0.92) 100%)"
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
            Shipping &amp; Customs
          </p>
          <h1 className="max-w-[18ch] font-display text-4xl leading-[1.05] sm:text-5xl">
            From Fez to your door.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-20 sm:px-14 sm:py-28">
        <dl className="divide-y divide-chestnut/15">
          {FAQS.map(({ q, a }, i) => (
            <Reveal as="div" key={q} variant="up" delay={i * 60} duration={500} className="py-8 first:pt-0">
              <dt className="mb-3 font-display text-xl text-chestnut">{q}</dt>
              <dd className="max-w-[56ch] text-[#4A3B2E]">{a}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={150}>
          <div className="mt-4 border-t border-chestnut/15 pt-8">
            <p className="text-[#4A3B2E]">
              Already ordered?{" "}
              <Link
                href="/track"
                className="text-chestnut underline decoration-cognac/40 underline-offset-4"
              >
                Track your order
              </Link>{" "}
              with the reference from your checkout confirmation.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
