import { getAdminSessionFromRequest } from "../../../lib/admin-auth";
import {
  deleteManagedListing,
  getManagedListing,
  listManagedListings,
  upsertManagedListing,
  type ManagedListing,
} from "../../../lib/listings-store";

function requireAdmin(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session) return null;
  return session;
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const listings = await listManagedListings();
  return Response.json({ listings });
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  let body: Partial<ManagedListing>;
  try {
    body = (await request.json()) as Partial<ManagedListing>;
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }
  if (!body.zone || !body.code || !body.priceValue) {
    return Response.json({ error: "Código, barrio y precio son obligatorios." }, { status: 400 });
  }
  const saved = await upsertManagedListing(body);
  return Response.json({ listing: saved }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  let body: Partial<ManagedListing>;
  try {
    body = (await request.json()) as Partial<ManagedListing>;
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }
  if (!body.id) {
    return Response.json({ error: "Falta el id." }, { status: 400 });
  }
  const existing = await getManagedListing(body.id);
  if (!existing) {
    return Response.json({ error: "No existe esa publicación." }, { status: 404 });
  }
  const saved = await upsertManagedListing(body);
  return Response.json({ listing: saved });
}

export async function DELETE(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "Falta el id." }, { status: 400 });
  const ok = await deleteManagedListing(id);
  if (!ok) return Response.json({ error: "No existe esa publicación." }, { status: 404 });
  return Response.json({ ok: true });
}
