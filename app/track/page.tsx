import type { Metadata } from "next";
import Image from "next/image";
import TrackOrderForm from "@/components/TrackOrderForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Track Your Order — Jeldi",
  description: "Look up the shipping status of a Jeldi order."
};

export default function TrackPage() {
  return (
    <>
      {/* ===== Mini hero (matches /contact banding) ===== */}
      <section className="relative overflow-hidden bg-chestnut px-5 pb-16 pt-40 text-ivory sm:px-14 sm:pb-20 sm:pt-48">
        <div className="absolute inset-0 z-0">
          <Image
            src="/faq/track-journal.jpg"
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
            Track Order
          </p>
          <h1 className="mb-5 max-w-[16ch] font-display text-4xl leading-[1.05] sm:text-6xl">
            Where&apos;s your order?
          </h1>
          <p className="max-w-[52ch] text-lg text-ivory/80">
            Enter the order reference from your checkout confirmation
            along with the email you used, and we&apos;ll show you where
            things stand.
          </p>
        </Reveal>
      </section>

      {/* ===== Form ===== */}
      <section className="mx-auto max-w-[560px] px-5 py-20 sm:px-14 sm:py-28">
        <Reveal variant="up" duration={700}>
          <TrackOrderForm />
        </Reveal>
      </section>
    </>
  );
}
