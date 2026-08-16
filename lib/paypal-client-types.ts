/**
 * Minimal ambient typing for the PayPal JS SDK's CardFields component,
 * loaded at runtime via a <script> tag (see CheckoutForm.tsx) — there's
 * no official first-party npm package for this, so this covers only
 * the methods this project actually calls. Not exhaustive.
 * Docs: https://developer.paypal.com/sdk/js/reference/
 */
export {};

declare global {
  interface Window {
    paypal?: {
      CardFields: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => void | Promise<void>;
        onError?: (err: unknown) => void;
      }) => PayPalCardFieldsInstance;
    };
  }
}

interface PayPalCardFieldsInstance {
  isEligible: () => boolean;
  NumberField: (opts?: Record<string, unknown>) => PayPalHostedField;
  ExpiryField: (opts?: Record<string, unknown>) => PayPalHostedField;
  CVVField: (opts?: Record<string, unknown>) => PayPalHostedField;
  submit: (opts?: {
    billingAddress?: {
      addressLine1?: string;
      addressLine2?: string;
      adminArea1?: string;
      adminArea2?: string;
      postalCode?: string;
      countryCode?: string;
    };
  }) => Promise<void>;
}

interface PayPalHostedField {
  render: (selector: string) => Promise<void>;
}
