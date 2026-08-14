"use client";

import {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export type ListingExample = {
  id: string;
  code: string;
  zone: string;
  city: string;
  floor: string;
  operation: "Renta" | "Venta";
  kind: string;
  price: string;
  priceSuffix: string;
  priceNote?: string;
  adminFee?: string;
  area: string;
  rooms: string;
  baths: string;
  parking: string;
  elevator: string;
  pets: string;
  images: string[];
};

export const listingExamples: ListingExample[] = [
  {
    id: "chico",
    code: "1108",
    zone: "Chicó",
    city: "Bogotá",
    floor: "Piso 8",
    operation: "Renta",
    kind: "Apartamento",
    price: "$ 8.900.000",
    priceSuffix: "/ mes",
    adminFee: "$ 980.000",
    area: "95 m²",
    rooms: "2 hab.",
    baths: "2 baños",
    parking: "1 parqueadero",
    elevator: "Ascensor",
    pets: "Mascotas",
    images: [
      "/media/listing-chico-living-hd.png",
      "/media/listing-chico-kitchen-hd.png",
      "/media/listing-chico-bedroom-hd.png",
    ],
  },
  {
    id: "chapinero",
    code: "2312",
    zone: "Chapinero",
    city: "Bogotá",
    floor: "Piso 12",
    operation: "Venta",
    kind: "Apartamento",
    price: "$ 1.850.000.000",
    priceSuffix: "",
    area: "120 m²",
    rooms: "3 hab.",
    baths: "2 baños",
    parking: "2 parqueaderos",
    elevator: "Ascensor",
    pets: "Mascotas",
    images: [
      "/media/listing-chapinero-v2-living-hd.png",
      "/media/listing-chapinero-v2-kitchen-hd.png",
      "/media/listing-chapinero-v2-bedroom-hd.png",
    ],
  },
  {
    id: "salitre",
    code: "5205",
    zone: "Salitre",
    city: "Bogotá",
    floor: "Piso 5",
    operation: "Renta",
    kind: "Apartamento",
    price: "$ 6.500.000",
    priceSuffix: "/ mes",
    priceNote: "Incluye administración",
    area: "78 m²",
    rooms: "2 hab.",
    baths: "2 baños",
    parking: "1 parqueadero",
    elevator: "Ascensor",
    pets: "Consultar",
    images: [
      "/media/listing-salitre-terrace-a-hd.png",
      "/media/listing-salitre-living-hd.png",
      "/media/listing-salitre-terrace-b-hd.png",
    ],
  },
];

type SketchIconName =
  | "area"
  | "rooms"
  | "baths"
  | "parking"
  | "elevator"
  | "pets"
  | "pin"
  | "check"
  | "calendar";

const listingSpecIconAssets: Partial<Record<SketchIconName, string>> = {
  area: "/media/listing-icon-area-glyph.png",
  rooms: "/media/listing-icon-rooms-glyph.png",
  baths: "/media/listing-icon-baths-glyph.png",
  parking: "/media/listing-icon-parking-glyph.png",
  elevator: "/media/listing-icon-elevator-glyph.png",
  pets: "/media/listing-icon-pets-glyph.png",
};

export function SketchIcon({ name }: { name: SketchIconName }) {
  const asset = listingSpecIconAssets[name];
  if (asset) {
    return (
      <img
        className={`sketch-icon sketch-icon--${name} sketch-icon--asset`}
        src={asset}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    );
  }

  const common = {
    className: `sketch-icon sketch-icon--${name}`,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12.1 20.5s-5.3-4.5-5.2-8.3c0-2.8 2.2-5 5.1-5.1 2.8.1 5 2.3 5 5.2 0 3.7-4.9 8.2-4.9 8.2Z" />
          <path d="M12 9.5c1 .1 1.7.8 1.7 1.7-.1.9-.9 1.6-1.8 1.5-.9-.1-1.5-.9-1.4-1.7.1-.9.8-1.5 1.5-1.5Z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M4.8 12.4 9.1 16.7 19.4 6.4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common} strokeWidth={1.8}>
          <rect x="3.75" y="5.25" width="16.5" height="15" rx="2.4" />
          <path d="M8 3.5v3.6M16 3.5v3.6" />
          <path d="M3.75 9.75h16.5" />
          <path d="M8.2 13.4h2.2M11.9 13.4h2.2M15.6 13.4h1.4" />
          <path d="M8.2 16.4h2.2M11.9 16.4h2.2" />
        </svg>
      );
    default:
      return null;
  }
}

export function ArchitecturalBlueprint() {
  const signals = [
    { label: "Pago recibido", className: "tag--payment" },
    { label: "Arrendatario verificado", className: "tag--tenant" },
    { label: "Asesor asignado", className: "tag--advisor" },
  ] as const;

  return (
    <div className="blueprint" aria-label="Ilustración arquitectónica de una casa moderna">
      <img
        className="blueprint-art"
        src="/media/hero-architectural-illustration-v4-transparent.png"
        alt="Casa moderna ilustrada con trazo arquitectónico y paisajismo detallado"
      />
      <ul className="blueprint-tags" aria-label="Señales de gestión Litving">
        {signals.map((signal) => (
          <li key={signal.label} className={`blueprint-tag ${signal.className}`}>
            <span aria-hidden="true">✓</span>
            {signal.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InteractiveListingCard({
  listing,
  onOpen,
  id,
  className,
  onHover,
}: {
  listing: ListingExample;
  onOpen: (listing: ListingExample) => void;
  id?: string;
  className?: string;
  onHover?: () => void;
}) {
  const [photo, setPhoto] = useState(0);
  const total = listing.images.length;
  const specs: { label: string; icon: SketchIconName }[] = [
    { label: listing.area, icon: "area" },
    { label: listing.rooms, icon: "rooms" },
    { label: listing.baths, icon: "baths" },
    { label: listing.parking, icon: "parking" },
    { label: listing.elevator, icon: "elevator" },
    { label: listing.pets, icon: "pets" },
  ];

  const showPrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPhoto((current) => (current - 1 + total) % total);
  };

  const showNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPhoto((current) => (current + 1) % total);
  };

  return (
    <article
      id={id}
      className={["listing-card", className].filter(Boolean).join(" ")}
      onMouseEnter={onHover}
    >
      <div className="listing-image">
        <img
          src={listing.images[photo]}
          alt={`Presentación Litving: ${listing.zone}, ${listing.city}${total > 1 ? `, foto ${photo + 1} de ${total}` : ""}`}
        />
        <em className="listing-badge listing-badge--op">
          {listing.operation === "Renta" ? "Arriendo" : "Venta"}
        </em>
        {total > 1 && (
          <>
            <div className="listing-gallery-nav" aria-label="Galería del anuncio">
              <button type="button" onClick={showPrev} aria-label="Foto anterior">
                ‹
              </button>
              <button type="button" onClick={showNext} aria-label="Foto siguiente">
                ›
              </button>
            </div>
            <small className="listing-photo-count">
              {photo + 1}/{total}
            </small>
          </>
        )}
      </div>
      <div className="listing-body">
        <header className="listing-head">
          <div className="listing-meta-top">
            <span className="listing-code" title="Código de inmueble">
              <em>Código</em>
              <strong>{listing.code}</strong>
            </span>
          </div>
          <div className="listing-location">
            <span className="listing-pin" aria-hidden="true">
              <SketchIcon name="pin" />
            </span>
            <b>{listing.zone}</b>
            <i aria-hidden="true">·</i>
            <span>{listing.city}</span>
            <i aria-hidden="true">·</i>
            <span>
              {listing.kind} · {listing.floor}
            </span>
          </div>
          <div className="listing-price-block">
            {listing.adminFee ? (
              <>
                <p className="listing-price">
                  <strong>{listing.price}</strong>
                  {listing.priceSuffix ? <span>{listing.priceSuffix}</span> : null}
                </p>
                <p className="listing-admin-fee">
                  <strong>{listing.adminFee}</strong> Administración aprox.
                </p>
              </>
            ) : (
              <>
                <p className="listing-price">
                  <strong>{listing.price}</strong>
                  {listing.priceSuffix ? <span>{listing.priceSuffix}</span> : null}
                </p>
                {listing.priceNote ? (
                  <p className="listing-price-sub">{listing.priceNote}</p>
                ) : (
                  <p className="listing-price-sub listing-price-sub--spacer" aria-hidden="true">
                    &nbsp;
                  </p>
                )}
              </>
            )}
          </div>
        </header>

        <ul className="listing-specs" aria-label={`${listing.kind} · características`}>
          {specs.map((spec) => {
            const muted = /^(Sin|No|Consultar)/i.test(spec.label);
            return (
              <li key={spec.icon} className={muted ? "is-muted" : undefined}>
                <span className="listing-spec-icon">
                  <SketchIcon name={spec.icon} />
                </span>
                <em>{spec.label}</em>
              </li>
            );
          })}
        </ul>

        <div className="listing-card-footer">
          <button className="listing-cta" type="button" onClick={() => onOpen(listing)}>
            <SketchIcon name="calendar" />
            <span>Ver publicación</span>
            <span className="listing-cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

type PortalNav =
  | "Inicio"
  | "Propiedades"
  | "Contratos"
  | "Pagos"
  | "Mantenimientos"
  | "Solicitudes"
  | "Documentos";

const portalNavItems: PortalNav[] = [
  "Inicio",
  "Propiedades",
  "Contratos",
  "Pagos",
  "Mantenimientos",
  "Solicitudes",
  "Documentos",
];

const portalProperties = [
  {
    id: "rosales",
    label: "Apartamento 506 · Rosales",
    status: "Al día",
    nextPay: "05 Jun. 2026",
    openCases: "2",
    openNote: "Ambas dentro del plazo",
  },
  {
    id: "chico",
    label: "Apartamento 801 · Chicó",
    status: "Al día",
    nextPay: "12 Jun. 2026",
    openCases: "1",
    openNote: "Visita programada",
  },
  {
    id: "salitre",
    label: "Apartamento 205 · Salitre",
    status: "En revisión",
    nextPay: "01 Jul. 2026",
    openCases: "3",
    openNote: "Una requiere respuesta",
  },
] as const;

const portalActivityByNav: Record<PortalNav, readonly [string, string, string, string][]> = {
  Inicio: [
    ["20 Abr", "Pago recibido", "Canon de arrendamiento", "Completado"],
    ["22 Abr", "Mantenimiento", "Revisión del ascensor", "En curso"],
    ["15 Abr", "Solicitud", "Ajuste de cerradura", "Respondida"],
    ["10 Abr", "Documento", "Contrato actualizado", "Disponible"],
  ],
  Propiedades: [
    ["08 Abr", "Inspección", "Estado general del inmueble", "Programada"],
    ["02 Abr", "Inventario", "Entrega actualizada", "Disponible"],
    ["28 Mar", "Foto", "Galería renovada", "Completado"],
  ],
  Contratos: [
    ["10 Abr", "Contrato", "Versión vigente cargada", "Disponible"],
    ["01 Mar", "Anexo", "Cláusula de mascotas", "Firmado"],
    ["12 Feb", "Renovación", "Propuesta enviada", "En curso"],
  ],
  Pagos: [
    ["20 Abr", "Pago recibido", "Canon abril", "Completado"],
    ["20 Mar", "Pago recibido", "Canon marzo", "Completado"],
    ["05 Jun", "Próximo cobro", "Canon junio", "Programado"],
  ],
  Mantenimientos: [
    ["22 Abr", "Ascensor", "Revisión técnica", "En curso"],
    ["11 Abr", "Plomería", "Cambio de grifería", "Completado"],
    ["03 Abr", "Pintura", "Retoque de terraza", "Cotizado"],
  ],
  Solicitudes: [
    ["15 Abr", "Cerradura", "Ajuste solicitado", "Respondida"],
    ["09 Abr", "Ruido", "Reporte a administración", "En curso"],
    ["01 Abr", "Parqueadero", "Asignación temporal", "Cerrada"],
  ],
  Documentos: [
    ["10 Abr", "Contrato", "PDF actualizado", "Disponible"],
    ["02 Abr", "Póliza", "Cobertura vigente", "Disponible"],
    ["20 Mar", "Recibo", "Pago de marzo", "Disponible"],
  ],
};

export function PortalPreview() {
  const [activeNav, setActiveNav] = useState<PortalNav>("Inicio");
  const [propertyId, setPropertyId] = useState<(typeof portalProperties)[number]["id"]>("rosales");
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [reportReady, setReportReady] = useState(false);
  const propertyWrapRef = useRef<HTMLDivElement | null>(null);

  const property = portalProperties.find((item) => item.id === propertyId) ?? portalProperties[0];
  const activity = portalActivityByNav[activeNav];
  const sectionTitle =
    activeNav === "Inicio" ? "Resumen de tu propiedad" : `Vista de ${activeNav.toLowerCase()}`;

  useEffect(() => {
    if (!propertyOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!propertyWrapRef.current?.contains(event.target as Node)) {
        setPropertyOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPropertyOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [propertyOpen]);

  return (
    <div className="portal-window" aria-label="Vista previa del portal Litving">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <strong>LITVING</strong>
          <small>Portal de gestión</small>
        </div>
        <nav className="portal-nav" aria-label="Menú del portal">
          {portalNavItems.map((item) => (
            <button
              key={item}
              type="button"
              className={item === activeNav ? "active" : undefined}
              aria-current={item === activeNav ? "page" : undefined}
              onClick={() => {
                setActiveNav(item);
                setSelectedActivity(null);
                setReportReady(false);
              }}
            >
              <i aria-hidden="true" />
              {item}
            </button>
          ))}
        </nav>
        <div className="portal-sidebar-art" aria-hidden="true">
          <img src="/media/listing-facade-rosales-v2.png" alt="" />
        </div>
        <div className="portal-advisor">
          <span>LM</span>
          <p>
            <b>Laura M.</b>
            <small>Tu asesora</small>
          </p>
        </div>
      </aside>

      <div className="portal-content">
        <header>
          <div>
            <b>Hola, Carolina</b>
            <small>{sectionTitle}</small>
          </div>
          <div className="portal-head-actions">
            <div
              className={`portal-property-wrap${propertyOpen ? " is-open" : ""}`}
              ref={propertyWrapRef}
            >
              <button
                type="button"
                className="portal-property"
                aria-expanded={propertyOpen}
                aria-haspopup="listbox"
                onClick={() => setPropertyOpen((open) => !open)}
              >
                {property.label}
                <span aria-hidden="true">⌄</span>
              </button>
              {propertyOpen ? (
                <ul className="portal-property-menu" role="listbox" aria-label="Seleccionar propiedad">
                  {portalProperties.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={item.id === propertyId}
                        className={item.id === propertyId ? "is-selected" : undefined}
                        onClick={() => {
                          setPropertyId(item.id);
                          setPropertyOpen(false);
                          setSelectedActivity(null);
                          setReportReady(false);
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <span className={`online${property.status === "Al día" ? "" : " is-warn"}`}>
              {property.status}
            </span>
          </div>
        </header>

        {activeNav === "Inicio" ? (
          <div className="portal-metrics">
            <button type="button" className="portal-metric-card" onClick={() => setActiveNav("Pagos")}>
              <small>Estado de cartera</small>
              <strong>
                <i aria-hidden="true" /> {property.status}
              </strong>
              <em>Pagos al corriente</em>
            </button>
            <button type="button" className="portal-metric-card" onClick={() => setActiveNav("Pagos")}>
              <small>Próximo pago</small>
              <strong>{property.nextPay}</strong>
              <em>Canon de arrendamiento</em>
            </button>
            <button
              type="button"
              className="portal-metric-card"
              onClick={() => setActiveNav("Solicitudes")}
            >
              <small>Gestiones abiertas</small>
              <strong>{property.openCases}</strong>
              <em>{property.openNote}</em>
            </button>
          </div>
        ) : (
          <div className="portal-panel">
            <p className="portal-panel-lead">
              Estás en <b>{activeNav}</b> de <b>{property.label}</b>. Elige un registro para ver estado, tiempos y trazabilidad.
            </p>
          </div>
        )}

        <div className="portal-activity">
          <div className="activity-head">
            <b>{activeNav === "Inicio" ? "Actividad reciente" : activeNav}</b>
            <small>Seguimiento en tiempo real</small>
          </div>
          {activity.map((row) => {
            const key = row[0] + row[1];
            const selected = selectedActivity === key;
            return (
              <button
                type="button"
                className={`activity-row${selected ? " is-selected" : ""}`}
                key={key}
                onClick={() => setSelectedActivity(selected ? null : key)}
              >
                <time>{row[0]}</time>
                <i aria-hidden="true" />
                <span>
                  <b>{row[1]}</b>
                  <small>{selected ? `Detalle: ${row[2]} · estado ${row[3].toLowerCase()}.` : row[2]}</small>
                </span>
                <em>{row[3]}</em>
              </button>
            );
          })}
        </div>

        <div className="portal-sketch-strip" aria-hidden="true">
          <img src="/media/process-management-sketch-v5-paper.png" alt="" />
        </div>

        <footer className="portal-footer">
          <span>
            <i aria-hidden="true" /> Información actualizada hoy, 09:40
          </span>
          <button
            type="button"
            className={`portal-report${reportReady ? " is-ready" : ""}`}
            onClick={() => setReportReady(true)}
          >
            {reportReady ? "Vista previa del reporte · demo" : "Ver reporte mensual (demo)"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export function ContactModal({
  sent,
  onClose,
  onSubmit,
}: {
  sent: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <p className="eyebrow">LITVING · BOGOTÁ</p>
        <h2 id="contact-title">Hablemos de tu propiedad.</h2>
        <p>
          Cuéntanos zona, tipo de inmueble y si está vacío u ocupado. Te respondemos con un
          siguiente paso concreto.
        </p>
        {sent ? (
          <div className="success-message" role="status" aria-live="polite">
            <b>Abrimos tu correo.</b>
            <span>También puedes escribirnos a hola@litving.com.</span>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label>
              Nombre
              <input name="name" autoComplete="name" required autoFocus />
            </label>
            <label>
              Correo o teléfono
              <input name="contact" type="text" inputMode="email" autoComplete="email" required />
            </label>
            <label>
              Quiero
              <select name="need" defaultValue="administrar">
                <option value="administrar">Proteger y administrar mi renta</option>
                <option value="publicar">Publicar mi propiedad</option>
                <option value="arrendar">Buscar una propiedad</option>
                <option value="portal">Conocer el portal</option>
              </select>
            </label>
            <button type="submit">Quiero que me contacten</button>
          </form>
        )}
      </section>
    </div>
  );
}
