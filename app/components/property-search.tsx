"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import {
  listingsFor,
  type SearchListing,
  type SearchOperation,
} from "../lib/search-listings";
import { type ContactLead } from "../lib/contact";
import {
  InteractiveListingCard,
  type ListingExample,
} from "./site-kit";
import { ListingAdPreview } from "./listing-ad-preview";
import { BrandLogo } from "./brand-logo";
import { ContactModal } from "./contact-modal";
import { MobileAppNav, SearchMobileDock } from "./mobile-app-nav";
import { loadLeaflet } from "../lib/leaflet-loader";

type PropertySearchProps = {
  operation: SearchOperation;
};

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "area-desc";
type MobileView = "split" | "map" | "list";

const kinds = ["Todos", "Apartamento", "Casa", "Oficina"] as const;
const spaceOptions = ["Todos", "1", "2", "3", "4+"] as const;
const bathOptions = ["Todos", "1", "2", "3", "4+"] as const;
const parkingOptions = ["Todos", "1", "2", "3", "4+"] as const;

type SpaceOption = (typeof spaceOptions)[number];
type OpenMenu = null | "tipo" | "precio" | "espacios" | "more";

function shortPrice(label: string) {
  return label.replace(/\s/g, "\u00a0");
}

function matchesQuery(item: SearchListing, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return [item.zone, item.city, item.kind, item.address, item.buildingName, item.code, item.description].some(
    value => value.toLowerCase().includes(q),
  );
}

function minFromOption(value: string) {
  if (value === "Todos" || value === "Cualquiera") return 0;
  if (value.endsWith("+")) return Number.parseInt(value, 10) || 0;
  return Number.parseInt(value, 10) || 0;
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M6.5 9.5 12 15l5.5-5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 7h10M14 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM4 17h6M10 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM20 17h-6M20 7H18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.2 16.2 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="search-segment">
      <p className="search-segment-label">{label}</p>
      <div className="search-segment-group" role="group" aria-label={label}>
        {options.map(option => (
          <button
            key={option}
            type="button"
            className={value === option ? "is-on" : undefined}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function toListingExample(item: SearchListing): ListingExample {
  return {
    id: item.id,
    code: item.code.replace(/^L-/, ""),
    zone: item.zone,
    city: item.city,
    floor: item.floor ?? "Consultar",
    buildingName: item.buildingName,
    saleDetails: item.saleDetails,
    address: item.address,
    operation: item.operation === "arriendo" ? "Renta" : "Venta",
    kind: item.kind,
    price: item.priceLabel,
    priceSuffix: item.operation === "arriendo" ? "/ mes" : "",
    adminFee: item.adminFee,
    priceNote: item.priceNote,
    area: item.area,
    rooms: `${item.rooms} hab.`,
    baths: `${item.baths} baños`,
    parking: `${item.parking} park.`,
    elevator: item.elevator === false ? "Sin ascensor" : "Ascensor",
    pets: item.pets ? "Mascotas" : "Consultar",
    images: item.gallery.length ? item.gallery : [item.image],
    description: item.description,
    stratum: item.stratum,
    status: item.status,
    amenities: item.amenities,
  };
}

export function PropertySearch({ operation }: PropertySearchProps) {
  const [query, setQuery] = useState("");
  const [city] = useState("Bogotá");
  const [kind, setKind] = useState<(typeof kinds)[number]>("Todos");
  const [rooms, setRooms] = useState<SpaceOption>("Todos");
  const [baths, setBaths] = useState<SpaceOption>("Todos");
  const [parking, setParking] = useState<SpaceOption>("Todos");
  const [petsOnly, setPetsOnly] = useState(false);
  const [furnishedOnly, setFurnishedOnly] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<SearchListing | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("list");
  const [mapEnabled, setMapEnabled] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [contactLead, setContactLead] = useState<ContactLead | null>(null);
  const [catalog, setCatalog] = useState<SearchListing[]>(() => listingsFor(operation));
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const markerSyncId = useRef(0);
  const fittedIdsRef = useRef("");
  const filtersRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/listings?operation=${operation}`)
      .then(res => (res.ok ? res.json() : null))
      .then((data: { listings?: SearchListing[] } | null) => {
        if (!alive || !data?.listings?.length) return;
        setCatalog(data.listings);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [operation]);

  const all = catalog;

  const setView = (view: MobileView) => {
    if (view !== "list") setMapEnabled(true);
    setMobileView(view);
  };

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 980px)").matches;
    if (!narrow) {
      setMobileView("split");
      setMapEnabled(true);
    }
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("inmueble");
    if (!id) return;
    const found = all.find(item => item.id === id);
    if (found) {
      setSelected(found);
      setActiveId(found.id);
    }
  }, [all]);

  const filtered = useMemo(() => {
    const minRooms = minFromOption(rooms);
    const minBaths = minFromOption(baths);
    const minParking = minFromOption(parking);

    const list = all.filter(item => {
      if (!matchesQuery(item, query)) return false;
      if (city && item.city !== city) return false;
      if (kind !== "Todos" && item.kind !== kind) return false;
      if (minRooms && item.rooms < minRooms) return false;
      if (minBaths && item.baths < minBaths) return false;
      if (minParking && item.parking < minParking) return false;
      if (maxPrice != null && item.priceValue > maxPrice) return false;
      if (petsOnly && !item.pets) return false;
      if (furnishedOnly && !item.furnished) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "precio-asc") sorted.sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "precio-desc") sorted.sort((a, b) => b.priceValue - a.priceValue);
    if (sort === "area-desc") sorted.sort((a, b) => b.areaM2 - a.areaM2);
    return sorted;
  }, [all, query, city, kind, rooms, baths, parking, maxPrice, petsOnly, furnishedOnly, sort]);

  const priceOptions =
    operation === "arriendo"
      ? [
          { label: "Cualquier precio", value: null },
          { label: "Hasta $ 4.000.000", value: 4000000 },
          { label: "Hasta $ 6.000.000", value: 6000000 },
          { label: "Hasta $ 8.000.000", value: 8000000 },
          { label: "Hasta $ 12.000.000", value: 12000000 },
        ]
      : [
          { label: "Cualquier precio", value: null },
          { label: "Hasta $ 800.000.000", value: 800000000 },
          { label: "Hasta $ 1.200.000.000", value: 1200000000 },
          { label: "Hasta $ 1.800.000.000", value: 1800000000 },
          { label: "Hasta $ 2.500.000.000", value: 2500000000 },
        ];

  const priceLabel =
    priceOptions.find(option => option.value === maxPrice)?.label ?? "Precio";

  const spacesActive = rooms !== "Todos" || baths !== "Todos" || parking !== "Todos";
  const spacesLabel = spacesActive ? "Espacios · filtro" : "Espacios";
  const moreActive = petsOnly || furnishedOnly;
  const sortLabel =
    sort === "relevancia"
      ? "Por defecto"
      : sort === "precio-asc"
        ? "Menor precio"
        : sort === "precio-desc"
          ? "Mayor precio"
          : "Mayor área";

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu(current => (current === menu ? null : menu));
  };

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!mapEnabled) return;
    let cancelled = false;
    if (!(markersRef.current instanceof Map)) {
      markersRef.current = new Map();
    }

    async function setupMap() {
      if (!mapRef.current || mapInstance.current) return;
      const L = await loadLeaflet();
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: true,
      }).setView([4.67, -74.06], 12);

      map.attributionControl.setPrefix(false);
      L.control.zoom({ position: "topleft" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(map);

      mapInstance.current = map;
      requestAnimationFrame(() => {
        map.invalidateSize();
        setMapReady(true);
      });
    }

    setupMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = new Map();
      fittedIdsRef.current = "";
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      setMapReady(false);
    };
  }, [mapEnabled]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    if (!(markersRef.current instanceof Map)) {
      markersRef.current = new Map();
    }

    const syncId = ++markerSyncId.current;
    const liveMap = map;
    const idsKey = filtered.map(item => item.id).join("|");

    async function syncMarkers() {
      const L = await loadLeaflet();
      if (syncId !== markerSyncId.current || !mapInstance.current) return;
      if (!(markersRef.current instanceof Map)) {
        markersRef.current = new Map();
      }

      const nextIds = new Set(filtered.map(item => item.id));
      markersRef.current.forEach((marker, id) => {
        if (!nextIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      });

      const bounds: [number, number][] = [];

      filtered.forEach(item => {
        const isActive = item.id === activeId;
        const html = `<button type="button" class="search-map-pin-btn${isActive ? " is-active" : ""}">${shortPrice(item.priceLabel)}</button>`;
        const icon = L.divIcon({
          className: "search-map-pin",
          html,
          iconSize: [108, 36],
          iconAnchor: [54, 36],
        });

        const existing = markersRef.current.get(item.id);
        if (existing) {
          existing.setIcon(icon);
          existing.setLatLng([item.lat, item.lng]);
        } else {
          const marker = L.marker([item.lat, item.lng], { icon }).addTo(liveMap);
          marker.on("click", () => {
            setActiveId(item.id);
            setSelected(item);
            document.getElementById(`listing-${item.id}`)?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          });
          markersRef.current.set(item.id, marker);
        }
        bounds.push([item.lat, item.lng]);
      });

      if (idsKey !== fittedIdsRef.current) {
        fittedIdsRef.current = idsKey;
        if (bounds.length > 1) {
          liveMap.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
        } else if (bounds.length === 1) {
          liveMap.setView(bounds[0], 15);
        }
      }

      requestAnimationFrame(() => liveMap.invalidateSize());
    }

    syncMarkers();
  }, [filtered, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    if (!(markersRef.current instanceof Map)) return;

    async function paintActive() {
      const L = await loadLeaflet();
      filtered.forEach(item => {
        const marker = markersRef.current.get(item.id);
        if (!marker) return;
        const isActive = item.id === activeId;
        marker.setIcon(
          L.divIcon({
            className: "search-map-pin",
            html: `<button type="button" class="search-map-pin-btn${isActive ? " is-active" : ""}">${shortPrice(item.priceLabel)}</button>`,
            iconSize: [108, 36],
            iconAnchor: [54, 36],
          }),
        );
      });
    }

    paintActive();
  }, [activeId, filtered, mapReady]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;
    requestAnimationFrame(() => map.invalidateSize());
  }, [mobileView, mapReady, selected]);

  const clearFilters = () => {
    setQuery("");
    setKind("Todos");
    setRooms("Todos");
    setBaths("Todos");
    setParking("Todos");
    setPetsOnly(false);
    setFurnishedOnly(false);
    setMaxPrice(null);
    setSort("relevancia");
    setOpenMenu(null);
  };

  return (
    <div className="search-page search-page--app has-mobile-nav">
      <header className="search-header">
        <div className="search-header-inner">
          <a className="brand" href="/" aria-label="Litving, inicio">
            <BrandLogo />
          </a>
          <nav className="search-nav" aria-label="Buscar inmuebles">
            <Link href="/arrendar" className={operation === "arriendo" ? "is-active" : undefined}>
              Arrendar
            </Link>
            <Link href="/comprar" className={operation === "venta" ? "is-active" : undefined}>
              Comprar
            </Link>
            <Link href="/#beneficios">Nosotros</Link>
          </nav>
          <div className="search-header-actions">
            <Link href="/" className="search-account">
              Inicio
            </Link>
            <button
              type="button"
              className="button button-primary search-publish"
              onClick={() => setContactLead({ need: "arriendo" })}
            >
              Publicar inmueble
            </button>
          </div>
        </div>
      </header>

      <div className="search-filters-shell" ref={filtersRef}>
        <div className="search-filters" role="search">
          <label className="search-query">
            <span className="sr-only">Buscar</span>
            <span className="search-query-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder="Ciudad, barrio o código"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </label>

          <div className={`search-dd${openMenu === "tipo" ? " is-open" : ""}`}>
            <button
              type="button"
              className={`search-dd-trigger${kind !== "Todos" ? " is-on" : ""}`}
              aria-expanded={openMenu === "tipo"}
              onClick={() => toggleMenu("tipo")}
            >
              <span>{kind === "Todos" ? "Tipo" : kind}</span>
              <ChevronDown />
            </button>
            {openMenu === "tipo" ? (
              <div className="search-dd-menu" role="listbox" aria-label="Tipo de inmueble">
                {kinds.map(item => (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={kind === item}
                    onClick={() => {
                      setKind(item);
                      setOpenMenu(null);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`search-dd${openMenu === "precio" ? " is-open" : ""}`}>
            <button
              type="button"
              className={`search-dd-trigger${maxPrice != null ? " is-on" : ""}`}
              aria-expanded={openMenu === "precio"}
              onClick={() => toggleMenu("precio")}
            >
              <span>{maxPrice == null ? "Precio" : priceLabel.replace("Hasta ", "")}</span>
              <ChevronDown />
            </button>
            {openMenu === "precio" ? (
              <div className="search-dd-menu" role="listbox" aria-label="Precio">
                {priceOptions.map(option => (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="option"
                    aria-selected={maxPrice === option.value}
                    onClick={() => {
                      setMaxPrice(option.value);
                      setOpenMenu(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`search-dd search-dd--spaces${openMenu === "espacios" ? " is-open" : ""}`}>
            <button
              type="button"
              className={`search-dd-trigger${spacesActive ? " is-on" : ""}`}
              aria-expanded={openMenu === "espacios"}
              onClick={() => toggleMenu("espacios")}
            >
              <span>{spacesLabel}</span>
              <ChevronDown />
            </button>
            {openMenu === "espacios" ? (
              <div className="search-dd-panel" role="dialog" aria-label="Espacios">
                <SegmentedControl
                  label="Habitaciones"
                  value={rooms}
                  options={spaceOptions}
                  onChange={value => setRooms(value as SpaceOption)}
                />
                <SegmentedControl
                  label="Baños"
                  value={baths}
                  options={bathOptions}
                  onChange={value => setBaths(value as SpaceOption)}
                />
                <SegmentedControl
                  label="Parqueaderos"
                  value={parking}
                  options={parkingOptions}
                  onChange={value => setParking(value as SpaceOption)}
                />
              </div>
            ) : null}
          </div>

          <div className={`search-dd search-dd--more${openMenu === "more" ? " is-open" : ""}`}>
            <button
              type="button"
              className={`search-icon-btn${moreActive || openMenu === "more" ? " is-on" : ""}`}
              aria-label="Más filtros"
              aria-expanded={openMenu === "more"}
              onClick={() => toggleMenu("more")}
            >
              <FiltersIcon />
            </button>
            {openMenu === "more" ? (
              <div className="search-dd-panel search-dd-panel--more" role="dialog" aria-label="Más filtros">
                <label className="search-check">
                  <input
                    type="checkbox"
                    checked={petsOnly}
                    onChange={event => setPetsOnly(event.target.checked)}
                  />
                  Acepta mascotas
                </label>
                <label className="search-check">
                  <input
                    type="checkbox"
                    checked={furnishedOnly}
                    onChange={event => setFurnishedOnly(event.target.checked)}
                  />
                  Amoblado
                </label>
                <button type="button" className="search-clear" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={`search-split search-split--${mobileView}`}>
        <section className="search-map-panel" aria-label="Mapa de resultados">
          {mapEnabled ? (
            <>
              <div ref={mapRef} className="search-map" />
              {!mapReady ? <p className="search-map-loading">Cargando mapa…</p> : null}
            </>
          ) : (
            <p className="search-map-loading">El mapa se carga al elegir Mapa o Ambos.</p>
          )}
        </section>

        <section className="search-results" aria-label="Resultados">
          <div className="search-results-toolbar">
            <p className="search-results-line">
              <strong>
                {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
              </strong>
            </p>
            <label className="search-sort-inline">
              <span>Ordenar:</span>
              <select value={sort} onChange={event => setSort(event.target.value as SortKey)}>
                <option value="relevancia">Por defecto</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="area-desc">Mayor área</option>
              </select>
              <em className="search-sort-value" aria-hidden="true">
                {sortLabel}
              </em>
            </label>
            <div className="search-view-toggle" role="group" aria-label="Vista">
              <button
                type="button"
                className={mobileView === "map" ? "is-on" : undefined}
                onClick={() => setView("map")}
              >
                Mapa
              </button>
              <button
                type="button"
                className={mobileView === "list" ? "is-on" : undefined}
                onClick={() => setView("list")}
              >
                Lista
              </button>
              <button
                type="button"
                className={mobileView === "split" ? "is-on" : undefined}
                onClick={() => setView("split")}
              >
                Ambos
              </button>
            </div>
          </div>

          <div className="listing-grid search-listing-grid">
            {filtered.map((item, index) => (
              <InteractiveListingCard
                key={item.id}
                id={`listing-${item.id}`}
                className={activeId === item.id ? "is-active" : undefined}
                listing={toListingExample(item)}
                priority={index < 2}
                onHover={() => setActiveId(item.id)}
                onOpen={() => {
                  setSelected(item);
                  setActiveId(item.id);
                }}
              />
            ))}

            <article className="search-promo">
              <div className="search-promo-inner">
                <p>¿Quieres publicar tu inmueble?</p>
                <button type="button" className="button" onClick={() => setContactLead({ need: "arriendo" })}>
                  Publicar con Litving
                </button>
              </div>
            </article>
          </div>

          {filtered.length === 0 ? (
            <div className="search-empty" role="status">
              {all.length === 0 ? (
                <>
                  <strong>
                    {operation === "arriendo"
                      ? "No hay propiedades disponibles en el momento para arrendar."
                      : "No hay propiedades disponibles en el momento para comprar."}
                  </strong>
                  <p>
                    {operation === "arriendo"
                      ? "Estamos actualizando el inventario. Vuelve pronto o déjanos tus datos para avisarte."
                      : "Estamos actualizando el inventario. Vuelve pronto o consulta con un asesor."}
                  </p>
                </>
              ) : (
                <p>No hay inmuebles con esos filtros. Prueba ampliar el precio o las habitaciones.</p>
              )}
            </div>
          ) : null}
        </section>
      </div>

      {selected ? (
        <ListingAdPreview
          listing={toListingExample(selected)}
          onClose={() => setSelected(null)}
          onLead={lead => {
            setSelected(null);
            setContactLead(lead);
          }}
        />
      ) : null}

      {contactLead ? (
        <ContactModal
          key={`${contactLead.need}-${contactLead.listing?.id ?? "search"}`}
          lead={contactLead}
          onClose={() => setContactLead(null)}
        />
      ) : null}

      <SearchMobileDock view={mobileView} onChange={setView} />
      <MobileAppNav
        active="search"
        searchHref="/buscar"
        onContact={() => setContactLead({ need: operation === "venta" ? "venta" : "arriendo" })}
      />
    </div>
  );
}
