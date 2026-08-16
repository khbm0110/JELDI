import Link from "next/link";
import { logout } from "@/app/admin/login/actions";

const NAV = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/story", label: "Story Content" }
];

export default function AdminTopbar() {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-chestnut/15 pb-4">
      <div className="flex items-center gap-8">
        <Link href="/admin" className="font-display text-lg text-chestnut">
          Jeldi Admin
        </Link>
        <nav>
          <ul className="flex gap-5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-[0.08em] text-chestnut/70 hover:text-chestnut"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="font-mono text-xs uppercase tracking-[0.1em] text-chestnut/70 hover:text-chestnut"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
