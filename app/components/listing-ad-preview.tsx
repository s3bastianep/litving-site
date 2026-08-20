"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toContactListing, type ContactLead } from "../lib/contact";
import { yesNo, type SaleDetails } from "../lib/sale-details";
import { SketchIcon, type ListingExample } from "./site-kit";

function saleDetailRows(listing: ListingExample, priceM2Label: string, stratum: string, hasElevator: boolean) {
  const s: SaleDetails = listing.saleDetails || {};
  const rows: { label: string; value: string }[] = [
    { label: "Nombre del conjunto", value: listing.buildingName || "" },
    { label: "Dirección", value: listing.address || "" },
    { label: "Barrio", value: listing.zone },
    { label: "Antigüedad", value: s.ageYears !== undefined ? `${s.ageYears} años` : "" },
    { label: "Estrato", value: stratum },
    { label: "Piso", value: listing.floor || "" },
    { label: "Número de apartamento", value: s.apartmentNumber || "" },
    { label: "Remodelado", value: yesNo(s.renovated) || "" },
    { label: "Precio por m² construido", value: priceM2Label },
    { label: "Administración", value: listing.adminFee || "" },
    { label: "Número de parqueadero", value: s.parkingNumber || "" },
    { label: "Torre", value: s.tower || "" },
    { label: "Ascensor", value: hasElevator ? "Sí" : "No" },
    { label: "Número de ascensores", value: s.elevatorCount !== undefined ? String(s.elevatorCount) : "" },
    { label: "Depósito", value: yesNo(s.storage) || "" },
    { label: "Vista exterior", value: yesNo(s.exteriorView) || "" },
    { label: "Balcón", value: yesNo(s.balcony) || "" },
    { label: "Terraza", value: yesNo(s.terrace) || "" },
    { label: "Cuarto de servicio", value: yesNo(s.serviceRoom) || "" },
    { label: "Estudio", value: yesNo(s.study) || "" },
    { label: "Sala de estar", value: yesNo(s.livingRoom) || "" },
    { label: "Aire acondicionado y/o calefacción", value: yesNo(s.acOrHeating) || "" },
    { label: "Cocina integral", value: yesNo(s.integralKitchen) || "" },
    { label: "Inmueble en obra gris", value: yesNo(s.grayWorkProperty) || "" },
    { label: "Baño en obra gris", value: yesNo(s.grayWorkBathroom) || "" },
    { label: "Piso de área social", value: s.socialAreaFlooring || "" },
    { label: "Piso de habitaciones", value: s.bedroomFlooring || "" },
    { label: "Penthouse", value: yesNo(s.penthouse) || "" },
    { label: "Garaje cubierto", value: yesNo(s.coveredGarage) || "" },
    { label: "Tipo de garaje", value: s.garageType || "" },
    { label: "Tipo de inmueble", value: listing.kind },
  ];
  return rows.filter(row => row.value);
}

const weekdayShort = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const monthShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function upcomingVisitDates(count = 14) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      weekday: weekdayShort[date.getDay()],
      day: date.getDate(),
      month: monthShort[date.getMonth()],
    };
  });
}

function InfoGlyph({ name }: { name: "code" | "home" | "city" | "status" | "stratum" | "price" }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "code":
      return (
        <svg {...common}>
          <rect x="5" y="4.5" width="14" height="15" rx="2.2" />
          <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4.5" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4.5 11.2 12 4.8l7.5 6.4" />
          <path d="M7 10.8V19h10v-8.2" />
        </svg>
      );
    case "city":
      return (
        <svg {...common}>
          <path d="M4.8 19V9.5h6.2V19M11 19V5.5h8.2V19" />
          <path d="M7.2 12.2h.1M7.2 15.2h.1M14.2 8.8h.1M17.2 8.8h.1M14.2 12.2h.1M17.2 12.2h.1M14.2 15.5h.1M17.2 15.5h.1" />
        </svg>
      );
    case "status":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.2" />
          <path d="M8.6 12.2 11 14.6 15.6 9.6" />
        </svg>
      );
    case "stratum":
      return (
        <svg {...common}>
          <path d="M12 4.8 14.2 9l4.8.7-3.5 3.4.8 4.8L12 15.6 7.7 17.9l.8-4.8L5 9.7 9.8 9Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M7 8.5h10M7 12h6M7 15.5h8" />
          <rect x="4.5" y="5" width="15" height="14" rx="2.2" />
        </svg>
      );
  }
}

function DetailIcon({
  name,
}: {
  name: "pin" | "code" | "home" | "city" | "status" | "stratum" | "price" | "elevator" | "pets";
}) {
  if (name === "pin" || name === "elevator" || name === "pets") {
    return <SketchIcon name={name} />;
  }
  return <InfoGlyph name={name} />;
}
function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function nearbyFor(zone: string) {
  return [
    {
      group: "Compras",
      items: [
        { name: "Centro Andino", walk: "18 min", car: "6 min" },
        { name: `C.C. cerca a ${zone}`, walk: "12 min", car: "4 min" },
      ],
    },
    {
      group: "Mercado",
      items: [
        { name: "Carulla", walk: "11 min", car: "4 min" },
        { name: "Éxito", walk: "8 min", car: "3 min" },
      ],
    },
    {
      group: "Entorno",
      items: [
        { name: `Parque ${zone}`, walk: "7 min", car: "3 min" },
        { name: "TransMilenio", walk: "10 min", car: "4 min" },
      ],
    },
  ];
}

async function shareListing(listing: ListingExample) {
  const url = new URL(window.location.href);
  url.searchParams.set("inmueble", listing.id);
  url.hash = "";
  const href = url.toString();
  const title = `${listing.kind} en ${listing.zone} · LITVING`;
  const text = `${listing.price} · ${listing.zone}, ${listing.city}`;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url: href });
      return "shared" as const;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return "cancelled" as const;
    }
  }
  try {
    await navigator.clipboard.writeText(href);
    return "copied" as const;
  } catch {
    return "cancelled" as const;
  }
}

export function ListingAdPreview({
  listing,
  onClose,
  onLead,
}: {
  listing: ListingExample;
  onClose: () => void;
  onLead: (lead: ContactLead) => void;
}) {
  const [photo, setPhoto] = useState(0);
  const [visitKind, setVisitKind] = useState<"presencial" | "virtual">("presencial");
  const [visitDate, setVisitDate] = useState<string | null>(null);
  const [visitTime, setVisitTime] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const visitDates = useMemo(() => upcomingVisitDates(), []);
  const visitHours = visitKind === "virtual" ? ["09:00", "11:00", "15:00", "17:00"] : ["10:00", "12:00", "16:00", "18:00"];
  const total = listing.images.length;
  const opLabel = listing.operation === "Renta" ? "Arriendo" : "Venta";
  const priceValue = Number(listing.price.replace(/[^\d]/g, "")) || 0;
  const areaM2 = Number(listing.area.replace(/[^\d]/g, "")) || 1;
  const priceM2Label = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Math.round(priceValue / areaM2));

  const stats = [
    { value: listing.area, label: "Área", icon: "area" as const },
    { value: listing.rooms.replace(" hab.", ""), label: "Habitaciones", icon: "rooms" as const },
    {
      value: listing.baths.replace(/ baños?/, ""),
      label: "Baños",
      icon: "baths" as const,
    },
    {
      value: /ascensor|sí/i.test(listing.elevator) ? "Sí" : "No",
      label: "Ascensor",
      icon: "elevator" as const,
    },
    {
      value: listing.parking.replace(/\s*(park\.|parqueaderos?)\.?/i, "").trim() || listing.parking,
      label: "Parqueaderos",
      icon: "parking" as const,
    },
    {
      value: /^(Sin|No|Consultar)/i.test(listing.pets) ? "No" : "Sí",
      label: "Mascotas",
      icon: "pets" as const,
    },
  ];

  const petsAllowed = /mascotas/i.test(listing.pets) && !/consultar|sin|no/i.test(listing.pets);
  const hasElevator = /ascensor|sí/i.test(listing.elevator);
  const stratum =
    listing.stratum ||
    (listing.zone.includes("Cedritos") || listing.zone.includes("Salitre") ? "4" : "5");
  const statusLabel =
    listing.status === "reservado"
      ? "Reservado"
      : listing.status === "no_disponible"
        ? "No disponible"
        : "Disponible";

  const detailGroups = [
    {
      title: "Ubicación",
      items: [
        { icon: "pin" as const, label: "Barrio", value: listing.zone },
        { icon: "city" as const, label: "Ciudad", value: listing.city },
        { icon: "stratum" as const, label: "Estrato", value: stratum },
      ],
    },
    {
      title: "Publicación",
      items: [
        { icon: "code" as const, label: "Código", value: listing.code },
        { icon: "home" as const, label: "Tipo", value: listing.kind },
        { icon: "status" as const, label: "Estado", value: statusLabel },
      ],
    },
    {
      title: "Condiciones",
      items: [
        { icon: "elevator" as const, label: "Ascensor", value: hasElevator ? "Sí" : "No" },
        { icon: "pets" as const, label: "Mascotas", value: petsAllowed ? "Permitidas" : "Consultar" },
      ],
    },
  ];

  const saleRows =
    listing.operation === "Venta"
      ? saleDetailRows(listing, priceM2Label, stratum, hasElevator)
      : [];
  const observations = listing.saleDetails?.observations;

  const rentValue = priceValue;
  const adminValue = Number((listing.adminFee || "0").replace(/[^\d]/g, "")) || 0;
  const isRent = listing.operation === "Renta";
  const monthlyTotal = isRent ? rentValue + adminValue : rentValue;

  const canBook = Boolean(visitDate && visitTime);

  const openVisit = () => {
    if (!visitDate || !visitTime) return;
    onLead({
      need: "visita",
      listing: toContactListing(listing),
      visit: { kind: visitKind, date: visitDate, time: visitTime },
    });
    onClose();
  };

  const openAdvisor = () => {
    onLead({
      need: listing.operation === "Venta" ? "oferta" : "asesor",
      listing: toContactListing(listing),
    });
    onClose();
  };

  const onShare = async () => {
    const result = await shareListing(listing);
    if (result === "copied") {
      setShareNote("Enlace copiado");
      window.setTimeout(() => setShareNote(null), 2200);
    }
  };

  const amenities =
    listing.amenities && listing.amenities.length
      ? listing.amenities
      : [
          "Portería 24h",
          "Parqueadero visitantes",
          "Zona verde",
          "Gimnasio",
          "Salón comunal",
          /mascotas/i.test(listing.pets) && !/consultar|sin|no/i.test(listing.pets)
            ? "Pet friendly"
            : "Consultar mascotas",
        ];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && total > 1) {
        setPhoto(current => (current - 1 + total) % total);
      }
      if (event.key === "ArrowRight" && total > 1) {
        setPhoto(current => (current + 1) % total);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, total]);

  return (
    <div className="float-backdrop" onMouseDown={onClose}>
      <div
        className="float-page"
        role="dialog"
        aria-modal="true"
        aria-labelledby="float-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className="float-topbar">
          <button type="button" className="float-icon-btn" onClick={onClose} aria-label="Volver">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M15 5 8 12l7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="float-topbar-copy">
            <p className="float-topbar-kicker">{opLabel}</p>
            <p className="float-topbar-title" id="float-title">
              {listing.operation === "Venta" && listing.buildingName
                ? listing.buildingName
                : `${listing.kind} · ${listing.zone}`}
            </p>
          </div>
          <div className="float-topbar-actions">
            <button type="button" className="float-icon-btn" aria-label="Compartir" onClick={onShare}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M8.5 12.5 15 8.8M8.5 11.5 15 15.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="12" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17" cy="7.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <circle cx="17" cy="16.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </button>
            {shareNote ? (
              <span className="float-share-toast" role="status" aria-live="polite">
                {shareNote}
              </span>
            ) : null}
            <button type="button" className="float-icon-btn" aria-label="Cerrar" onClick={onClose}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="float-scroll">
          <section className="float-gallery" aria-label="Galería">
            <div className="float-gallery-main">
              <img
                src={listing.images[photo]}
                alt={`${listing.zone}, ${listing.city}, foto ${photo + 1} de ${total}`}
                decoding="async"
              />
              {total > 1 ? (
                <>
                  <button
                    type="button"
                    className="float-gallery-nav is-prev"
                    aria-label="Foto anterior"
                    onClick={() => setPhoto(current => (current - 1 + total) % total)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="float-gallery-nav is-next"
                    aria-label="Foto siguiente"
                    onClick={() => setPhoto(current => (current + 1) % total)}
                  >
                    ›
                  </button>
                </>
              ) : null}
              <span className="float-gallery-count">
                {photo + 1}/{total}
              </span>
            </div>
            {total > 1 ? (
              <div className="float-thumbs" role="group" aria-label="Miniaturas">
                {listing.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={index === photo ? "is-active" : undefined}
                    onClick={() => setPhoto(index)}
                    aria-label={`Foto ${index + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="float-summary">
            <div className="float-summary-top">
              <span className="float-city-pill">{listing.city.toUpperCase()}</span>
              <span className={`float-available ${statusLabel !== "Disponible" ? "is-muted" : ""}`}>
                {statusLabel}
              </span>
            </div>
            {listing.operation === "Venta" ? (
              <>
                <h2 className="float-sale-title">
                  {listing.buildingName || `${listing.kind} en ${listing.zone}`}
                </h2>
                <p className="float-sale-meta">
                  {listing.address ? <span>{listing.address}</span> : null}
                  {listing.adminFee ? <span>Admin: {listing.adminFee}*</span> : null}
                </p>
                {listing.adminFee ? (
                  <p className="float-sale-disclaimer">*Valores aproximados, validar antes de realizar la compra</p>
                ) : null}
                <p className="float-sale-highlight">
                  {listing.area} · {listing.rooms.replace(" hab.", " Hab")} · {listing.baths} ·{" "}
                  {listing.parking.replace(/\s*(park\.|parqueaderos?)\.?/i, " Parqueadero").trim()}
                </p>
                <div className="float-sale-price-row">
                  <div>
                    <p className="float-price-label">Precio de venta</p>
                    <p className="float-price">{listing.price}</p>
                  </div>
                  <p className="float-sale-nid">
                    <em>Código</em> <strong>{listing.code}</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="float-summary-top float-summary-top--rent">
                  <span className="float-code">
                    <em>Código</em>
                    <strong>{listing.code}</strong>
                  </span>
                </div>
                <h2>
                  {listing.kind} en {listing.zone}
                </h2>
                <p className="float-location">
                  <span className="float-pin" aria-hidden="true">
                    <SketchIcon name="pin" />
                  </span>
                  <span className="float-locality">
                    <b>{listing.zone}</b>
                    <span>{listing.city}</span>
                  </span>
                </p>
                <p className="float-facts">
                  <span>{listing.kind}</span>
                  <span>{listing.floor}</span>
                </p>
                <div
                  className={`float-price-grid ${
                    listing.adminFee || listing.priceNote ? "float-price-grid--two" : "float-price-grid--one"
                  }`}
                >
                  <div className="float-price-item float-price-item--main">
                    <p className="float-price-label">Precio de arriendo</p>
                    <p className="float-price">
                      {listing.price}
                      {listing.priceSuffix ? <span>{listing.priceSuffix}</span> : null}
                    </p>
                  </div>
                  {listing.adminFee ? (
                    <div className="float-price-item">
                      <p className="float-price-label">Administración</p>
                      <p className="float-price-aside">{listing.adminFee}</p>
                    </div>
                  ) : listing.priceNote ? (
                    <div className="float-price-item">
                      <p className="float-price-label">Nota</p>
                      <p className="float-price-aside">{listing.priceNote}</p>
                    </div>
                  ) : null}
                </div>
              </>
            )}
            <ul className="float-stats" aria-label="Características principales">
              {stats.map(stat => (
                <li key={stat.label}>
                  <span className="float-stat-icon" aria-hidden="true">
                    <SketchIcon name={stat.icon} />
                  </span>
                  <strong>{stat.value}</strong>
                  <em>{stat.label}</em>
                </li>
              ))}
            </ul>
          </section>

          <section className="float-block">
            <h3>Descripción</h3>
            <p>
              {listing.description ||
                `${listing.kind} en ${listing.zone}, ${listing.city}. Publicación con fotografías profesionales para que evalúes espacios, piso ${listing.floor.replace("Piso ", "")} y el entorno inmediato.`}
            </p>
          </section>

          {listing.operation === "Venta" ? (
            <>
              <section className="float-block float-sale-details">
                <h3>Detalles del inmueble</h3>
                <dl className="float-sale-grid">
                  {saleRows.map(row => (
                    <div key={row.label} className="float-sale-cell">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              {observations ? (
                <section className="float-block">
                  <h3>Observaciones</h3>
                  <p>{observations}</p>
                </section>
              ) : null}
            </>
          ) : (
            <section className="float-block float-details">
              <h3>Detalles del inmueble</h3>
              <div className="float-detail-groups">
                {detailGroups.map(group => (
                  <article key={group.title} className="float-detail-group">
                    <h4>{group.title}</h4>
                    <ul className="float-detail-list">
                      {group.items.map(item => (
                        <li key={item.label} className="float-detail-row">
                          <span className="float-detail-lead">
                            <span className="float-detail-icon" aria-hidden="true">
                              <DetailIcon name={item.icon} />
                            </span>
                            <span className="float-detail-label">{item.label}</span>
                          </span>
                          <span className="float-detail-value">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="float-block">
            <h3>Características del conjunto</h3>
            <ul className="float-amenities">
              {amenities.map(item => (
                <li key={item}>
                  <SketchIcon name="check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="float-book" aria-label="Agendar visita">
            <div className="float-book-section">
              <h3>Tipo de visita</h3>
              <div className="float-book-types">
                <button
                  type="button"
                  className={visitKind === "presencial" ? "is-on" : undefined}
                  aria-pressed={visitKind === "presencial"}
                  onClick={() => {
                    setVisitKind("presencial");
                    setVisitTime(null);
                  }}
                >
                  <strong>Presencial</strong>
                  <em>En el inmueble</em>
                </button>
                <button
                  type="button"
                  className={visitKind === "virtual" ? "is-on" : undefined}
                  aria-pressed={visitKind === "virtual"}
                  onClick={() => {
                    setVisitKind("virtual");
                    setVisitTime(null);
                  }}
                >
                  <strong>Virtual</strong>
                  <em>Video llamada</em>
                </button>
              </div>
            </div>

            <div className="float-book-section">
              <h3>Fecha</h3>
              <div className="float-book-dates">
                <button
                  type="button"
                  className="float-book-date-nav"
                  aria-label="Fechas anteriores"
                  onClick={() => datesRef.current?.scrollBy({ left: -96, behavior: "smooth" })}
                >
                  ‹
                </button>
                <div className="float-book-date-track" ref={datesRef} role="list">
                  {visitDates.map(date => (
                    <button
                      key={date.key}
                      type="button"
                      role="listitem"
                      className={visitDate === date.key ? "is-on" : undefined}
                      onClick={() => {
                        setVisitDate(date.key);
                        setVisitTime(null);
                      }}
                    >
                      <span>{date.weekday}</span>
                      <strong>{date.day}</strong>
                      <em>{date.month}</em>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="float-book-date-nav"
                  aria-label="Fechas siguientes"
                  onClick={() => datesRef.current?.scrollBy({ left: 96, behavior: "smooth" })}
                >
                  ›
                </button>
              </div>
            </div>

            <div className="float-book-section">
              <h3>Hora</h3>
              {visitDate ? (
                <div className="float-book-times">
                  {visitHours.map(time => (
                    <button
                      key={time}
                      type="button"
                      className={visitTime === time ? "is-on" : undefined}
                      onClick={() => setVisitTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="float-book-hint">Selecciona una fecha para ver horarios disponibles.</p>
              )}
            </div>

            <div className="float-book-cost">
              <p className="float-book-cost-kicker">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <rect x="4" y="6" width="16" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M4 10h16M8 6V4.8M16 6V4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M8.5 14h3M8.5 16.5h7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                {isRent ? "Costo mensual" : "Resumen"}
              </p>
              <div className="float-book-total">
                <span>{isRent ? "Total mensual" : "Precio"}</span>
                <strong>{money(monthlyTotal)}</strong>
              </div>
              <dl>
                <div>
                  <dt>{isRent ? "Arriendo" : "Precio de venta"}</dt>
                  <dd>{listing.price}</dd>
                </div>
                {listing.adminFee ? (
                  <div>
                    <dt>Administración</dt>
                    <dd>{listing.adminFee}</dd>
                  </div>
                ) : null}
                {isRent ? (
                  <div>
                    <dt>Depósito (una vez)</dt>
                    <dd>{money(rentValue)}</dd>
                  </div>
                ) : null}
              </dl>
              {!canBook ? (
                <p className="float-book-hint">Elige fecha y hora para agendar la visita.</p>
              ) : null}
              <button
                type="button"
                className="float-cta float-cta--primary"
                onClick={openVisit}
                disabled={!canBook}
              >
                Agendar visita
              </button>
            </div>
          </section>

          <section className="float-block float-nearby">
            <header className="float-nearby-head">
              <h3>Lugares cercanos</h3>
              <p className="float-block-lead">
                Tiempos aproximados a pie y en carro desde {listing.zone}.
              </p>
              <p className="float-nearby-legend" aria-hidden="true">
                <span className="float-nearby-legend-item float-nearby-legend-item--walk">
                  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                    <circle cx="13.2" cy="5.2" r="1.7" fill="currentColor" />
                    <path
                      d="M10.2 21.2 12 14.8l-2.2-2.4 1.4-3.6c.3-.7 1-1.2 1.8-1.2h.4c.9 0 1.6.6 1.8 1.4L16 13.2l2.2 1.4M12 14.8l1.8 6.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  A pie
                </span>
                <span className="float-nearby-legend-item float-nearby-legend-item--car">
                  <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                    <path
                      d="M4.5 15.2h15M6.2 15.2l1.2-5.4c.2-.8.9-1.4 1.7-1.4h5.8c.8 0 1.5.6 1.7 1.4l1.2 5.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="17.2" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="16" cy="17.2" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  En carro
                </span>
              </p>
            </header>
            <div className="float-nearby-shell">
              <div className="float-nearby-groups">
                {nearbyFor(listing.zone).map(group => (
                  <article key={group.group} className="float-nearby-group">
                    <h4>{group.group}</h4>
                    <ul className="float-nearby-list">
                      {group.items.map(item => (
                        <li key={item.name} className="float-nearby-row">
                          <span className="float-nearby-name">{item.name}</span>
                          <span className="float-nearby-meta">
                            <span className="float-nearby-meta-item float-nearby-meta-item--walk">
                              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                                <circle cx="13.2" cy="5.2" r="1.7" fill="currentColor" />
                                <path
                                  d="M10.2 21.2 12 14.8l-2.2-2.4 1.4-3.6c.3-.7 1-1.2 1.8-1.2h.4c.9 0 1.6.6 1.8 1.4L16 13.2l2.2 1.4M12 14.8l1.8 6.4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <strong>{item.walk}</strong>
                            </span>
                            <span className="float-nearby-meta-item float-nearby-meta-item--car">
                              <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                                <path
                                  d="M4.5 15.2h15M6.2 15.2l1.2-5.4c.2-.8.9-1.4 1.7-1.4h5.8c.8 0 1.5.6 1.7 1.4l1.2 5.4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle cx="8" cy="17.2" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                                <circle cx="16" cy="17.2" r="1.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                              </svg>
                              <strong>{item.car}</strong>
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="float-footer">
          <button type="button" className="float-cta float-cta--secondary" onClick={openAdvisor}>
            <span>{listing.operation === "Venta" ? "Ofertar" : "Hablar con un asesor"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
