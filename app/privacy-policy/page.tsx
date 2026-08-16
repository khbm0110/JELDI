import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Jeldi",
  description: "How Jeldi collects, uses, and protects your information."
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

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-beige">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-5 py-20 sm:px-14 sm:py-28">
        <p className="mb-12 text-[#4A3B2E]">
          Jeldi (&quot;we,&quot; &quot;us&quot;) sells handcrafted leather
          goods made in Fez, Morocco. This policy explains what information
          we collect through jeldi.com, why we collect it, and how it&apos;s
          handled.
        </p>

        <Section title="What We Collect">
          <p>
            <strong className="text-chestnut">Contact form:</strong> when you
            message us, we collect your name, email address, and the content
            of your message.
          </p>
          <p>
            <strong className="text-chestnut">Orders:</strong> when checkout
            goes live, placing an order will collect your name, email,
            shipping address, and order details (item, quantity, price).
          </p>
          <p>
            <strong className="text-chestnut">Payment:</strong> we never see
            or store your card details. Payment is processed directly by
            PayPal under{" "}
            <a
              href="https://www.paypal.com/webapps/mpp/ua/privacy-full"
              className="underline decoration-cognac/40 underline-offset-4"
            >
              PayPal&apos;s own privacy policy
            </a>
            .
          </p>
          <p>
            <strong className="text-chestnut">Automatic data:</strong> our
            hosting provider may log standard technical data (IP address,
            browser type, pages visited) for security and performance. We do
            not currently run analytics or advertising trackers on this
            site.
          </p>
        </Section>

        <Section title="How We Use It">
          <p>
            To respond to your messages, fulfill and ship orders, handle
            customer service (returns, questions about an order), and meet
            our own legal/accounting obligations as a registered
            auto-entrepreneur in Morocco.
          </p>
          <p>We don&apos;t sell your information to anyone, ever.</p>
        </Section>

        <Section title="Where It's Stored">
          <p>
            Contact and order data is stored in our database, hosted by
            Supabase. Access is restricted — contact messages and order
            details are not publicly readable.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            You can ask us what information we hold about you, ask us to
            correct it, or ask us to delete it, subject to what we&apos;re
            legally required to keep (for example, order records for tax
            purposes). Email{" "}
            <a
              href="mailto:hello@jeldi.com"
              className="underline decoration-cognac/40 underline-offset-4"
            >
              hello@jeldi.com
            </a>{" "}
            for any of this.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Jeldi is not directed at children, and we don&apos;t knowingly
            collect information from anyone under 16.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            If this policy changes, we&apos;ll update the date at the top of
            this page. Significant changes will be noted clearly.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or your data:{" "}
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
