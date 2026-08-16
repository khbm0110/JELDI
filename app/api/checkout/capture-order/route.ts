import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { capturePayPalOrder } from "@/lib/paypal";

export const runtime = "nodejs";

/**
 * POST { paypalOrderId, slug, quantity, customerEmail, customerName, shippingAddress }
 *
 * Captures payment with PayPal first. Only writes to `orders` — with
 * status "paid" — once PayPal confirms the capture actually succeeded.
 * If anything after a successful capture fails (e.g. the Supabase
 * write), we still return success to the buyer (they were charged) but
 * log loudly, since a lost order record needs a human to reconcile it
 * against the PayPal dashboard — never silently drop it.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paypalOrderId = String(body.paypalOrderId ?? "");
    const slug = String(body.slug ?? "");
    const quantity = Math.max(1, Number(body.quantity ?? 1));
    const customerEmail = String(body.customerEmail ?? "");
    const customerName = body.customerName ? String(body.customerName) : null;
    const shippingAddress = body.shippingAddress ?? null;

    if (!paypalOrderId || !slug || !customerEmail) {
      return NextResponse.json(
        { error: "Missing paypalOrderId, slug, or customerEmail" },
        { status: 400 }
      );
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const capture = await capturePayPalOrder(paypalOrderId);

    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment not completed (status: ${capture.status})` },
        { status: 402 }
      );
    }

    const captureId = capture.purchase_units[0]?.payments?.captures?.[0]?.id ?? null;
    const totalCents = (product.price_cents ?? 0) * quantity;

    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        product_id: product.id,
        customer_email: customerEmail,
        customer_name: customerName,
        shipping_address: shippingAddress,
        quantity,
        total_cents: totalCents,
        currency: product.currency,
        status: "paid",
        paypal_order_id: paypalOrderId,
        paypal_transaction_id: captureId
      }
    ]);

    if (orderError) {
      // Payment already succeeded — surface this loudly server-side so
      // it gets reconciled by hand, but don't tell the buyer it failed.
      console.error(
        "CRITICAL: PayPal capture succeeded but order write failed.",
        { paypalOrderId, captureId, orderError }
      );
    }

    return NextResponse.json({ success: true, captureId });
  } catch (err) {
    console.error("checkout/capture-order error:", err);
    return NextResponse.json(
      { error: "Could not complete checkout. Please try again or contact us." },
      { status: 500 }
    );
  }
}
