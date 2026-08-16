"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/database.types";

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<Product>;
  submitLabel: string;
};

const STOCK_OPTIONS: { value: Product["stock_status"]; label: string }[] = [
  { value: "coming_soon", label: "Coming Soon" },
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "sold_out", label: "Sold Out" }
];

export default function ProductForm({ action, defaultValues, submitLabel }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await action(formData);
          // The server action deliberately does NOT redirect (see the
          // comment in app/admin/products/actions.ts) — navigation
          // happens here, only after it resolves without throwing.
          router.push("/admin/products");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
      className="space-y-6"
    >
      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
          Name
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={defaultValues?.name ?? ""}
          className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
          Slug (lowercase, hyphens only — used in the URL)
        </label>
        <input
          type="text"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          defaultValue={defaultValues?.slug ?? ""}
          className="w-full border border-chestnut/25 bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-cognac"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Price in dollars (leave blank = &quot;pending&quot;)
          </label>
          <input
            type="text"
            name="price"
            inputMode="decimal"
            placeholder="e.g. 240"
            defaultValue={
              defaultValues?.price_cents != null
                ? String(defaultValues.price_cents / 100)
                : ""
            }
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Currency
          </label>
          <input
            type="text"
            name="currency"
            defaultValue={defaultValues?.currency ?? "USD"}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Stock status
          </label>
          <select
            name="stock_status"
            defaultValue={defaultValues?.stock_status ?? "coming_soon"}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          >
            {STOCK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
            Sort order (lower = shown first)
          </label>
          <input
            type="number"
            name="sort_order"
            defaultValue={defaultValues?.sort_order ?? 0}
            className="w-full border border-chestnut/25 bg-white px-4 py-2.5 outline-none focus:border-cognac"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70">
          Image URLs (one per line — leave empty until real photography exists)
        </label>
        <textarea
          name="images"
          rows={3}
          placeholder="https://..."
          defaultValue={(defaultValues?.images ?? []).join("\n")}
          className="w-full border border-chestnut/25 bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-cognac"
        />
      </div>

      {error && (
        <p className="border border-[#C55] bg-[#FBEAEA] px-4 py-3 text-sm text-[#A33]">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="border border-chestnut bg-chestnut px-8 py-3 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut"
      >
        {submitLabel}
      </button>
    </form>
  );
}
