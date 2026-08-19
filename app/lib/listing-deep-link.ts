import { searchListings } from "./search-listings";

const homeListingAliases: Record<string, string> = {
  chico: "chico",
  "chico-renta": "chico",
  chapinero: "chapinero",
  "chapinero-venta": "chapinero",
  salitre: "salitre",
  "salitre-renta": "salitre",
};

export function resolveHomeListingId(rawId: string | null): string | null {
  if (!rawId) return null;
  return homeListingAliases[rawId] ?? null;
}

export function searchRouteForListingId(rawId: string | null): string | null {
  if (!rawId) return null;
  const hit = searchListings.find(item => item.id === rawId);
  if (!hit) return null;
  return hit.operation === "arriendo" ? "/arrendar" : "/comprar";
}
