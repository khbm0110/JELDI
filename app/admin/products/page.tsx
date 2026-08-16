import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, formatPrice, STOCK_STATUS_LABEL } from "@/lib/products";
import AdminTopbar from "@/components/AdminTopbar";
import DeleteProductButton from "@/components/DeleteProductButton";
import { deleteProduct } from "./actions";

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
  title: "Products — Jeldi Admin",
  robots: { index: false, follow: false }
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <>
      <AdminTopbar />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-chestnut">Products</h1>
        <Link
          href="/admin/products/new"
          className="border border-chestnut bg-chestnut px-5 py-2.5 text-sm uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-transparent hover:text-chestnut"
        >
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="border border-chestnut/20 bg-white px-6 py-8 text-center text-[#4A3B2E]">
          No products yet. Everything on the site (homepage, /shop) is
          reading live from this table — add one above and it appears
          immediately, nothing is hardcoded.
        </p>
      ) : (
        <div className="overflow-hidden border border-chestnut/20 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chestnut/15 bg-chestnut/5 font-mono text-xs uppercase tracking-wide text-chestnut/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const price = formatPrice(product);
                return (
                  <tr key={product.id} className="border-b border-chestnut/10 last:border-0">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#4A3B2E]">
                      {product.slug}
                    </td>
                    <td className="px-4 py-3">
                      {price.isPending ? "Pending" : price.amount}
                    </td>
                    <td className="px-4 py-3">{STOCK_STATUS_LABEL[product.stock_status]}</td>
                    <td className="px-4 py-3">{product.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-mono text-xs uppercase tracking-wide text-cognac hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton
                          action={deleteProduct.bind(null, product.id, product.slug)}
                          productName={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
