/**
 * The production site URL, used for metadataBase, sitemap.xml,
 * robots.txt, and Open Graph/Twitter card URLs.
 *
 * Falls back to a placeholder so local dev and preview builds don't
 * break without NEXT_PUBLIC_SITE_URL set — but this placeholder must
 * never end up in a production build. See .env.local.example.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://jeldi.com";
