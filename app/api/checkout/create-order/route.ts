import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { createPayPalOrder } from "@/lib/paypal";

export const runtime = "nodejs";

/**
 * POST { slug: string, quantity?: number }
 *
 * Deliberately does NOT trust a price from the client — it re-reads the
 * real price from `products` every time, server-side, via the service
 * role client. This is the standard e-commerce rule: never let the
 * browser tell you what something costs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = String(body.slug ?? "");
    const quantity = Math.max(1, Number(body.quantity ?? 1));

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.price_cents == null) {
      return NextResponse.json(
        { error: "This product's price isn't finalized yet." },
        { status: 409 }
      );
    }

    if (product.stock_status === "sold_out") {
      return NextResponse.json({ error: "Sold out" }, { status: 409 });
    }

    const totalCents = product.price_cents * quantity;
    const amountValue = (totalCents / 100).toFixed(2);

    const paypalOrder = await createPayPalOrder({
      referenceId: product.id,
      description: `${product.name} × ${quantity}`,
      amount: {
        currency_code: product.currency,
        value: amountValue
      }
    });

    return NextResponse.json({ id: paypalOrder.id });
  } catch (err) {
    console.error("checkout/create-order error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 }
    );
  }
}
