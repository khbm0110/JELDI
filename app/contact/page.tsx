import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Jeldi",
  description:
    "Questions about the wallet, an order, or the Chouara tannery story? Get in touch with Jeldi."
};

export default function ContactPage() {
  return (
    <>
      {/* ===== Mini hero (matches /our-story banding, keeps the fixed header legible) ===== */}
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
            Contact
          </p>
          <h1 className="mb-5 max-w-[16ch] font-display text-4xl leading-[1.05] sm:text-6xl">
            Get in touch.
          </h1>
          <p className="max-w-[52ch] text-lg text-ivory/80">
            Questions about the wallet, launch timing, or the tannery itself —
            we read every message ourselves.
          </p>
        </div>
      </section>

      {/* ===== Form + direct contact ===== */}
      <section className="mx-auto max-w-[760px] px-5 py-20 sm:px-14 sm:py-28">
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              Email
            </p>
            <a
              href="mailto:hello@jeldi.com"
              className="font-display text-xl text-chestnut underline decoration-cognac/40 underline-offset-4"
            >
              hello@jeldi.com
            </a>
          </div>
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
              Based In
            </p>
            <p className="text-[#4A3B2E]">Fez, Morocco — shipping worldwide</p>
          </div>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
