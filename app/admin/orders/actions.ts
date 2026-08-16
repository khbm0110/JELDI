"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { OrderStatus } from "@/lib/database.types";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "fulfilled",
  "cancelled",
  "refunded"
];

/**
 * Called from a plain <form action={...}> in the edit page (no
 * client-side try/catch wrapper around it), so redirect() here is
 * safe — same reasoning as deleteProduct in
 * app/admin/products/actions.ts. Any thrown error surfaces as
 * Next.js's default error UI rather than inline form feedback; that's
 * an acceptable tradeoff for a low-traffic internal form, unlike the
 * product form which needed inline validation errors for slug/price.
 */
export async function updateOrderTracking(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "");
  if (!STATUSES.includes(status as OrderStatus)) {
    throw new Error("Invalid status.");
  }

  const trackingNumber = String(formData.get("tracking_number") ?? "").trim();
  const carrier = String(formData.get("carrier") ?? "").trim();
  const trackingUrl = String(formData.get("tracking_url") ?? "").trim();

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status: status as OrderStatus,
      tracking_number: trackingNumber || null,
      carrier: carrier || null,
      tracking_url: trackingUrl || null
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders");
}
