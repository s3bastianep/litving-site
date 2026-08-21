export type NearbyPlace = {
  group: string;
  name: string;
  walk?: string;
  car?: string;
};

export function normalizeNearbyPlaces(input?: NearbyPlace[] | null): NearbyPlace[] | undefined {
  if (!Array.isArray(input) || !input.length) return undefined;
  const next = input
    .map(item => ({
      group: String(item?.group || "").trim() || "Entorno",
      name: String(item?.name || "").trim(),
      walk: String(item?.walk || "").trim() || undefined,
      car: String(item?.car || "").trim() || undefined,
    }))
    .filter(item => item.name);
  return next.length ? next : undefined;
}

/** Parse lines: "Grupo | Nombre | a pie | en carro" */
export function parseNearbyText(raw: string): NearbyPlace[] {
  return normalizeNearbyPlaces(
    raw
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split("|").map(part => part.trim());
        return {
          group: parts[0] || "Entorno",
          name: parts[1] || parts[0] || "",
          walk: parts[2] || undefined,
          car: parts[3] || undefined,
        };
      }),
  ) || [];
}

export function formatNearbyText(places?: NearbyPlace[] | null) {
  if (!places?.length) return "";
  return places
    .map(item => [item.group, item.name, item.walk || "", item.car || ""].join(" | "))
    .join("\n");
}

export function groupNearbyPlaces(places: NearbyPlace[]) {
  const order: string[] = [];
  const map = new Map<string, NearbyPlace[]>();
  for (const place of places) {
    if (!map.has(place.group)) {
      map.set(place.group, []);
      order.push(place.group);
    }
    map.get(place.group)!.push(place);
  }
  return order.map(group => ({ group, items: map.get(group)! }));
}
