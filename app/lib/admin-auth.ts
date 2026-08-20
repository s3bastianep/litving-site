import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "litving_admin_session";
const MAX_AGE_SEC = 60 * 60 * 12; // 12h

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "litving-dev-session-secret-change-me";
}

function adminUser() {
  return process.env.ADMIN_USER || "admin";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "litving2026";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function verifyCredentials(user: string, password: string) {
  const uOk = user === adminUser();
  const pOk = password === adminPassword();
  return uOk && pOk;
}

export function createSessionToken(user: string) {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const nonce = randomBytes(8).toString("hex");
  const body = `${user}|${exp}|${nonce}`;
  return `${body}|${sign(body)}`;
}

export function readSessionToken(token: string | undefined | null): { user: string } | null {
  if (!token) return null;
  const parts = token.split("|");
  if (parts.length !== 4) return null;
  const [user, expRaw, nonce, sig] = parts;
  const body = `${user}|${expRaw}|${nonce}`;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (user !== adminUser()) return null;
  return { user };
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function getAdminSession() {
  const jar = await cookies();
  return readSessionToken(jar.get(COOKIE)?.value);
}

export function getAdminSessionFromRequest(request: Request) {
  const raw = request.headers.get("cookie") || "";
  const match = raw.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return readSessionToken(value);
}

export { COOKIE as ADMIN_COOKIE_NAME };
