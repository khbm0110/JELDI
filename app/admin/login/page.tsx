import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login — Jeldi",
  robots: { index: false, follow: false }
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Wrong password.",
  not_configured:
    "ADMIN_PASSWORD isn't set in the environment — the admin panel is locked until it is."
};

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string; next?: string };
}) {
  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-chestnut px-5 text-ivory">
      <div className="w-full max-w-[380px]">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-beige">
          Jeldi Admin
        </p>
        <h1 className="mb-8 font-display text-3xl">Sign in</h1>

        <form action={login} className="space-y-5">
          <input type="hidden" name="next" value={searchParams.next ?? "/admin/products"} />
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-[0.1em] text-beige">
              Password
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full border border-ivory/25 bg-transparent px-4 py-3 text-ivory outline-none transition-colors focus:border-beige"
            />
          </div>

          {errorMessage && <p className="text-sm text-[#E4A0A0]">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full border border-ivory bg-ivory px-8 py-3.5 text-sm uppercase tracking-[0.06em] text-chestnut transition-colors hover:bg-transparent hover:text-ivory"
          >
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}
