"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  // The admin panel has its own minimal chrome (components/AdminTopbar.tsx)
  // — the public marketing nav doesn't belong above it.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-5 sm:px-10 mix-blend-difference">
      <Link
        href="/"
        className="font-display text-xl text-ivory tracking-wide transition-opacity hover:opacity-70"
      >
        Jeldi
      </Link>
      <nav>
        <ul className="flex gap-4 sm:gap-9">
          <li>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-ivory transition-opacity hover:opacity-60"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              href="/our-story"
              className="text-xs uppercase tracking-widest text-ivory transition-opacity hover:opacity-60"
            >
              Our Story
            </Link>
          </li>
          <li>
            <Link
              href="/#product"
              className="text-xs uppercase tracking-widest text-ivory transition-opacity hover:opacity-60"
            >
              The Wallet
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-widest text-ivory transition-opacity hover:opacity-60"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
