"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type TrackResult = {
  status: string;
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  productName: string | null;
  orderedAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Payment pending",
  paid: "Order confirmed — preparing to ship",
  shipped: "Shipped",
  fulfilled: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded"
};

export default function TrackOrderForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setResult(null);

    const data = new FormData(e.currentTarget);
    const orderReference = String(data.get("orderReference") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderReference, email })
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong.");
        return;
      }

      setResult(json as TrackResult);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="orderReference"
            className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut"
          >
            Order Reference
          </label>
          <input
            id="orderReference"
            name="orderReference"
            type="text"
            required
            placeholder="From your checkout confirmation"
            className="w-full border border-chestnut/25 bg-transparent px-4 py-3 font-mono text-sm text-[#1C1712] outline-none transition-colors focus:border-cognac"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut"
          >
            Email used at checkout
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-chestnut/25 bg-transparent px-4 py-3 text-[#1C1712] outline-none transition-colors focus:border-cognac"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-oxblood">
            {errorMessage}{" "}
            {errorMessage.includes("couldn't find") && (
              <>
                Double-check both fields, or email{" "}
                <a href="mailto:hello@jeldi.com" className="underline">
                  hello@jeldi.com
                </a>
                .
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-block border border-chestnut bg-chestnut px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Looking up…" : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="border border-cognac/30 bg-cognac/5 px-6 py-6">
          {result.productName && (
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.1em] text-cognac">
              {result.productName}
            </p>
          )}
          <p className="mb-4 font-display text-xl text-chestnut">
            {STATUS_LABEL[result.status] ?? result.status}
          </p>

          <dl className="space-y-2 text-sm text-[#4A3B2E]">
            <div className="flex justify-between border-b border-chestnut/10 pb-2">
              <dt>Ordered</dt>
              <dd>{new Date(result.orderedAt).toLocaleDateString()}</dd>
            </div>
            {result.carrier && (
              <div className="flex justify-between border-b border-chestnut/10 pb-2">
                <dt>Carrier</dt>
                <dd>{result.carrier}</dd>
              </div>
            )}
            {result.trackingNumber && (
              <div className="flex justify-between border-b border-chestnut/10 pb-2">
                <dt>Tracking Number</dt>
                <dd className="font-mono">{result.trackingNumber}</dd>
              </div>
            )}
          </dl>

          {result.trackingUrl ? (
            <a
              href={result.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border border-chestnut px-6 py-2.5 text-sm uppercase tracking-[0.06em] text-chestnut transition-colors hover:bg-chestnut hover:text-ivory"
            >
              Track with Carrier →
            </a>
          ) : (
            !["shipped", "fulfilled"].includes(result.status) && (
              <p className="mt-5 text-sm text-[#4A3B2E]">
                Tracking details will appear here once your order ships.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
