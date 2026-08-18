export type ContactNeed =
  | "administrar"
  | "arriendo"
  | "venta"
  | "arrendar"
  | "visita"
  | "oferta"
  | "asesor"
  | "portal";

export type ContactListing = {
  id: string;
  code: string;
  title: string;
  zone: string;
  city: string;
  price: string;
};

export type ContactVisit = {
  kind: "presencial" | "virtual";
  date: string;
  time: string;
};

export type ContactLead = {
  need: ContactNeed;
  listing?: ContactListing;
  visit?: ContactVisit;
};

export function toContactListing(listing: {
  id: string;
  code: string;
  kind: string;
  zone: string;
  city: string;
  price: string;
}): ContactListing {
  return {
    id: listing.id,
    code: listing.code,
    title: `${listing.kind} en ${listing.zone}`,
    zone: listing.zone,
    city: listing.city,
    price: listing.price,
  };
}

export const contactNeeds: { value: ContactNeed; label: string }[] = [
  { value: "administrar", label: "Administrar mi propiedad" },
  { value: "arriendo", label: "Publicar para arriendo" },
  { value: "venta", label: "Publicar para venta" },
  { value: "arrendar", label: "Buscar una propiedad" },
  { value: "visita", label: "Agendar una visita" },
  { value: "asesor", label: "Hablar con un asesor" },
  { value: "oferta", label: "Hacer una oferta" },
  { value: "portal", label: "Pedir acceso al portal" },
];

export function needLabel(need: ContactNeed) {
  return contactNeeds.find(item => item.value === need)?.label ?? need;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  need: ContactNeed;
  listing?: ContactListing;
  visit?: ContactVisit;
};

export async function submitContactLead(payload: ContactPayload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "No pudimos registrar la solicitud.");
  }
}
