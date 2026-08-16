import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminTopbar from "@/components/AdminTopbar";
import { supabaseAdmin } from "@/lib/supabase-server";
import { updateOrderTracking } from "../../actions";
import type { Order, OrderStatus } from "@/lib/database.types";

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
  title: "Edit Order — Jeldi Admin",
  robots: { index: false, follow: false }
};

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "fulfilled", label: "Fulfilled / Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" }
];

export default async function EditOrderPage({ params }: { params: { id: string } }) {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*, products(name)")
    .eq("id", params.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!order) notFound();

  // Same join-typing situation as app/admin/orders/page.tsx and
  // app/api/track/route.ts — narrow local cast instead of `any`.
  const typedOrder = order as unknown as Order & { products: { name: string } | null };

  const updateAction = updateOrderTracking.bind(null, typedOrder.id);

  return (
    <>
      <AdminTopbar />
      <h1 className="mb-2 font-display text-2xl text-chestnut">Edit Order</h1>
      <p className="mb-8 text-sm text-[#4A3B2E]">
        {typedOrder.products?.name ?? "Unknown product"} — {typedOrder.customer_email}
      </p>

      <form action={updateAction} className="max-w-lg space-y-6">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Status
          </label>
          <select
            name="status"
            defaultValue={typedOrder.status}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Carrier
          </label>
          <input
            type="text"
            name="carrier"
            placeholder="e.g. DHL, Barid Al-Maghrib"
            defaultValue={typedOrder.carrier ?? ""}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Tracking Number
          </label>
          <input
            type="text"
            name="tracking_number"
            defaultValue={typedOrder.tracking_number ?? ""}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-cognac"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Tracking URL (carrier&apos;s tracking page for this shipment)
          </label>
          <input
            type="text"
            name="tracking_url"
            placeholder="https://..."
            defaultValue={typedOrder.tracking_url ?? ""}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-cognac"
          />
        </div>

        <button
          type="submit"
          className="border border-chestnut bg-chestnut px-8 py-3 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut"
        >
          Save
        </button>
      </form>
    </>
  );
}
