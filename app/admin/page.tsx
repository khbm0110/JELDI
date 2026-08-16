import type { Metadata } from "next";
import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";
import { supabaseAdmin } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Admin — Jeldi",
  robots: { index: false, follow: false }
};

async function getCounts() {
  // Uses count: "exact", head: true — one lightweight query per
  // table, no rows fetched, just for the summary tiles below.
  const [products, orders, awaitingShipment, newMessages, storyBlocks] = await Promise.all([
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    // "paid" but not yet "shipped" — paid.updated_at at status "paid"
    // is not enough to know an order still needs a tracking number
    // added, but the status itself is: this is the queue for
    // /admin/orders/[id]/edit.
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid"),
    supabaseAdmin
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabaseAdmin.from("story_content").select("*", { count: "exact", head: true })
  ]);

  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    awaitingShipment: awaitingShipment.count ?? 0,
    newMessages: newMessages.count ?? 0,
    storyBlocks: storyBlocks.count ?? 0
  };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  const tiles = [
    { href: "/admin/products", label: "Products", value: counts.products },
    { href: "/admin/orders", label: "Orders", value: counts.orders },
    {
      href: "/admin/orders",
      label: "Awaiting Shipment",
      value: counts.awaitingShipment
    },
    { href: "/admin/messages", label: "New Messages", value: counts.newMessages },
    { href: "/admin/story", label: "Story Sections", value: counts.storyBlocks }
  ];

  return (
    <>
      <AdminTopbar />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="border border-chestnut/20 bg-white px-6 py-8 text-center transition-colors hover:border-cognac"
          >
            <div className="mb-1 font-display text-4xl text-chestnut">{tile.value}</div>
            <div className="font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
              {tile.label}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
