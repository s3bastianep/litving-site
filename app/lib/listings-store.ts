import { and, asc, desc, eq } from "drizzle-orm";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ensureListingsTable, getDb, hasDatabaseUrl } from "../../db";
import { listings } from "../../db/schema";
import { searchListings, type SearchListing, type SearchOperation } from "./search-listings";
import { normalizeSaleDetails, type SaleDetails } from "./sale-details";

export type ListingKind = "Apartamento" | "Casa" | "Oficina";
export type ListingStatus = "disponible" | "reservado" | "no_disponible";

export type ManagedListing = {
  id: string;
  code: string;
  operation: SearchOperation;
  kind: ListingKind;
  zone: string;
  city: string;
  address: string;
  buildingName?: string;
  saleDetails?: SaleDetails;
  priceValue: number;
  priceLabel: string;
  adminFeeValue?: number;
  adminFee?: string;
  priceNote?: string;
  areaM2: number;
  area: string;
  rooms: number;
  baths: number;
  parking: number;
  floor?: string;
  pets: boolean;
  furnished: boolean;
  elevator: boolean;
  stratum?: string;
  status: ListingStatus;
  published: boolean;
  image: string;
  gallery: string[];
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
};

type StoreFile = {
  version: number;
  listings: ManagedListing[];
};

type GlobalStore = {
  __litvingListingsStore?: StoreFile;
};

const g = globalThis as typeof globalThis & GlobalStore;

/** Local-only fallback when DATABASE_URL is not set (vinext dev). */
const storePath = path.join(process.cwd(), "public", "media", "listings-db.json");

export function formatMoney(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function seedFromDemo(): ManagedListing[] {
  const now = new Date().toISOString();
  return searchListings
    .filter(item => item.operation === "venta")
    .map(item => ({
      id: item.id,
      code: item.code,
      operation: item.operation,
      kind: item.kind,
      zone: item.zone,
      city: item.city,
      address: item.address,
      buildingName: item.buildingName,
      saleDetails: item.saleDetails,
      priceValue: item.priceValue,
      priceLabel: item.priceLabel,
      adminFee: item.adminFee,
      adminFeeValue: item.adminFee
        ? Number(item.adminFee.replace(/[^\d]/g, "")) || undefined
        : undefined,
      areaM2: item.areaM2,
      area: item.area,
      rooms: item.rooms,
      baths: item.baths,
      parking: item.parking,
      floor: item.floor,
      pets: item.pets,
      furnished: item.furnished,
      elevator: item.kind !== "Casa",
      stratum: item.zone.includes("Cedritos") || item.zone.includes("Salitre") ? "4" : "5",
      status: "disponible" as const,
      published: true,
      image: item.image,
      gallery: item.gallery.length ? item.gallery : [item.image],
      lat: item.lat,
      lng: item.lng,
      description: item.description,
      amenities: [
        "Portería 24h",
        "Parqueadero visitantes",
        "Zona verde",
        "Gimnasio",
        "Salón comunal",
        item.pets ? "Pet friendly" : "Consultar mascotas",
      ],
      createdAt: now,
      updatedAt: now,
    }));
}

function rowToListing(row: typeof listings.$inferSelect): ManagedListing {
  return {
    id: row.id,
    code: row.code,
    operation: row.operation === "venta" ? "venta" : "arriendo",
    kind:
      row.kind === "Casa" || row.kind === "Oficina" || row.kind === "Apartamento"
        ? row.kind
        : "Apartamento",
    zone: row.zone,
    city: row.city,
    address: row.address,
    buildingName: row.buildingName ?? undefined,
    saleDetails: normalizeSaleDetails(row.saleDetails as SaleDetails | null),
    priceValue: row.priceValue,
    priceLabel: row.priceLabel,
    adminFeeValue: row.adminFeeValue ?? undefined,
    adminFee: row.adminFee ?? undefined,
    priceNote: row.priceNote ?? undefined,
    areaM2: row.areaM2,
    area: row.area,
    rooms: row.rooms,
    baths: row.baths,
    parking: row.parking,
    floor: row.floor ?? undefined,
    pets: row.pets,
    furnished: row.furnished,
    elevator: row.elevator,
    stratum: row.stratum ?? undefined,
    status:
      row.status === "reservado" || row.status === "no_disponible" || row.status === "disponible"
        ? row.status
        : "disponible",
    published: row.published,
    image: row.image,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    lat: row.lat,
    lng: row.lng,
    description: row.description,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function listingToRow(item: ManagedListing) {
  return {
    id: item.id,
    code: item.code,
    operation: item.operation,
    kind: item.kind,
    zone: item.zone,
    city: item.city,
    address: item.address,
    buildingName: item.buildingName ?? null,
    saleDetails: (item.saleDetails ?? null) as Record<string, unknown> | null,
    priceValue: item.priceValue,
    priceLabel: item.priceLabel,
    adminFeeValue: item.adminFeeValue ?? null,
    adminFee: item.adminFee ?? null,
    priceNote: item.priceNote ?? null,
    areaM2: item.areaM2,
    area: item.area,
    rooms: item.rooms,
    baths: item.baths,
    parking: item.parking,
    floor: item.floor ?? null,
    pets: item.pets,
    furnished: item.furnished,
    elevator: item.elevator,
    stratum: item.stratum ?? null,
    status: item.status,
    published: item.published,
    image: item.image,
    gallery: item.gallery ?? [],
    lat: item.lat,
    lng: item.lng,
    description: item.description,
    amenities: item.amenities ?? [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function cloneStore(store: StoreFile): StoreFile {
  return {
    version: store.version,
    listings: store.listings.map(item => ({ ...item, gallery: [...item.gallery], amenities: [...item.amenities] })),
  };
}

function migrateStore(store: StoreFile): StoreFile {
  if (store.version >= 2) return store;
  return {
    version: 2,
    listings: store.listings.filter(item => item.operation !== "arriendo"),
  };
}

async function readDiskStore(): Promise<StoreFile | null> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed?.listings || !Array.isArray(parsed.listings)) return null;
    return migrateStore({
      version: Number(parsed.version) || 1,
      listings: parsed.listings,
    });
  } catch {
    return null;
  }
}

async function writeDiskStore(store: StoreFile) {
  try {
    await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

async function ensureJsonStore(): Promise<StoreFile> {
  if (g.__litvingListingsStore?.listings) {
    const migrated = migrateStore(g.__litvingListingsStore);
    if (migrated !== g.__litvingListingsStore || migrated.version !== g.__litvingListingsStore.version) {
      g.__litvingListingsStore = migrated;
      await writeDiskStore(migrated);
    }
    return g.__litvingListingsStore;
  }

  const fromDisk = await readDiskStore();
  if (fromDisk) {
    g.__litvingListingsStore = fromDisk;
    await writeDiskStore(fromDisk);
    return fromDisk;
  }

  const seeded: StoreFile = { version: 2, listings: seedFromDemo() };
  g.__litvingListingsStore = seeded;
  await writeDiskStore(seeded);
  return seeded;
}

async function saveJsonStore(store: StoreFile) {
  g.__litvingListingsStore = store;
  await writeDiskStore(store);
}

async function ensurePgReady() {
  await ensureListingsTable();
}

export function normalizeListingInput(input: Partial<ManagedListing>, existing?: ManagedListing): ManagedListing {
  const now = new Date().toISOString();
  const priceValue = Number(input.priceValue ?? existing?.priceValue ?? 0) || 0;
  const areaM2 = Number(input.areaM2 ?? existing?.areaM2 ?? 0) || 0;
  const adminFeeValue =
    input.adminFeeValue === undefined || input.adminFeeValue === null || Number(input.adminFeeValue) <= 0
      ? undefined
      : Number(input.adminFeeValue);
  const gallery = (input.gallery?.length ? input.gallery : existing?.gallery || [])
    .map(item => String(item || "").trim())
    .filter(Boolean);
  const image = String(input.image || gallery[0] || existing?.image || "").trim();
  const id =
    String(input.id || existing?.id || "")
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() || `listing-${Date.now()}`;

  const operation = input.operation === "venta" ? "venta" : input.operation === "arriendo" ? "arriendo" : existing?.operation || "arriendo";

  return {
    id,
    code: String(input.code || existing?.code || "L-0000").trim(),
    operation,
    kind:
      input.kind === "Casa" || input.kind === "Oficina" || input.kind === "Apartamento"
        ? input.kind
        : existing?.kind || "Apartamento",
    zone: String(input.zone || existing?.zone || "").trim(),
    city: String(input.city || existing?.city || "Bogotá").trim() || "Bogotá",
    address: String(input.address || existing?.address || "").trim(),
    buildingName: String(input.buildingName || existing?.buildingName || "").trim() || undefined,
    saleDetails: operation === "venta" ? normalizeSaleDetails(input.saleDetails ?? existing?.saleDetails) : undefined,
    priceValue,
    priceLabel: String(input.priceLabel || formatMoney(priceValue)),
    adminFeeValue,
    adminFee: adminFeeValue ? formatMoney(adminFeeValue) : undefined,
    priceNote: String(input.priceNote || existing?.priceNote || "").trim() || undefined,
    areaM2,
    area: `${areaM2} m²`,
    rooms: Math.max(0, Math.round(Number(input.rooms ?? existing?.rooms ?? 0) || 0)),
    baths: Math.max(0, Math.round(Number(input.baths ?? existing?.baths ?? 0) || 0)),
    parking: Math.max(0, Math.round(Number(input.parking ?? existing?.parking ?? 0) || 0)),
    floor: String(input.floor || existing?.floor || "").trim() || undefined,
    pets: Boolean(input.pets ?? existing?.pets ?? false),
    furnished: Boolean(input.furnished ?? existing?.furnished ?? false),
    elevator: Boolean(input.elevator ?? existing?.elevator ?? true),
    stratum: String(input.stratum || existing?.stratum || "").trim() || undefined,
    status:
      input.status === "reservado" || input.status === "no_disponible" || input.status === "disponible"
        ? input.status
        : existing?.status || "disponible",
    published: input.published ?? existing?.published ?? true,
    image: image || "/media/listing-chico-living-hd.jpg",
    gallery: gallery.length ? gallery : image ? [image] : ["/media/listing-chico-living-hd.jpg"],
    lat: Number(input.lat ?? existing?.lat ?? 4.65) || 4.65,
    lng: Number(input.lng ?? existing?.lng ?? -74.06) || -74.06,
    description: String(input.description || existing?.description || "").trim(),
    amenities: Array.isArray(input.amenities)
      ? input.amenities.map(item => String(item).trim()).filter(Boolean)
      : existing?.amenities || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export function toSearchListing(item: ManagedListing): SearchListing {
  return {
    id: item.id,
    code: item.code,
    operation: item.operation,
    kind: item.kind,
    zone: item.zone,
    city: item.city,
    address: item.address,
    buildingName: item.buildingName,
    saleDetails: item.saleDetails,
    priceLabel: item.priceLabel,
    priceValue: item.priceValue,
    area: item.area,
    areaM2: item.areaM2,
    rooms: item.rooms,
    baths: item.baths,
    parking: item.parking,
    floor: item.floor,
    pets: item.pets,
    furnished: item.furnished,
    elevator: item.elevator,
    stratum: item.stratum,
    status: item.status,
    amenities: item.amenities,
    priceNote: item.priceNote,
    adminFee: item.adminFee,
    image: item.image,
    gallery: item.gallery,
    lat: item.lat,
    lng: item.lng,
    description: item.description,
  };
}

export async function listManagedListings() {
  if (hasDatabaseUrl()) {
    await ensurePgReady();
    const rows = await getDb().select().from(listings).orderBy(desc(listings.updatedAt));
    return rows.map(rowToListing);
  }
  const store = await ensureJsonStore();
  return cloneStore(store).listings.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getManagedListing(id: string) {
  if (hasDatabaseUrl()) {
    await ensurePgReady();
    const rows = await getDb().select().from(listings).where(eq(listings.id, id)).limit(1);
    return rows[0] ? rowToListing(rows[0]) : null;
  }
  const store = await ensureJsonStore();
  return store.listings.find(item => item.id === id) || null;
}

export async function upsertManagedListing(input: Partial<ManagedListing>) {
  if (hasDatabaseUrl()) {
    await ensurePgReady();
    const db = getDb();
    const existing = input.id ? await getManagedListing(input.id) : null;
    const next = normalizeListingInput(input, existing || undefined);
    const row = listingToRow(next);
    if (existing) {
      await db.update(listings).set(row).where(eq(listings.id, next.id));
    } else {
      await db.insert(listings).values(row);
    }
    return next;
  }

  const store = cloneStore(await ensureJsonStore());
  const existing = input.id ? store.listings.find(item => item.id === input.id) : undefined;
  const next = normalizeListingInput(input, existing);
  const index = store.listings.findIndex(item => item.id === next.id);
  if (index >= 0) store.listings[index] = next;
  else store.listings.unshift(next);
  await saveJsonStore(store);
  return next;
}

export async function deleteManagedListing(id: string) {
  if (hasDatabaseUrl()) {
    await ensurePgReady();
    const result = await getDb().delete(listings).where(eq(listings.id, id)).returning({ id: listings.id });
    return result.length > 0;
  }
  const store = cloneStore(await ensureJsonStore());
  const before = store.listings.length;
  store.listings = store.listings.filter(item => item.id !== id);
  if (store.listings.length === before) return false;
  await saveJsonStore(store);
  return true;
}

export async function listPublishedSearchListings(operation?: SearchOperation) {
  if (hasDatabaseUrl()) {
    await ensurePgReady();
    const db = getDb();
    const rows = operation
      ? await db
          .select()
          .from(listings)
          .where(and(eq(listings.published, true), eq(listings.operation, operation)))
          .orderBy(asc(listings.zone))
      : await db.select().from(listings).where(eq(listings.published, true)).orderBy(asc(listings.zone));
    return rows.map(row => toSearchListing(rowToListing(row)));
  }

  const all = await listManagedListings();
  return all
    .filter(item => item.published)
    .filter(item => (operation ? item.operation === operation : true))
    .map(toSearchListing);
}

export async function getManagedListingExtras(id: string) {
  const item = await getManagedListing(id);
  if (!item) return null;
  return {
    elevator: item.elevator,
    stratum: item.stratum,
    status: item.status,
    amenities: item.amenities,
    priceNote: item.priceNote,
    description: item.description,
  };
}
