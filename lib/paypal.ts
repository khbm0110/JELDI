import "server-only";

/**
 * Minimal PayPal REST API v2 client — no SDK dependency, just fetch.
 * Avoids the kind of type-contract drift we hit with @supabase/supabase-js
 * (see the note at the top of lib/database.types.ts): a thin wrapper over
 * documented REST endpoints is easier to reason about and version than a
 * third-party SDK's generated types.
 *
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 *
 * NOT YET TESTED against a real PayPal sandbox account — this was written
 * from the documented REST contract, not verified end-to-end (this build
 * environment has no network access to api-m.paypal.com). Before going
 * live: run a full sandbox checkout, confirm the response shapes below
 * still match PayPal's current API, and confirm the business account is
 * actually approved for Advanced Card Processing (see CheckoutForm.tsx) —
 * otherwise fall back to standard Smart Buttons.
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET are not set in .env.local"
    );
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`PayPal OAuth failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export type PayPalAmount = {
  currency_code: string;
  /** Decimal string, e.g. "42.00" — NOT cents. */
  value: string;
};

/**
 * Creates a PayPal order for a single line item and returns PayPal's
 * order id. `referenceId` should be the internal product id so
 * capture-order can look it up again without trusting client input.
 */
export async function createPayPalOrder(params: {
  referenceId: string;
  amount: PayPalAmount;
  description: string;
}): Promise<{ id: string }> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.referenceId,
          description: params.description,
          amount: params.amount
        }
      ]
    }),
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(
      `PayPal create order failed: ${res.status} ${await res.text()}`
    );
  }

  return res.json();
}

export type PayPalCaptureResult = {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments?: {
      captures?: Array<{ id: string; status: string }>;
    };
  }>;
};

/** Captures a previously-created, buyer-approved PayPal order. */
export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<PayPalCaptureResult> {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    }
  );

  if (!res.ok) {
    throw new Error(
      `PayPal capture failed: ${res.status} ${await res.text()}`
    );
  }

  return res.json();
}
