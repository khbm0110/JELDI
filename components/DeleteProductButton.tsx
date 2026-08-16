"use client";

export default function DeleteProductButton({
  action,
  productName
}: {
  action: () => Promise<void>;
  productName: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-wide text-[#A33] hover:underline"
      >
        Delete
      </button>
    </form>
  );
}
