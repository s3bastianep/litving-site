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
    // Drafts can be incomplete; publish still needs the essentials.
    if (body.published !== false) {
      return Response.json({ error: "Código, barrio y precio son obligatorios para publicar." }, { status: 400 });
    }
  }
  try {
    const saved = await upsertManagedListing({
      ...body,
      code: body.code || `BORR-${Date.now().toString().slice(-6)}`,
      zone: body.zone || "Por completar",
      priceValue: body.priceValue || 0,
      published: body.published ?? true,
    });
    return Response.json({ listing: saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar en la base de datos.";
    return Response.json({ error: message }, { status: 500 });
  }
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
  const isDraft = body.published === false;
  if (!isDraft && (!body.zone || !body.code || !body.priceValue)) {
    return Response.json({ error: "Código, barrio y precio son obligatorios para publicar." }, { status: 400 });
  }
  try {
    const existing = await getManagedListing(body.id);
    if (!existing) {
      return Response.json({ error: "No existe esa publicación." }, { status: 404 });
    }
    const saved = await upsertManagedListing({
      ...body,
      code: body.code || existing.code || `BORR-${Date.now().toString().slice(-6)}`,
      zone: body.zone || existing.zone || "Por completar",
      priceValue: body.priceValue ?? existing.priceValue ?? 0,
    });
    return Response.json({ listing: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al guardar en la base de datos.";
    return Response.json({ error: message }, { status: 500 });
  }
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
