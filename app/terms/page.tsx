import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Jeldi",
  description: "The terms that apply when you order from Jeldi."
};

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl text-chestnut">{title}</h2>
      <div className="space-y-4 text-[#4A3B2E]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
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
        <div className="relative z-10 mx-auto max-w-[760px]">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
            Legal
          </p>
          <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-beige">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-20 sm:px-14 sm:py-28">
        <p className="mb-12 text-[#4A3B2E]">
          By ordering from jeldi.com, you agree to the terms below. Jeldi is
          operated as a registered auto-entrepreneur business based in Fez,
          Morocco.
        </p>

        <Section title="Products & Pricing">
          <p>
            Every piece is hand-finished by artisans in Fez, so small
            variations in grain, color, and stitching are normal — not
            defects. Prices are listed in USD and confirmed at checkout.
            Signing up for launch notifications is not a purchase and
            doesn&apos;t reserve a price.
          </p>
        </Section>

        <Section title="Orders & Payment">
          <p>
            Payment is processed by PayPal. An order is confirmed once
            payment is successfully captured; you&apos;ll receive an email
            confirmation. We reserve the right to cancel and refund an order
            we can&apos;t fulfill (for example, an item that sells out
            before your order is processed).
          </p>
        </Section>

        <Section title="Shipping & Customs">
          <p>
            We ship internationally from Morocco. Delivery estimates will be
            shown at checkout once fulfillment is finalized. See our{" "}
            <a
              href="/shipping-faq"
              className="underline decoration-cognac/40 underline-offset-4"
            >
              Shipping &amp; Customs FAQ
            </a>{" "}
            — import duties and customs fees in your country are the
            buyer&apos;s responsibility and are not included in the item
            price.
          </p>
        </Section>

        <Section title="Returns & Exchanges">
          <p>
            If something arrives damaged or isn&apos;t as described, contact
            us within 14 days of delivery and we&apos;ll make it right. For
            other returns, items must be unused and in original condition;
            reach out first at{" "}
            <a
              href="mailto:hello@jeldi.com"
              className="underline decoration-cognac/40 underline-offset-4"
            >
              hello@jeldi.com
            </a>{" "}
            before sending anything back. Return shipping costs are the
            customer&apos;s responsibility unless the item was faulty.
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p>
            All text, photography, and design on this site belong to Jeldi
            and may not be reused without permission.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            Jeldi is not liable for indirect or incidental damages arising
            from the use of a product or this website, beyond the value of
            the order itself.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>These terms are governed by the laws of Morocco.</p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms as the business grows; the date above
            reflects the latest revision.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about an order or these terms:{" "}
            <a
              href="mailto:hello@jeldi.com"
              className="underline decoration-cognac/40 underline-offset-4"
            >
              hello@jeldi.com
            </a>
            .
          </p>
        </Section>
      </section>
    </>
  );
}
