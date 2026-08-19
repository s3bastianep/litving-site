"use client";

import Link from "next/link";

export type MobileNavTab = "home" | "search" | "portal" | "contact";

type MobileAppNavProps = {
  active: MobileNavTab;
  onContact?: () => void;
  searchHref?: string;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.2 16.2 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PortalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-4 3.5V6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MobileAppNav({ active, onContact, searchHref = "/arrendar" }: MobileAppNavProps) {
  return (
    <nav className="mobile-app-nav" aria-label="Navegación móvil">
      <Link href="/" className={active === "home" ? "is-active" : undefined} aria-current={active === "home" ? "page" : undefined}>
        <HomeIcon />
        <span>Inicio</span>
      </Link>
      <Link
        href={searchHref}
        className={active === "search" ? "is-active" : undefined}
        aria-current={active === "search" ? "page" : undefined}
      >
        <SearchIcon />
        <span>Buscar</span>
      </Link>
      <Link
        href="/portal"
        className={active === "portal" ? "is-active" : undefined}
        aria-current={active === "portal" ? "page" : undefined}
      >
        <PortalIcon />
        <span>Portal</span>
      </Link>
      {onContact ? (
        <button type="button" className={active === "contact" ? "is-active" : undefined} onClick={onContact}>
          <ContactIcon />
          <span>Contacto</span>
        </button>
      ) : (
        <a href="mailto:hola@litving.com" className={active === "contact" ? "is-active" : undefined}>
          <ContactIcon />
          <span>Contacto</span>
        </a>
      )}
    </nav>
  );
}

type SearchMobileDockProps = {
  view: "list" | "map" | "split";
  onChange: (view: "list" | "map") => void;
};

export function SearchMobileDock({ view, onChange }: SearchMobileDockProps) {
  const mapActive = view === "map" || view === "split";

  return (
    <div className="search-mobile-dock" role="group" aria-label="Vista de resultados">
      <button type="button" className={view === "list" ? "is-on" : undefined} aria-pressed={view === "list"} onClick={() => onChange("list")}>
        Lista
      </button>
      <button type="button" className={mapActive ? "is-on" : undefined} aria-pressed={mapActive} onClick={() => onChange("map")}>
        Mapa
      </button>
    </div>
  );
}
