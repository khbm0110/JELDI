import type { Metadata } from "next";
import AdminTopbar from "@/components/AdminTopbar";
import ProductForm from "@/components/ProductForm";
import { createProduct } from "../actions";

export const metadata: Metadata = {
  title: "New Product — Jeldi Admin",
  robots: { index: false, follow: false }
};

export default function NewProductPage() {
  return (
    <>
      <AdminTopbar />
      <h1 className="mb-8 font-display text-2xl text-chestnut">New Product</h1>
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </>
  );
}
