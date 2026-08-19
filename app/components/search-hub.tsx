"use client";

import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { MobileAppNav } from "./mobile-app-nav";

function RentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        d="M5 10.5 12 4l7 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5H10.5V21H6a1 1 0 0 1-1-1v-9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        d="M12 3 4 8.5V20h16V8.5L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.5 21v-6h5v6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchHub() {
  return (
    <div className="search-page search-hub-page has-mobile-nav">
      <header className="search-header search-hub-header">
        <div className="search-header-inner">
          <Link className="brand" href="/" aria-label="Litving, inicio">
            <BrandLogo />
          </Link>
        </div>
      </header>

      <main className="search-hub">
        <div className="search-hub-copy">
          <p className="eyebrow">BUSCAR</p>
          <h1>¿Qué buscas?</h1>
          <p>Elige si quieres arrendar o comprar para ver inmuebles en Bogotá.</p>
        </div>

        <div className="search-hub-choices" role="list">
          <Link href="/arrendar" className="search-hub-choice" role="listitem">
            <span className="search-hub-choice-icon search-hub-choice-icon--rent" aria-hidden="true">
              <RentIcon />
            </span>
            <span className="search-hub-choice-body">
              <strong>Renta</strong>
              <em>Apartamentos y casas en arriendo</em>
            </span>
            <span className="search-hub-choice-arrow" aria-hidden="true">
              →
            </span>
          </Link>

          <Link href="/comprar" className="search-hub-choice" role="listitem">
            <span className="search-hub-choice-icon search-hub-choice-icon--buy" aria-hidden="true">
              <BuyIcon />
            </span>
            <span className="search-hub-choice-body">
              <strong>Compra</strong>
              <em>Propiedades en venta verificadas</em>
            </span>
            <span className="search-hub-choice-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </main>

      <MobileAppNav active="search" />
    </div>
  );
}
