import {
  clearSessionCookieOptions,
  createSessionToken,
  getAdminSessionFromRequest,
  sessionCookieOptions,
  verifyCredentials,
} from "../../../lib/admin-auth";

function withCookie(response: Response, cookie: ReturnType<typeof sessionCookieOptions>) {
  const headers = new Headers(response.headers);
  const parts = [
    `${cookie.name}=${encodeURIComponent(cookie.value)}`,
    `Path=${cookie.path}`,
    `Max-Age=${cookie.maxAge}`,
    `SameSite=${cookie.sameSite}`,
    "HttpOnly",
  ];
  if (cookie.secure) parts.push("Secure");
  headers.append("Set-Cookie", parts.join("; "));
  return new Response(response.body, { status: response.status, headers });
}

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) return Response.json({ authenticated: false }, { status: 401 });
  return Response.json({ authenticated: true, user: session.user });
}

export async function POST(request: Request) {
  let body: { user?: string; password?: string; action?: string };
  try {
    body = (await request.json()) as { user?: string; password?: string; action?: string };
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (body.action === "logout") {
    return withCookie(Response.json({ ok: true }), clearSessionCookieOptions());
  }

  const user = String(body.user || "").trim();
  const password = String(body.password || "");
  if (!verifyCredentials(user, password)) {
    return Response.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const token = createSessionToken(user);
  return withCookie(Response.json({ ok: true, user }), sessionCookieOptions(token));
}
