"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

export function PortalDashboard({
  variant = "preview",
  userName = "Carolina",
  onLogout,
}: {
  variant?: "preview" | "app";
  userName?: string;
  onLogout?: () => void;
}) {
  const [activeNav, setActiveNav] = useState<PortalNav>("Inicio");
  const [propertyId, setPropertyId] = useState<(typeof portalProperties)[number]["id"]>("rosales");
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const propertyWrapRef = useRef<HTMLDivElement | null>(null);

  const property = portalProperties.find(item => item.id === propertyId) ?? portalProperties[0];
  const activity = portalActivityByNav[activeNav];
  const sectionTitle =
    activeNav === "Inicio" ? "Resumen de tu propiedad" : `Vista de ${activeNav.toLowerCase()}`;
  const greetName = userName.trim().split(" ")[0] || "Carolina";

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
    <div
      className={`portal-window${variant === "app" ? " portal-window--app" : ""}`}
      aria-label={variant === "app" ? "Portal de gestión Litving" : "Vista previa del portal Litving"}
    >
      <aside className="portal-sidebar">
        <div className="portal-brand">
          {variant === "app" ? (
            <Link href="/" className="portal-brand-home">
              <strong>LITVING</strong>
              <small>Portal de gestión</small>
            </Link>
          ) : (
            <>
              <strong>LITVING</strong>
              <small>Portal de gestión</small>
            </>
          )}
        </div>
        <nav className="portal-nav" aria-label="Menú del portal">
          {portalNavItems.map(item => (
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
        {variant === "app" && onLogout ? (
          <button type="button" className="portal-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </aside>

      <div className="portal-content">
        <header>
          <div>
            <b>Hola, {greetName}</b>
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
                onClick={() => setPropertyOpen(open => !open)}
              >
                {property.label}
                <span aria-hidden="true">⌄</span>
              </button>
              {propertyOpen ? (
                <ul className="portal-property-menu" role="listbox" aria-label="Seleccionar propiedad">
                  {portalProperties.map(item => (
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
              Estás en <b>{activeNav}</b> de <b>{property.label}</b>. Elige un registro para ver
              estado, tiempos y trazabilidad.
            </p>
          </div>
        )}

        <div className="portal-activity">
          <div className="activity-head">
            <b>{activeNav === "Inicio" ? "Actividad reciente" : activeNav}</b>
            <small>Seguimiento en tiempo real</small>
          </div>
          {activity.map(row => {
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
                  <small>
                    {selected ? `Detalle: ${row[2]} · estado ${row[3].toLowerCase()}.` : row[2]}
                  </small>
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
        </footer>
      </div>
    </div>
  );
}
