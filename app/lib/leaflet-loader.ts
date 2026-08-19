import type { Map as LeafletMap } from "leaflet";

type LeafletModule = typeof import("leaflet");

let leafletModule: Promise<LeafletModule> | null = null;
let cssLoaded = false;

export async function loadLeaflet(): Promise<LeafletModule["default"]> {
  if (!cssLoaded) {
    cssLoaded = true;
    await import("leaflet/dist/leaflet.css");
  }
  if (!leafletModule) {
    leafletModule = import("leaflet");
  }
  return (await leafletModule).default;
}

export type { LeafletMap };
