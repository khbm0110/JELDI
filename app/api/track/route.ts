import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

/**
 * POST { orderReference, email }
 *
 * orderReference is the PayPal order ID shown on the checkout success
 * screen (see CheckoutForm.tsx) — the only order-identifying string
 * the customer actually has, since order rows are never readable by
 * the browser (see the RLS note in 0001_init.sql and 0003_order_tracking.sql).
 *
 * Requires BOTH the reference and the matching email before returning
 * anything, and returns the same generic 404 whether the reference
 * doesn't exist or the email doesn't match it — so this endpoint can't
 * be used to enumerate real order references or confirm someone's
 * email placed an order.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderReference = String(body.orderReference ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!orderReference || !email) {
      return NextResponse.json(
        { error: "Order reference and email are both required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        "status, tracking_number, carrier, tracking_url, created_at, customer_email, products(name)"
      )
      .eq("paypal_order_id", orderReference)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data || data.customer_email.trim().toLowerCase() !== email) {
      return NextResponse.json(
        { error: "We couldn't find an order matching that reference and email." },
        { status: 404 }
      );
    }

    // `products` comes back as a joined object under Supabase's typed
    // client, but the hand-written Database type (see the note atop
    // database.types.ts) doesn't model that join — same situation as
    // app/admin/orders/page.tsx, same fix: a narrow local cast instead
    // of `any` on the whole response.
    const product = (data as unknown as { products: { name: string } | null }).products;

    return NextResponse.json({
      status: data.status,
      trackingNumber: data.tracking_number,
      carrier: data.carrier,
      trackingUrl: data.tracking_url,
      productName: product?.name ?? null,
      orderedAt: data.created_at
    });
  } catch (err) {
    console.error("track order error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
