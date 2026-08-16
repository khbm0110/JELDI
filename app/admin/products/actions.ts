"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { StockStatus } from "@/lib/database.types";

const STOCK_STATUSES: StockStatus[] = ["coming_soon", "available", "limited", "sold_out"];

function parsePriceCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null; // empty = pending, same convention as the rest of the site
  const dollars = Number(trimmed);
  if (Number.isNaN(dollars) || dollars < 0) {
    throw new Error("Price must be a non-negative number, or left blank for 'pending'.");
  }
  return Math.round(dollars * 100);
}

function parseImages(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseStockStatus(raw: string): StockStatus {
  return STOCK_STATUSES.includes(raw as StockStatus) ? (raw as StockStatus) : "coming_soon";
}

function readProductFields(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!slug || !name) {
    throw new Error("Slug and name are required.");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug can only contain lowercase letters, numbers, and hyphens.");
  }

  const sortOrderRaw = Number(formData.get("sort_order") ?? 0);

  return {
    slug,
    name,
    description: String(formData.get("description") ?? "").trim(),
    price_cents: parsePriceCents(String(formData.get("price") ?? "")),
    currency: String(formData.get("currency") ?? "USD").trim() || "USD",
    stock_status: parseStockStatus(String(formData.get("stock_status") ?? "coming_soon")),
    images: parseImages(String(formData.get("images") ?? "")),
    sort_order: Number.isNaN(sortOrderRaw) ? 0 : sortOrderRaw
  };
}

function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(formData: FormData) {
  const fields = readProductFields(formData);

  const { error } = await supabaseAdmin.from("products").insert(fields);
  if (error) throw new Error(error.message);

  revalidateProductPaths(fields.slug);
  // No redirect() here — this action is called from ProductForm's
  // client-side wrapper (components/ProductForm.tsx), which needs to
  // catch validation errors in a try/catch. redirect() throws a
  // special Next.js control-flow error that a surrounding catch would
  // otherwise swallow, breaking the navigation. The client component
  // does router.push() itself once this resolves without throwing.
}

export async function updateProduct(id: string, formData: FormData) {
  const fields = readProductFields(formData);

  const { error } = await supabaseAdmin.from("products").update(fields).eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProductPaths(fields.slug);
  // See note in createProduct — no redirect() here either.
}

export async function deleteProduct(id: string, slug: string) {
  // Called directly from a plain <form action={...}> in
  // app/admin/products/page.tsx (no client-side try/catch wrapper),
  // so redirect() here is safe — nothing intercepts its throw.
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidateProductPaths(slug);
  redirect("/admin/products");
}
