"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ListingAdPreview } from "./components/listing-ad-preview";
import { BrandLogo } from "./components/brand-logo";
import { ContactModal } from "./components/contact-modal";
import { MobileAppNav } from "./components/mobile-app-nav";
import { PortalDashboard } from "./components/portal-dashboard";
import { type ContactLead, type ContactNeed } from "./lib/contact";
import { resolveHomeListingId, searchRouteForListingId } from "./lib/listing-deep-link";

const valueItems = [
  { number: "01", icon: "verify", title: "Arriendo protegido", copy: "Evaluamos al arrendatario y gestionamos el respaldo necesario para proteger tu ingreso." },
  { number: "02", icon: "camera", title: "Arriendo o venta que destaca", copy: "Valoramos, fotografiamos y presentamos tu propiedad para atraer al perfil correcto." },
  { number: "03", icon: "portal", title: "Gestión virtual con trazabilidad", copy: "Pagos, contratos y solicitudes con historial en plataforma. Tu asesor activa el acceso." },
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
    title: "Hacemos que se mueva",
    copy: "Revisamos zona y mercado contigo para fijar un canon que se arriende más rápido y proteja el valor.",
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
      "/media/listing-chico-living-hd.jpg",
      "/media/listing-chico-kitchen-hd.jpg",
      "/media/listing-chico-bedroom-hd.jpg",
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
    adminFee: "$ 1.250.000",
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
      "/media/listing-salitre-terrace-a-hd.jpg",
      "/media/listing-salitre-living-hd.jpg",
      "/media/listing-salitre-terrace-b-hd.jpg",
    ],
  },
];

type SketchIconName = "area" | "rooms" | "baths" | "parking" | "elevator" | "pets" | "pin" | "check" | "calendar";

const listingSpecIconAssets: Partial<Record<SketchIconName, string>> = {
  area: "/media/listing-icon-area-glyph.png?v=5",
  rooms: "/media/listing-icon-rooms-glyph.png?v=5",
  baths: "/media/listing-icon-baths-glyph.png?v=5",
  parking: "/media/listing-icon-parking-glyph.png?v=5",
  elevator: "/media/listing-icon-elevator-glyph.png?v=5",
  pets: "/media/listing-icon-pets-glyph.png?v=5",
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
          loading="lazy"
          decoding="async"
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
            <span
              className={`listing-op ${listing.operation === "Venta" ? "is-sale" : "is-rent"}`}
            >
              {listing.operation === "Venta" ? "Venta" : "Arriendo"}
            </span>
            <span className="listing-code" title="Código de inmueble">
              <em>Cód.</em>
              <strong>{listing.code}</strong>
            </span>
          </div>
          <div className="listing-price-block">
            <p className="listing-price">
              <strong>{listing.price}</strong>
              {listing.priceSuffix ? <span>{listing.priceSuffix}</span> : null}
            </p>
            {listing.adminFee ? (
              <p className="listing-price-meta">
                <span>Administración</span>
                <strong>{listing.adminFee}</strong>
              </p>
            ) : listing.priceNote ? (
              <p className="listing-price-meta">
                <span>{listing.priceNote}</span>
              </p>
            ) : (
              <p className="listing-price-meta is-empty" aria-hidden="true">
                <span>Administración</span>
                <strong>—</strong>
              </p>
            )}
          </div>
          <div className="listing-location">
            <p className="listing-zone">
              <span className="listing-pin" aria-hidden="true">
                <SketchIcon name="pin" />
              </span>
              <span className="listing-locality">
                <b>{listing.zone}</b>
                <span className="listing-city">{listing.city}</span>
              </span>
            </p>
            <p className="listing-facts">
              <span>{listing.kind}</span>
              <span>{listing.floor}</span>
            </p>
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
  ["Opciones de calidad", "Inmuebles presentados con datos verificados y fotografías profesionales."],
  ["Proceso con trazabilidad", "Ves avances, plazos y próximos pasos en cada etapa de la compra."],
  ["Cierre ordenado", "Acompañamiento de alto nivel y seguimiento continuo hasta la escritura."],
];

const benefitAssets: Record<string, { src: string; alt: string }> = {
  verify: { src: "/media/benefit-verified-sketch-nobg.png?v=11", alt: "Protección: propiedad, documento y respaldo ilustrados a lápiz" },
  camera: { src: "/media/benefit-presentation-sketch-nobg.png?v=11", alt: "Ocupación: cámara, plano y propiedad listos para destacar" },
  portal: { src: "/media/benefit-management-sketch-nobg.png?v=11", alt: "Plataforma virtual: pagos, contratos y trazabilidad de gestiones" },
  people: { src: "/media/benefit-human-sketch-nobg.png?v=11", alt: "Seguimiento continuo: asesor y propietario con respuestas a tiempo" },
};

function BenefitIllustration({ type }: { type: string }) {
  const asset = benefitAssets[type] ?? benefitAssets.verify;
  return <img className={`benefit-illustration benefit-illustration--${type}`} src={asset.src} alt={asset.alt} loading="lazy" decoding="async" />;
}

const processAssets: Record<string, { src: string; alt: string }> = {
  valuation: {
    src: "/media/process-zone-price-sketch-v9-nobg.png?v=11",
    alt: "Inmueble y comparación de precio de zona, ilustrados a lápiz",
  },
  positioning: {
    src: "/media/process-positioning-sketch-v5-nobg.png?v=11",
    alt: "Cámara, interior y publicación ilustrados a lápiz",
  },
  contract: {
    src: "/media/process-lease-calm-sketch-v6-nobg.png?v=11",
    alt: "Entrega calmada de llaves y cierre de arriendo, ilustrados a lápiz",
  },
  management: {
    src: "/media/process-management-sketch-nobg.png?v=12",
    alt: "Portal de gestión y mantenimiento ilustrados a lápiz",
  },
};

function ProcessIllustration({ type }: { type: string }) {
  const asset = processAssets[type] ?? processAssets.valuation;
  return <img className="process-illustration" src={asset.src} alt={asset.alt} loading="lazy" decoding="async" />;
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
        src="/media/hero-architectural-paper-match-v5.png?v=9"
        alt="Casa moderna ilustrada con trazo arquitectónico y paisajismo detallado"
        fetchPriority="high"
        decoding="async"
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactLead, setContactLead] = useState<ContactLead>({ need: "administrar" });
  const [activeListing, setActiveListing] = useState<ListingExample | null>(null);
  const contactTrigger = useRef<HTMLButtonElement | null>(null);
  const listingTrigger = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const closeContact = () => {
    setContactOpen(false);
    window.requestAnimationFrame(() => contactTrigger.current?.focus());
  };

  const openLead = (lead: ContactLead) => {
    setContactLead(lead);
    setContactOpen(true);
    setMenuOpen(false);
    setSearchOpen(false);
    setPublishOpen(false);
  };

  const openContactFromEvent = (
    event: MouseEvent<HTMLButtonElement>,
    lead: ContactLead | ContactNeed = "administrar",
  ) => {
    contactTrigger.current = event.currentTarget;
    openLead(typeof lead === "string" ? { need: lead } : lead);
  };

  const openContact = (lead: ContactLead | ContactNeed = "administrar") => {
    openLead(typeof lead === "string" ? { need: lead } : lead);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("inmueble");
    if (listingId) {
      const homeId = resolveHomeListingId(listingId);
      if (homeId) {
        const found = listingExamples.find(item => item.id === homeId);
        if (found) setActiveListing(found);
      } else {
        const searchRoute = searchRouteForListingId(listingId);
        if (searchRoute) {
          window.location.replace(`${searchRoute}?inmueble=${encodeURIComponent(listingId)}`);
          return;
        }
      }
    }
    if (!params.has("contact")) return;
    const need = params.get("need") || params.get("contact");
    const allowed: ContactNeed[] = [
      "administrar",
      "arriendo",
      "venta",
      "arrendar",
      "visita",
      "oferta",
      "asesor",
      "portal",
    ];
    openLead({
      need: allowed.includes(need as ContactNeed) ? (need as ContactNeed) : "arriendo",
    });
  }, []);

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
    if (!menuOpen && !searchOpen && !publishOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setPublishOpen(false);
        setMenuOpen(false);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
        setPublishOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen, searchOpen, publishOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setPublishOpen(false);
  };

  return (
    <main className="has-mobile-nav">
      <a className="skip-link" href="#inicio">Saltar al contenido</a>
      <header className="site-header" ref={headerRef}>
        <div className="header-left">
          <a className="brand" href="#inicio" aria-label="Litving, inicio">
            <BrandLogo />
          </a>
          <nav
            id="main-navigation"
            className={menuOpen ? "main-nav open" : "main-nav"}
            aria-label="Navegación principal"
          >
            <div className={`nav-dropdown${searchOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                aria-expanded={searchOpen}
                aria-haspopup="true"
                onClick={() => {
                  setPublishOpen(false);
                  setSearchOpen(open => !open);
                }}
              >
                Buscar propiedades
                <span className="nav-dropdown-caret" aria-hidden="true" />
              </button>
              <div className="nav-dropdown-menu" hidden={!searchOpen} role="menu">
                <Link href="/arrendar" role="menuitem" onClick={closeMenu}>
                  Propiedad para arrendar
                </Link>
                <Link href="/comprar" role="menuitem" onClick={closeMenu}>
                  Propiedad para comprar
                </Link>
              </div>
            </div>
            <div className={`nav-dropdown${publishOpen ? " is-open" : ""}`}>
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                aria-expanded={publishOpen}
                aria-haspopup="true"
                onClick={() => {
                  setSearchOpen(false);
                  setPublishOpen(open => !open);
                }}
              >
                Publicar inmueble
                <span className="nav-dropdown-caret" aria-hidden="true" />
              </button>
              <div className="nav-dropdown-menu" hidden={!publishOpen} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={event => openContactFromEvent(event, "venta")}
                >
                  Venta
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={event => openContactFromEvent(event, "arriendo")}
                >
                  Arriendo
                </button>
              </div>
            </div>
            <Link href="/admin" className="nav-login nav-login--mobile">
              Iniciar sesión
            </Link>
          </nav>
        </div>
        <Link href="/admin" className="nav-login nav-login--desktop">
          Iniciar sesión
        </Link>
        <button
          className="menu-toggle"
          aria-controls="main-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i />
          <i />
        </button>
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
              <Link className="button button-primary" href="/arrendar">
                Ver propiedades
              </Link>
              <Link className="button button-secondary" href="/comprar">
                Comprar
              </Link>
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
                Fotografía profesional y una estrategia comercial para arriendo o venta, con el
                perfil correcto.
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
          <div className="portal-copy-top">
            <span className="section-number">03</span>
            <p className="eyebrow">VISTA PREVIA DEL PORTAL</p>
          </div>
          <h2>Así se ve el seguimiento de tu propiedad.</h2>
          <p>
            Esta es una demostración de pagos, contratos y solicitudes. Entra al portal para ver
            el panel con el estado de tu propiedad.
          </p>
          <div className="micro-benefits">
            <span><b>01</b><em>Trazabilidad</em><small>Historial y estado de cada gestión.</small></span>
            <span><b>02</b><em>Tiempos cortos</em><small>Avances y respuestas visibles.</small></span>
            <span><b>03</b><em>Seguimiento continuo</em><small>El caso no se pierde en el camino.</small></span>
            <span><b>04</b><em>Todo en un lugar</em><small>Pagos, documentos y solicitudes.</small></span>
          </div>
        </div>
        <PortalDashboard />
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
                  src="/media/audience-owner-framed-v2-fuchsia.png?v=19"
                  alt="Propietaria y asesora revisando la gestión del inmueble juntas"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="audience-content">
                <p className="eyebrow">SI ERES PROPIETARIO</p>
                <h3>
                  <span className="audience-line">Arrienda o vende con</span>
                  <span className="audience-line">acompañamiento.</span>
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
                  src="/media/audience-tenant-framed-v2-fuchsia.png?v=19"
                  alt="Asesor e inquilina en un hogar verificado, con proceso claro"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="audience-content">
                <p className="eyebrow">SI QUIERES ARRENDAR</p>
                <h3>
                  <span className="audience-line">Encuentra tu hogar con</span>
                  <span className="audience-line">proceso claro.</span>
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
                  src="/media/audience-buyer-framed-v2-fuchsia.png?v=19"
                  alt="Compradores y asesora revisando planos y criterios de compra con respaldo"
                  loading="lazy"
                  decoding="async"
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
              <div className="process-visual">
                <ProcessIllustration type={step.icon} />
              </div>
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
          <div className="human-image-backdrop" aria-hidden="true" />
          <div className="human-image-frame">
            <img
              src="/media/asesora-plataforma-crop.png?v=2"
              alt="Asesora Litving revisando la plataforma con una clienta en un inmueble"
              loading="lazy"
              decoding="async"
            />
            <span className="human-image-tag">
              <i aria-hidden="true">✓</i>
              Asesoría humana + plataforma
            </span>
          </div>
        </div>
        <div className="human-copy">
          <div className="human-copy-top">
            <span className="section-number">06</span>
            <p className="eyebrow">SEGUIMIENTO CONTINUO</p>
          </div>
          <h2>
            Plataforma que avanza. Personas que responden.
          </h2>
          <p>
            Ves avances, tiempos y respuestas en un solo lugar. Un asesor
            conoce tu inmueble y da seguimiento continuo.
          </p>
          <button className="button button-primary" onClick={event => openContactFromEvent(event)}>
            Hablar con un asesor
          </button>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div className="footer-brand">
          <a className="brand" href="#inicio" aria-label="Litving, inicio">
            <BrandLogo />
          </a>
          <p>Bogotá · Colombia</p>
        </div>
        <div className="footer-actions">
          <a href="mailto:hola@litving.com">hola@litving.com</a>
          <button type="button" onClick={event => openContactFromEvent(event)}>
            Contacto
          </button>
          <small>© 2026 LITVING</small>
        </div>
      </footer>

      {activeListing && (
        <ListingAdPreview
          listing={activeListing}
          onClose={closeListing}
          onLead={lead => {
            closeListing();
            openLead(lead);
          }}
        />
      )}

      {contactOpen ? (
        <ContactModal
          key={`${contactLead.need}-${contactLead.listing?.id ?? "home"}`}
          lead={contactLead}
          onClose={closeContact}
        />
      ) : null}

      <MobileAppNav active="home" onContact={() => openContact()} />
    </main>
  );
}
