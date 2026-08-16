import type { Metadata } from "next";
import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { Order } from "@/lib/database.types";

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
  title: "Orders — Jeldi Admin",
  robots: { index: false, follow: false }
};

// The hand-written Database type in lib/database.types.ts doesn't
// model the products(...) join below — it's correct Supabase query
// syntax, just outside what that minimal type can express. Casting
// through this local type instead of `any` keeps the rest of the
// file's field access checked normally.
type OrderWithProduct = Order & { products: { name: string; slug: string } | null };

const STATUS_COLOR: Record<string, string> = {
  pending: "text-cognac",
  paid: "text-[#3A7D44]",
  shipped: "text-[#2E6B8A]",
  fulfilled: "text-[#3A7D44]",
  cancelled: "text-[#A33]",
  refunded: "text-[#A33]"
};

function formatCents(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0
  }).format(cents / 100);
}

export default async function AdminOrdersPage() {
  // Joins products(name, slug) via the FK — same service-role client
  // as the rest of /admin, bypasses RLS so every order is visible
  // regardless of the (currently order-writer-only) RLS policy.
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, products(name, slug)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const orders = (data ?? []) as unknown as OrderWithProduct[];

  return (
    <>
      <AdminTopbar />
      <h1 className="mb-8 font-display text-2xl text-chestnut">Orders</h1>

      {orders.length === 0 ? (
        <p className="border border-chestnut/20 bg-white px-6 py-8 text-center text-[#4A3B2E]">
          No orders yet — this fills in automatically once PayPal checkout is
          tested and live.
        </p>
      ) : (
        <div className="overflow-x-auto border border-chestnut/20 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chestnut/15 bg-chestnut/5 font-mono text-xs uppercase tracking-wide text-chestnut/70">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tracking</th>
                <th className="px-4 py-3">PayPal Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-chestnut/10 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {order.products?.name ?? order.product_id}
                  </td>
                  <td className="px-4 py-3">
                    <div>{order.customer_name || "—"}</div>
                    <div className="font-mono text-xs text-[#4A3B2E]">
                      {order.customer_email}
                    </div>
                  </td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">
                    {formatCents(order.total_cents, order.currency)}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs uppercase ${STATUS_COLOR[order.status] ?? ""}`}>
                    {order.status}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#4A3B2E]">
                    {order.tracking_number ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#4A3B2E]">
                    {order.paypal_order_id ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}/edit`}
                      className="font-mono text-xs uppercase tracking-wide text-cognac underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
