import type { Metadata } from "next";
import AdminTopbar from "@/components/AdminTopbar";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "../actions";

// Every /admin/* page reads live data straight from Supabase
// (orders, products, messages...) behind a login wall — there is
// no correct cached/static version of any of these. Marking them
// force-dynamic also stops Next.js from trying to prerender them
// at BUILD time, which would run these queries against whatever
// Supabase credentials (or lack of them) the build environment has
// and fail the build the same way /sitemap.xml did before the
// lib/supabase.ts fallback fix — same root cause, different route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Product — Jeldi Admin",
  robots: { index: false, follow: false }
};

export default function NewProductPage() {
  return (
    <>
      <AdminTopbar />
      <h1 className="mb-8 font-display text-2xl text-chestnut">New Product</h1>
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </>
  );
}
