import { isValidEmail, isValidPhone, type ContactNeed, type ContactPayload } from "../../lib/contact";

const allowedNeeds = new Set<ContactNeed>([
  "administrar",
  "arriendo",
  "venta",
  "arrendar",
  "visita",
  "oferta",
  "asesor",
  "portal",
]);

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const need = body.need;

  if (name.length < 2) {
    return Response.json({ error: "Escribe tu nombre." }, { status: 400 });
  }
  if (!need || !allowedNeeds.has(need)) {
    return Response.json({ error: "Selecciona un motivo." }, { status: 400 });
  }
  if (!isValidEmail(email) && !isValidPhone(phone)) {
    return Response.json({ error: "Deja un correo o un teléfono válido." }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return Response.json({ error: "Revisa el correo." }, { status: 400 });
  }
  if (phone && !isValidPhone(phone)) {
    return Response.json({ error: "Revisa el teléfono." }, { status: 400 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
