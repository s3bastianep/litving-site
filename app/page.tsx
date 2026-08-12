"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

const valueItems = [
  { number: "01", icon: "verify", title: "Arriendo protegido", copy: "Evaluamos al arrendatario y gestionamos el respaldo necesario para proteger tu ingreso." },
  { number: "02", icon: "camera", title: "Arriendo o venta que destaca", copy: "Valoramos, fotografiamos y presentamos tu propiedad para atraer al perfil correcto." },
  { number: "03", icon: "portal", title: "Gestión virtual con trazabilidad", copy: "Pagos, contratos, solicitudes y mantenimientos en una plataforma: ves el estado, los tiempos y el historial de cada avance." },
  { number: "04", icon: "people", title: "Seguimiento continuo", copy: "Respuestas en tiempos cortos y un asesor que conoce tu caso, para que el proceso no se detenga." },
];

const journeyItems = [
  ["01", "Tu tranquilidad", "#beneficios"],
  ["02", "Tu propiedad destaca", "#presentacion"],
  ["03", "Gestión virtual", "#portal"],
  ["04", "Hecho para ti", "#personas"],
  ["05", "Te acompañamos", "#proceso"],
  ["06", "Seguimiento continuo", "#equipo"],
];

const processSteps = [
  {
    number: "01",
    title: "Definimos el precio",
    copy: "Revisamos zona y mercado contigo para fijar un canon que se mueva y proteja el valor.",
    icon: "valuation",
  },
  {
    number: "02",
    title: "Preparamos y publicamos",
    copy: "Producimos el material, armamos el anuncio y lo activamos en los canales correctos.",
    icon: "positioning",
  },
  {
    number: "03",
    title: "Seleccionamos y cerramos",
    copy: "Filtramos candidatos, gestionamos el respaldo y dejamos la entrega lista.",
    icon: "contract",
  },
  {
    number: "04",
    title: "Operamos el día a día",
    copy: "En la plataforma ves pagos, novedades y mantenimientos, con trazabilidad y seguimiento continuo.",
    icon: "management",
  },
] as const;

type ListingExample = {
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

const listingExamples: ListingExample[] = [
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

type SketchIconName = "area" | "rooms" | "baths" | "parking" | "elevator" | "pets" | "pin" | "check" | "calendar";

const listingSpecIconAssets: Partial<Record<SketchIconName, string>> = {
  area: "/media/listing-icon-area-glyph.png",
  rooms: "/media/listing-icon-rooms-glyph.png",
  baths: "/media/listing-icon-baths-glyph.png",
  parking: "/media/listing-icon-parking-glyph.png",
  elevator: "/media/listing-icon-elevator-glyph.png",
  pets: "/media/listing-icon-pets-glyph.png",
};

function SketchIcon({ name }: { name: SketchIconName }) {
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
function InteractiveListingCard({
  listing,
  onOpen,
}: {
  listing: ListingExample;
  onOpen: (listing: ListingExample) => void;
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
    <article className="listing-card">
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

function ListingAdPreview({
  listing,
  onClose,
  onContact,
}: {
  listing: ListingExample;
  onClose: () => void;
  onContact: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [photo, setPhoto] = useState(0);
  const total = listing.images.length;
  const dialogRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") setPhoto((current) => (current - 1 + total) % total);
      if (event.key === "ArrowRight") setPhoto((current) => (current + 1) % total);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea"),
      ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, total]);

  return (
    <div className="modal-backdrop listing-preview-backdrop" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="listing-preview"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-preview-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="listing-preview-media">
          <img
            src={listing.images[photo]}
            alt={`${listing.zone}, ${listing.city}, foto ${photo + 1} de ${total}`}
          />
          <div className="listing-preview-badges">
            <span>
              <SketchIcon name="check" /> Verificado
            </span>
            <b>{listing.operation}</b>
          </div>
          {total > 1 && (
            <div className="listing-preview-thumbs" role="group" aria-label="Fotos del anuncio">
              {listing.images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === photo ? "is-active" : undefined}
                  onClick={() => setPhoto(index)}
                  aria-pressed={index === photo}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="listing-preview-copy">
          <p className="eyebrow">ASÍ SE VE UNA PUBLICACIÓN LITVING</p>
          <h2 id="listing-preview-title">
            {listing.zone} · {listing.city}
          </h2>
          <p className="listing-preview-meta">
            Código {listing.code} · {listing.operation === "Renta" ? "Arriendo" : "Venta"} · {listing.kind} · {listing.floor}
          </p>
          <strong>
            {listing.price}
            {listing.priceSuffix ? ` ${listing.priceSuffix}` : ""}
          </strong>
          {listing.adminFee ? (
            <p className="listing-preview-meta">
              {listing.adminFee} Administración aprox.
            </p>
          ) : null}
          {listing.priceNote ? (
            <p className="listing-preview-meta">{listing.priceNote}</p>
          ) : null}
          <ul>
            <li>{listing.area}</li>
            <li>{listing.rooms}</li>
            <li>{listing.baths}</li>
            <li>{listing.parking}</li>
            <li>{listing.elevator}</li>
            <li>{listing.pets}</li>
          </ul>
          <p>
            Fotografía profesional, recorrido 360° e información clara para posicionar el inmueble frente al perfil adecuado.
          </p>
          <div className="listing-preview-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={(event) => {
                onClose();
                onContact(event);
              }}
            >
              Quiero agendar una visita
            </button>
            <button className="button button-secondary" type="button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const ownerBenefits = [
  ["Arriendo con respaldo", "Evaluamos al arrendatario y protegemos tu ingreso según las condiciones contratadas."],
  ["Venta con estrategia", "Precio, presentación de alta calidad y acompañamiento para cerrar con el comprador correcto."],
  ["Plataforma con seguimiento", "Gestión virtual, trazabilidad de cada avance y respuestas en tiempos cortos."],
];

const tenantBenefits = [
  ["Propiedades verificadas", "Información clara y condiciones transparentes antes de visitar."],
  ["Proceso en plataforma", "Documentos digitales, estado visible y seguimiento continuo de tu solicitud."],
  ["Respuestas a tiempo", "Un asesor te orienta y te mantiene al día hasta la entrega de llaves."],
];

const buyerBenefits = [
  ["Opciones de calidad", "Inmuebles presentados con datos verificados y recorrido completo."],
  ["Proceso con trazabilidad", "Ves avances, plazos y próximos pasos en cada etapa de la compra."],
  ["Cierre ordenado", "Acompañamiento de alto nivel y seguimiento continuo hasta la escritura."],
];

const benefitAssets: Record<string, { src: string; alt: string }> = {
  verify: { src: "/media/benefit-verified-sketch-paper.png", alt: "Protección: propiedad, documento y respaldo ilustrados a lápiz" },
  camera: { src: "/media/benefit-presentation-sketch-paper.png", alt: "Ocupación: cámara, plano y propiedad listos para destacar" },
  portal: { src: "/media/benefit-management-sketch-paper.png", alt: "Plataforma virtual: pagos, contratos y trazabilidad de gestiones" },
  people: { src: "/media/benefit-human-sketch-paper.png", alt: "Seguimiento continuo: asesor y propietario con respuestas a tiempo" },
};

function BenefitIllustration({ type }: { type: string }) {
  const asset = benefitAssets[type] ?? benefitAssets.verify;
  return <img className={`benefit-illustration benefit-illustration--${type}`} src={asset.src} alt={asset.alt} />;
}

const processAssets: Record<string, { src: string; alt: string }> = {
  valuation: {
    src: "/media/process-zone-price-sketch-v9-paper.png",
    alt: "Inmueble y comparación de precio de zona, ilustrados a lápiz",
  },
  positioning: {
    src: "/media/process-positioning-sketch-v5-paper.png",
    alt: "Cámara, interior y publicación ilustrados a lápiz",
  },
  contract: {
    src: "/media/process-lease-calm-sketch-v6-paper.png",
    alt: "Entrega calmada de llaves y cierre de arriendo, ilustrados a lápiz",
  },
  management: {
    src: "/media/process-management-sketch-v5-paper.png",
    alt: "Portal de gestión y mantenimiento ilustrados a lápiz",
  },
};

function ProcessIllustration({ type }: { type: string }) {
  const asset = processAssets[type] ?? processAssets.valuation;
  return <img className="process-illustration" src={asset.src} alt={asset.alt} />;
}

const blueprintSignals = [
  { label: "Pago recibido", className: "tag--payment" },
  { label: "Arrendatario verificado", className: "tag--tenant" },
  { label: "Asesor asignado", className: "tag--advisor" },
] as const;

function ArchitecturalBlueprint() {
  return (
    <div className="blueprint" aria-label="Ilustración arquitectónica de una casa moderna">
      <img
        className="blueprint-art"
        src="/media/hero-architectural-illustration-v4-transparent.png"
        alt="Casa moderna ilustrada con trazo arquitectónico y paisajismo detallado"
      />
      <ul className="blueprint-tags" aria-label="Señales de gestión Litving">
        {blueprintSignals.map((signal) => (
          <li key={signal.label} className={`blueprint-tag ${signal.className}`}>
            <span aria-hidden="true">✓</span>
            {signal.label}
          </li>
        ))}
      </ul>
    </div>
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

function PortalPreview() {
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactNeed, setContactNeed] = useState("administrar");
  const [activeListing, setActiveListing] = useState<ListingExample | null>(null);
  const [sent, setSent] = useState(false);
  const contactTrigger = useRef<HTMLButtonElement | null>(null);
  const listingTrigger = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const closeContact = () => {
    setContactOpen(false);
    window.requestAnimationFrame(() => contactTrigger.current?.focus());
  };

  const openContact = (event: MouseEvent<HTMLButtonElement>, need = "administrar") => {
    contactTrigger.current = event.currentTarget;
    setSent(false);
    setContactNeed(need);
    setContactOpen(true);
    setMenuOpen(false);
  };

  const openListing = (listing: ListingExample) => {
    listingTrigger.current = document.activeElement as HTMLElement | null;
    setActiveListing(listing);
  };

  const closeListing = () => {
    setActiveListing(null);
    window.requestAnimationFrame(() => listingTrigger.current?.focus());
  };

  useEffect(() => {
    document.body.style.overflow = contactOpen || activeListing || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen, activeListing, menuOpen]);

  useEffect(() => {
    if (!contactOpen) return;
    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContact();
        return;
      }
      if (event.key !== "Tab") return;
      const modal = document.querySelector<HTMLElement>(".contact-modal");
      const focusable = Array.from(modal?.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]") ?? [])
        .filter(element => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => document.removeEventListener("keydown", handleDialogKeys);
  }, [contactOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const need = String(data.get("need") ?? "administrar");
    const subject = encodeURIComponent(`Litving · ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nContacto: ${contact}\nInterés: ${need}\n\nEnviado desde litving.com`,
    );
    window.location.href = `mailto:hola@litving.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <a className="skip-link" href="#inicio">Saltar al contenido</a>
      <header className="site-header" ref={headerRef}>
        <a className="brand" href="#inicio" aria-label="Litving, inicio">LITVING</a>
        <nav id="main-navigation" className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
          <a href="#presentacion" onClick={closeMenu}>Buscar para compra</a>
          <a href="#presentacion" onClick={closeMenu}>Buscar para arriendo</a>
          <button type="button" className="nav-link" onClick={event => openContact(event, "arriendo")}>Publicar para arriendo</button>
          <button type="button" className="nav-link" onClick={event => openContact(event, "venta")}>Publicar para venta</button>
          <a href="#beneficios" onClick={closeMenu}>Conoce Litving</a>
          <button className="nav-contact" onClick={openContact}>Valorar mi propiedad</button>
        </nav>
        <button className="menu-toggle" aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>
      {menuOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Cerrar menú"
          onClick={closeMenu}
        />
      ) : null}

      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <div className="hero-copy-top">
            <p className="eyebrow">LITVING · GESTIÓN INMOBILIARIA · BOGOTÁ</p>
            <h1>
              <span className="hero-line">Más que administrar</span>
              <span className="hero-line">una&nbsp;propiedad.</span>
            </h1>
            <p className="hero-lead">
              Arrendamos y vendemos.
              <br />
              Cuidamos tu patrimonio.
            </p>
          </div>
          <div className="hero-copy-bottom">
            <p className="hero-support">
              Gestión virtual con trazabilidad, respuestas en tiempos cortos y seguimiento continuo: simple, segura y de alto nivel.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={openContact}>
                Publicar inmueble
              </button>
              <a className="button button-secondary" href="#beneficios">
                Conocer LITVING
              </a>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <ArchitecturalBlueprint />
        </div>
      </section>

      <nav className="journey-map" aria-label="Recorrido para conocer Litving">
        <p>TUS BENEFICIOS</p>
        <div>
          {journeyItems.map(([number, label, href]) => <a href={href} key={number}><b>{number}</b><span>{label}</span></a>)}
        </div>
      </nav>

      <section className="value section-shell" id="beneficios">
        <header className="value-header">
          <div className="value-heading-top">
            <span className="section-number">01</span>
            <p className="eyebrow">LO QUE TE DAMOS</p>
          </div>
          <h2>
            <span className="value-line">Simple.&nbsp;Segura.</span>
            <span className="value-line">Con&nbsp;control.</span>
          </h2>
          <p className="guided-lead">
            Creemos que propietarios, arrendatarios y compradores merecen una experiencia
            inmobiliaria simple, segura y de alta calidad: gestión virtual con trazabilidad,
            respuestas en tiempos cortos y seguimiento continuo.
          </p>
        </header>
        <div className="value-grid">
          {valueItems.map(item => (
            <article className="value-card" key={item.number}>
              <span className="value-number">{item.number}</span>
              <div className="value-visual">
                <BenefitIllustration type={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="presentation" id="presentacion">
        <div className="section-shell">
          <div className="catalog-heading">
            <div>
              <div className="catalog-heading-top">
                <span className="section-number">02</span>
                <p className="eyebrow">TU PROPIEDAD DESTACA</p>
              </div>
              <h2>
                <span className="catalog-line">El valor de tu&nbsp;propiedad</span>
                <span className="catalog-line">se presenta así.</span>
              </h2>
              <p>
                Fotografía profesional, recorrido completo y una estrategia comercial para arriendo
                o venta, con el perfil correcto.
              </p>
              <p className="catalog-note">Ejemplos de presentación comercial.</p>
            </div>
          </div>
          <div className="listing-grid">
            {listingExamples.map((item) => (
              <InteractiveListingCard
                key={item.id}
                listing={item}
                onOpen={openListing}
              />
            ))}
          </div>
          <ul className="listing-trust-bar" aria-label="Garantías de presentación">
            <li>
              <span className="listing-trust-icon" aria-hidden="true">
                <SketchIcon name="check" />
              </span>
              <div>
                <b>Información verificada</b>
                <em>Datos revisados antes de publicar.</em>
              </div>
            </li>
            <li>
              <span className="listing-trust-icon" aria-hidden="true">
                <SketchIcon name="check" />
              </span>
              <div>
                <b>Visitas coordinadas</b>
                <em>Agenda con respuesta el mismo día.</em>
              </div>
            </li>
            <li>
              <span className="listing-trust-icon" aria-hidden="true">
                <SketchIcon name="check" />
              </span>
              <div>
                <b>Asesoría profesional</b>
                <em>Acompañamiento en cada etapa.</em>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="portal-section section-shell" id="portal">
        <div className="portal-copy">
          <span className="section-number">03</span>
          <p className="eyebrow">PLATAFORMA VIRTUAL</p>
          <h2>Gestión virtual, con trazabilidad y seguimiento continuo.</h2>
          <p>
            Toda la operación vive en una plataforma: pagos, contratos, solicitudes y mantenimientos.
            Ves el estado, los tiempos y el historial de cada avance. Respuestas en plazos cortos
            y seguimiento continuo, para que siempre sepas qué está pasando con tu propiedad.
          </p>
          <div className="micro-benefits">
            <span><b>01</b><em>Trazabilidad</em><small>Historial y estado de cada gestión.</small></span>
            <span><b>02</b><em>Tiempos cortos</em><small>Avances y respuestas visibles.</small></span>
            <span><b>03</b><em>Seguimiento continuo</em><small>El caso no se pierde en el camino.</small></span>
            <span><b>04</b><em>Todo en un lugar</em><small>Pagos, documentos y solicitudes.</small></span>
          </div>
          <a className="button button-secondary portal-cta portal-cta--desktop" href="#personas">Siguiente: hecho para ti</a>
        </div>
        <PortalPreview />
        <a className="button button-secondary portal-cta portal-cta--mobile" href="#personas">Siguiente: hecho para ti</a>
      </section>

      <section className="audiences" id="personas">
        <div className="section-shell">
          <div className="audience-heading">
            <div className="audience-heading-top">
              <span className="section-number">04</span>
              <p className="eyebrow">LO QUE NOS MUEVE</p>
            </div>
            <h2>
              <span className="audience-line">Propietarios, arrendatarios</span>
              <span className="audience-line">y compradores.</span>
            </h2>
            <p className="audience-lead">
              Merecen una experiencia simple, segura y de alta calidad, con plataforma virtual,
              trazabilidad y seguimiento continuo en cada etapa.
            </p>
          </div>
          <div className="audience-grid audience-grid--three">
            <article className="audience-card owner-card">
              <div className="audience-photo">
                <img
                  src="/media/audience-owner-framed-v2-fuchsia.png?v=17"
                  alt="Propietaria y asesora revisando la gestión del inmueble juntas"
                />
              </div>
              <div className="audience-content">
                <p className="eyebrow">SI ERES PROPIETARIO</p>
                <h3>
                  <span className="audience-line">Arrienda o vende</span>
                  <span className="audience-line">con acompañamiento.</span>
                </h3>
                <ul className="audience-points">
                  {ownerBenefits.map(([title, copy]) => (
                    <li key={title}>
                      <span aria-hidden="true">✓</span>
                      <div>
                        <b>{title}</b>
                        <em>{copy}</em>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            <article className="audience-card tenant-card">
              <div className="audience-photo">
                <img
                  src="/media/audience-tenant-framed-v2-fuchsia.png?v=17"
                  alt="Asesor e inquilina en un hogar verificado, con proceso claro"
                />
              </div>
              <div className="audience-content">
                <p className="eyebrow">SI QUIERES ARRENDAR</p>
                <h3>
                  <span className="audience-line">Encuentra tu hogar</span>
                  <span className="audience-line">con proceso claro.</span>
                </h3>
                <ul className="audience-points">
                  {tenantBenefits.map(([title, copy]) => (
                    <li key={title}>
                      <span aria-hidden="true">✓</span>
                      <div>
                        <b>{title}</b>
                        <em>{copy}</em>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            <article className="audience-card buyer-card">
              <div className="audience-photo">
                <img
                  src="/media/audience-buyer-framed-v2-fuchsia.png?v=17"
                  alt="Compradores y asesora revisando planos y criterios de compra con respaldo"
                />
              </div>
              <div className="audience-content">
                <p className="eyebrow">SI QUIERES COMPRAR</p>
                <h3>
                  <span className="audience-line">Compra con criterio</span>
                  <span className="audience-line">y respaldo.</span>
                </h3>
                <ul className="audience-points">
                  {buyerBenefits.map(([title, copy]) => (
                    <li key={title}>
                      <span aria-hidden="true">✓</span>
                      <div>
                        <b>{title}</b>
                        <em>{copy}</em>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="process section-shell" id="proceso">
        <header className="process-heading">
          <div className="process-heading-top">
            <span className="section-number">05</span>
            <p className="eyebrow">TE ACOMPAÑAMOS</p>
          </div>
          <h2>Del primer análisis a la operación continua.</h2>
          <p className="process-lead">
            Cuatro etapas claras: del precio y la publicación hasta la operación diaria en plataforma, con trazabilidad y un responsable en cada paso.
          </p>
        </header>
        <ol className="process-timeline">
          {processSteps.map((step, index) => (
            <li className="process-step" key={step.number}>
              <div className="process-step-index">
                <span>{step.number}</span>
              </div>
              <ProcessIllustration type={step.icon} />
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              {index < processSteps.length - 1 && (
                <span className="process-step-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="human-section section-shell" id="equipo">
        <div className="human-image">
          <img
            src="/media/asesora-confianza-v4.png?v=4"
            alt="Asesora Litving conversando con una clienta sobre el seguimiento de su propiedad"
          />
        </div>
        <div className="human-copy">
          <span className="section-number">06</span>
          <p className="eyebrow">SEGUIMIENTO CONTINUO</p>
          <h2>
            Plataforma que avanza.
            <br />
            Personas que responden.
          </h2>
          <p>
            Pediste apoyo y terminas esperando, preguntándote si alguien realmente
            está al tanto de tu propiedad.
          </p>
          <p>
            En Litving ves avances, tiempos y respuestas en una sola plataforma.
            Un asesor conoce tu inmueble, responde rápido y da seguimiento continuo.
          </p>
          <button className="button button-primary" onClick={openContact}>
            Hablar con un asesor
          </button>
        </div>
      </section>

      <footer className="site-footer section-shell"><a className="brand" href="#inicio">LITVING</a><p>Bogotá · Colombia</p><button onClick={openContact}>Contacto</button><small>© 2026 LITVING</small></footer>

      {activeListing && (
        <ListingAdPreview
          listing={activeListing}
          onClose={closeListing}
          onContact={openContact}
        />
      )}

      {contactOpen && (
        <div className="modal-backdrop" onMouseDown={closeContact}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={event => event.stopPropagation()}>
            <button className="modal-close" onClick={closeContact} aria-label="Cerrar">×</button>
            <p className="eyebrow">LITVING · BOGOTÁ</p>
            <h2 id="contact-title">Hablemos de tu propiedad.</h2>
            <p>Cuéntanos sobre tu inmueble. Revisaremos la zona, el canon esperado y la mejor estrategia para arrendarlo y administrarlo.</p>
            {sent ? <div className="success-message" role="status" aria-live="polite"><b>Abrimos tu correo.</b><span>También puedes escribirnos a hola@litving.com.</span></div> : (
              <form onSubmit={submitContact}>
                <label>Nombre<input name="name" autoComplete="name" required autoFocus /></label>
                <label>
                  Correo o teléfono
                  <input
                    name="contact"
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label>Quiero<select key={contactNeed} name="need" defaultValue={contactNeed}><option value="administrar">Administrar mi propiedad</option><option value="arriendo">Publicar para arriendo</option><option value="venta">Publicar para venta</option><option value="arrendar">Buscar una propiedad</option><option value="portal">Conocer el portal</option></select></label>
                <button type="submit">Quiero que me contacten</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
