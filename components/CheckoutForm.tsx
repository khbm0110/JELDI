"use client";

import { useEffect, useRef, useState } from "react";
import "@/lib/paypal-client-types";

type Props = {
  slug: string;
  productName: string;
  priceLabel: string;
};

type Status = "loading_sdk" | "ready" | "not_eligible" | "submitting" | "success" | "error";

/**
 * Renders PayPal's hosted Advanced Card Fields (per the decision in
 * 03-payments-legal.md: embedded card entry, lower fees than the
 * standard PayPal Checkout button).
 *
 * IMPORTANT — verify before launch: Advanced Card Processing has to be
 * enabled on the PayPal Business account by PayPal (it's an approval,
 * not just a setting). `cardFields.isEligible()` returns false if it
 * isn't — this component falls back to a plain "pay with PayPal"
 * message + mailto link in that case rather than showing a broken
 * form. This whole flow is untested against a live PayPal sandbox
 * (see lib/paypal.ts) — run a real test purchase before trusting it
 * with a real customer.
 */
export default function CheckoutForm({ slug, productName, priceLabel }: Props) {
  const [status, setStatus] = useState<Status>("loading_sdk");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const cardFieldsRef = useRef<ReturnType<NonNullable<Window["paypal"]>["CardFields"]> | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const formIsComplete =
    form.name &&
    form.email &&
    form.addressLine1 &&
    form.city &&
    form.postalCode &&
    form.country;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setStatus("error");
      setErrorMessage("Checkout isn't configured yet (missing PayPal client ID).");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&components=card-fields&currency=USD`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal) {
        setStatus("error");
        setErrorMessage("PayPal failed to load.");
        return;
      }

      const cardFields = window.paypal.CardFields({
        createOrder: async () => {
          const res = await fetch("/api/checkout/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, quantity: 1 })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? "Could not start checkout.");
          return data.id as string;
        },
        onApprove: async (data) => {
          setStatus("submitting");
          // This is the same ID stored as orders.paypal_order_id server-side
          // (see capture-order below) — it's what the customer will type
          // into /track later, so capture it now regardless of what
          // happens next.
          setOrderReference(data.orderID);
          const res = await fetch("/api/checkout/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paypalOrderId: data.orderID,
              slug,
              quantity: 1,
              customerEmail: form.email,
              customerName: form.name,
              shippingAddress: {
                line1: form.addressLine1,
                line2: form.addressLine2,
                city: form.city,
                state: form.state,
                postalCode: form.postalCode,
                country: form.country
              }
            })
          });
          const result = await res.json();
          if (!res.ok) {
            setStatus("error");
            setErrorMessage(result.error ?? "Payment could not be completed.");
            return;
          }
          setStatus("success");
        },
        onError: (err) => {
          console.error("PayPal CardFields error:", err);
          setStatus("error");
          setErrorMessage("Something went wrong with the payment form.");
        }
      });

      cardFieldsRef.current = cardFields;

      if (!cardFields.isEligible()) {
        setStatus("not_eligible");
        return;
      }

      Promise.all([
        cardFields.NumberField().render("#card-number-field"),
        cardFields.ExpiryField().render("#card-expiry-field"),
        cardFields.CVVField().render("#card-cvv-field")
      ])
        .then(() => setStatus("ready"))
        .catch(() => {
          setStatus("error");
          setErrorMessage("Could not load the card fields.");
        });
    };

    script.onerror = () => {
      setStatus("error");
      setErrorMessage("Could not load PayPal.");
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
    // Deliberately runs once — the card fields SDK owns its own inputs
    // after render(); form values are read fresh inside onApprove via
    // closures rather than re-rendering the fields on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handlePay() {
    if (!cardFieldsRef.current || !formIsComplete) return;
    setStatus("submitting");
    try {
      await cardFieldsRef.current.submit({
        billingAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || undefined,
          adminArea1: form.state,
          adminArea2: form.city,
          postalCode: form.postalCode,
          countryCode: form.country
        }
      });
      // onApprove (above) takes over from here.
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Payment could not be submitted. Check the card details.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-cognac/30 bg-cognac/5 px-6 py-8 text-center">
        <p className="mb-2 font-display text-xl text-chestnut">Order confirmed.</p>
        <p className="mb-5 text-[#4A3B2E]">
          Thank you — a confirmation is on its way to {form.email}.
        </p>
        {orderReference && (
          <div className="inline-block border border-chestnut/25 bg-white px-5 py-3">
            <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-chestnut/70">
              Order Reference — save this to track shipping
            </p>
            <p className="font-mono text-sm text-chestnut">{orderReference}</p>
          </div>
        )}
      </div>
    );
  }

  if (status === "not_eligible") {
    return (
      <div className="rounded-sm border border-chestnut/25 px-6 py-8 text-[#4A3B2E]">
        <p className="mb-2 font-display text-lg text-chestnut">
          Card checkout isn&apos;t available yet.
        </p>
        <p>
          Email{" "}
          <a href="mailto:hello@jeldi.com" className="underline">
            hello@jeldi.com
          </a>{" "}
          to complete your order for the {productName} ({priceLabel}) directly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            ["name", "Full Name"],
            ["email", "Email"],
            ["addressLine1", "Address"],
            ["addressLine2", "Apt / Suite (optional)"],
            ["city", "City"],
            ["state", "State / Province"],
            ["postalCode", "Postal Code"],
            ["country", "Country Code (e.g. US)"]
          ] as const
        ).map(([field, label]) => (
          <div key={field}>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut">
              {label}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full border border-chestnut/25 bg-transparent px-4 py-3 text-[#1C1712] outline-none transition-colors focus:border-cognac"
            />
          </div>
        ))}
      </div>

      <div>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-cognac">
          Card Details
        </p>
        <div className="space-y-3">
          <div id="card-number-field" className="border border-chestnut/25 px-4 py-3" />
          <div className="grid grid-cols-2 gap-3">
            <div id="card-expiry-field" className="border border-chestnut/25 px-4 py-3" />
            <div id="card-cvv-field" className="border border-chestnut/25 px-4 py-3" />
          </div>
        </div>
      </div>

      {status === "error" && <p className="text-sm text-oxblood">{errorMessage}</p>}

      <button
        type="button"
        onClick={handlePay}
        disabled={status !== "ready" || !formIsComplete}
        className="inline-block border border-chestnut bg-chestnut px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Processing…" : `Pay ${priceLabel}`}
      </button>
    </div>
  );
}
