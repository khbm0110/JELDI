import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/shipping-faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/track`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 }
    // /checkout deliberately excluded — see robots: noindex on that page.
  ];

  // Pulls real products from Supabase so Phase 2/3 items (belt, bag,
  // ...) show up here automatically once they exist as rows — no
  // sitemap edit needed. Empty/unreachable table just means no
  // product entries, not a broken sitemap.
  const products = await getAllProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updated_at,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...staticEntries, ...productEntries];
}
