export const ADMIN_SESSION_COOKIE = "jeldi_admin_session";

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

/**
 * The cookie value a logged-in session should hold: an HMAC of a
 * fixed message, keyed by ADMIN_PASSWORD. Never the password itself —
 * the cookie proves the holder knew the password at login time
 * without storing it. Returns null if ADMIN_PASSWORD isn't set, so
 * the admin panel fails closed (nobody can log in) rather than open.
 */
export async function getExpectedSessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return hmacHex(password, SESSION_MESSAGE);
}

export async function isValidAdminSession(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const expected = await getExpectedSessionToken();
  if (!expected) return false;
  return timingSafeEqual(token, expected);
}

/**
 * Plain-string password compare for the login form itself. Not
 * cookie-related — this just checks the submitted password against
 * ADMIN_PASSWORD before issuing a session token.
 */
export function passwordMatches(submitted: string): boolean {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return timingSafeEqual(submitted, configured);
}
