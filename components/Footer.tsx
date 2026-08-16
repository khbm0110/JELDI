"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="flex flex-col gap-7 bg-ink px-5 pb-10 pt-14 text-ivory/55 sm:px-14">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="font-display text-lg text-ivory">Jeldi</div>
        <nav>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link href="/our-story" className="text-sm">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/#product" className="text-sm">
                The Wallet
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-sm">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/shipping-faq" className="text-sm">
                Shipping &amp; Customs
              </Link>
            </li>
            <li>
              <Link href="/track" className="text-sm">
                Track Order
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ivory/10 pt-5 font-mono text-[0.68rem] tracking-wide text-ivory/35">
        © 2026 Jeldi — Handcrafted in Fez, Morocco. Sold internationally.
      </div>
    </footer>
  );
}
