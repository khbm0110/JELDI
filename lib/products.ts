import { supabase } from "./supabase";
import type { Product } from "./database.types";

/**
 * Fetches a product by slug for use in Server Components.
 * Returns null on any failure (missing env vars, no row, network
 * error) so pages can fall back to static copy instead of crashing —
 * useful during local dev before `.env.local` / migrations are set up.
 */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches every product for the catalog page (`/shop`), ordered the
 * same way as the DB default (`sort_order`). Returns an empty array
 * on any failure rather than null — a catalog page with zero cards
 * is a valid, renderable state (e.g. before `.env.local` is set up),
 * unlike a single missing product which needs an explicit fallback.
 * Supports the roadmap's Phase 2/3 expansion (belt, bag, ...) without
 * any code change — new rows just show up here.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/**
 * Fetches the single product to feature on the homepage — the first
 * by `sort_order`. Returns null (not a hardcoded product) if the
 * table is empty, so the homepage never has to fall back to fake
 * data; the page itself handles the empty case honestly.
 */
export async function getFeaturedProduct(): Promise<Product | null> {
  const products = await getAllProducts();
  return products[0] ?? null;
}

/** Formats price_cents for display, or a clear "pending" label if null. */
export function formatPrice(product: Pick<Product, "price_cents" | "currency">): {
  amount: string;
  isPending: boolean;
} {
  if (product.price_cents == null) {
    return { amount: "$—", isPending: true };
  }
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
    minimumFractionDigits: 0
  }).format(product.price_cents / 100);
  return { amount: formatted, isPending: false };
}

export const STOCK_STATUS_LABEL: Record<Product["stock_status"], string> = {
  coming_soon: "Coming Soon",
  available: "Limited Edition",
  limited: "Limited Edition",
  sold_out: "Sold Out"
};
