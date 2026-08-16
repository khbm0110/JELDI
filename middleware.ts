import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible admin session check.
 *
 * Why inline (not `@/lib/admin-auth`): Vercel's Edge Function bundler
 * statically analyzes every `@/lib/*` import. Even though `admin-auth.ts`
 * itself only uses Web Crypto (Edge-safe), the resolver treats it as
 * an opaque module and refuses to deploy. Inlining the two helpers
 * used here removes the cross-module reference entirely, while the
 * non-edge admin routes (`/admin/login`, `/admin/products`, etc.)
 * keep importing `@/lib/admin-auth` from their server components.
 */

const ADMIN_SESSION_COOKIE = "jeldi_admin_session";
const SESSION_MESSAGE = "jeldi-admin-session-v1";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the login route itself — otherwise a logged-out user
  // hitting /admin/login would be redirected back to /admin/login forever.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const password = process.env.ADMIN_PASSWORD;

  let valid = false;
  if (token && password) {
    const expected = await hmacHex(password, SESSION_MESSAGE);
    valid = timingSafeEqual(token, expected);
  }

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
