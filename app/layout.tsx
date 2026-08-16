import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"]
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"]
});

const TITLE = "Jeldi — Handcrafted in Fez";
const DESCRIPTION =
  "Full-grain leather goods, hand-stitched in Fez, Morocco. From the Chouara tannery to your pocket.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // No title template here: every existing page metadata already
  // writes its own full "Page — Jeldi" string (see /our-story,
  // /checkout, /shop, /products/[slug]), so a template would double
  // up the suffix. This just sets the default for pages/layouts that
  // don't override it (currently none — kept for safety).
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Jeldi",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
