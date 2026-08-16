import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-chestnut px-5 text-center text-ivory">
      <div className="max-w-[440px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-beige">
          404
        </p>
        <h1 className="mb-5 font-display text-3xl leading-tight sm:text-4xl">
          This piece isn&apos;t here.
        </h1>
        <p className="mb-8 text-ivory/75">
          The page you&apos;re looking for doesn&apos;t exist, or the product may
          no longer be available.
        </p>
        <Link
          href="/shop"
          className="inline-block border border-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut bg-ivory transition-colors hover:bg-transparent hover:text-ivory"
        >
          Back to the Shop
        </Link>
      </div>
    </section>
  );
}
