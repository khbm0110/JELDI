import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminTopbar from "@/components/AdminTopbar";
import ProductForm from "@/components/ProductForm";
import { supabaseAdmin } from "@/lib/supabase-server";
import { updateProduct } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Product — Jeldi Admin",
  robots: { index: false, follow: false }
};

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  // Reads directly via supabaseAdmin (service role) rather than
  // lib/products.ts's getProduct(), which looks up by slug and is
  // meant for public-facing pages — this needs the row by id and
  // doesn't need the "return null on any error" fallback behavior,
  // since a real error here should surface, not silently 404.
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!product) notFound();

  return (
    <>
      <AdminTopbar />
      <h1 className="mb-8 font-display text-2xl text-chestnut">Edit {product.name}</h1>
      <ProductForm
        action={updateProduct.bind(null, product.id)}
        defaultValues={product}
        submitLabel="Save Changes"
      />
    </>
  );
}
