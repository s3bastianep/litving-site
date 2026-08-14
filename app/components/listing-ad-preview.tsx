"use client";

import { MouseEvent, useEffect, useState } from "react";
import { SketchIcon, type ListingExample } from "./site-kit";

const visitDays = [
  { key: "Jue", day: 13 },
  { key: "Vie", day: 14 },
  { key: "Sáb", day: 15 },
  { key: "Dom", day: 16 },
  { key: "Lun", day: 17 },
  { key: "Mar", day: 18 },
  { key: "Mié", day: 19 },
];

function nearbyFor(zone: string) {
  return [
    {
      group: "Centros comerciales",
      items: [
        { name: `C.C. cerca a ${zone}`, walk: "12 min", car: "4 min" },
        { name: "Centro Andino", walk: "28 min", car: "10 min" },
      ],
    },
    {
      group: "Supermercados",
      items: [
        { name: "Éxito", walk: "8 min", car: "3 min" },
        { name: "Carulla", walk: "11 min", car: "4 min" },
      ],
    },
    {
      group: "Parques y transporte",
      items: [
        { name: `Parque ${zone}`, walk: "7 min", car: "3 min" },
        { name: "Estación TransMilenio", walk: "10 min", car: "4 min" },
      ],
    },
  ];
}

export function ListingAdPreview({
  listing,
  onClose,
  onContact,
}: {
  listing: ListingExample;
  onClose: () => void;
  onContact: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [photo, setPhoto] = useState(0);
  const [visitDay, setVisitDay] = useState(13);
  const [visitTime, setVisitTime] = useState<string | null>("10:00");
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
      value: listing.floor.replace("Piso ", "") || "—",
      label: "Piso",
      icon: "elevator" as const,
    },
    {
      value: listing.parking.replace(/ parqueaderos?/, ""),
      label: "Parqueaderos",
      icon: "parking" as const,
    },
    {
      value: /^(Sin|No|Consultar)/i.test(listing.pets) ? "No" : "Sí",
      label: "Mascotas",
      icon: "pets" as const,
    },
  ];

  const details: [string, string][] = [
    ["Código", listing.code],
    ["Tipo", listing.kind],
    ["Barrio", listing.zone],
    ["Ciudad", listing.city],
    ["Piso", listing.floor],
    ["Área", listing.area],
    ["Habitaciones", listing.rooms],
    ["Baños", listing.baths],
    ["Parqueaderos", listing.parking],
    ["Ascensor", listing.elevator],
    ["Mascotas", listing.pets],
    ["Precio por m²", priceM2Label],
    ["Estado", "Disponible"],
    [
      "Estrato",
      listing.zone.includes("Cedritos") || listing.zone.includes("Salitre") ? "4" : "5",
    ],
  ];

  const amenities = [
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
            <p className="float-topbar-title">
              {listing.kind} · {listing.zone}
            </p>
          </div>
          <div className="float-topbar-actions">
            <button type="button" className="float-icon-btn" aria-label="Compartir">
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
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="float-summary">
            <div className="float-summary-top">
              <span className="float-code">
                <em>Código</em>
                <strong>{listing.code}</strong>
              </span>
              <span className="float-available">Disponible</span>
            </div>
            <h2 id="float-title">
              {listing.kind} en {listing.zone}
            </h2>
            <p className="float-location">
              <span className="float-pin" aria-hidden="true">
                <SketchIcon name="pin" />
              </span>
              <span>
                <b>{listing.zone}</b>
                {" · "}
                {listing.city}
                {" · "}
                {listing.kind} · {listing.floor}
              </span>
            </p>
            <div className="float-price-row">
              <div>
                <p className="float-price-label">
                  {listing.operation === "Renta" ? "Precio de arriendo" : "Precio de venta"}
                </p>
                <p className="float-price">
                  {listing.price}
                  {listing.priceSuffix ? <span> {listing.priceSuffix}</span> : null}
                </p>
                {listing.adminFee ? (
                  <p className="float-block-lead" style={{ marginTop: 6 }}>
                    {listing.adminFee} Administración aprox.
                  </p>
                ) : null}
                {listing.priceNote ? (
                  <p className="float-block-lead" style={{ marginTop: 6 }}>
                    {listing.priceNote}
                  </p>
                ) : null}
              </div>
              <p className="float-price-m2">
                <strong>{priceM2Label}</strong>
                <span>por m²</span>
              </p>
            </div>
          </section>

          <section className="float-stats" aria-label="Características principales">
            {stats.map(stat => (
              <div key={stat.label}>
                <span className="float-stat-icon" aria-hidden="true">
                  <SketchIcon name={stat.icon} />
                </span>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </section>

          <section className="float-block">
            <h3>Descripción</h3>
            <p>
              Fotografía profesional, recorrido 360° e información clara para posicionar el
              inmueble frente al perfil adecuado. {listing.kind} en {listing.zone} con{" "}
              {listing.area}, {listing.rooms} y {listing.baths}.
            </p>
          </section>

          <section className="float-block">
            <h3>Detalles del inmueble</h3>
            <dl className="float-details">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="float-block">
            <h3>Características del conjunto</h3>
            <ul className="float-amenities">
              {amenities.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="float-block">
            <h3>Horario de visitas</h3>
            <p className="float-block-lead">
              Elige un día y una franja para agendar con un asesor.
            </p>
            <div className="float-days" role="list">
              {visitDays.map(day => (
                <button
                  key={day.day}
                  type="button"
                  role="listitem"
                  className={visitDay === day.day ? "is-on" : undefined}
                  onClick={() => setVisitDay(day.day)}
                >
                  <span>{day.key}</span>
                  <strong>{day.day}</strong>
                </button>
              ))}
            </div>
            <div className="float-times">
              {["10:00", "12:00", "16:00", "18:00"].map(time => (
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
          </section>

          <section className="float-block float-nearby">
            <h3>Lugares cercanos</h3>
            <p className="float-block-lead">
              Referencias útiles alrededor de {listing.zone}.
            </p>
            <div className="float-nearby-list">
              {nearbyFor(listing.zone).map(group => (
                <div key={group.group} className="float-nearby-group">
                  <h4>
                    <span className="float-nearby-mark" aria-hidden="true" />
                    {group.group}
                  </h4>
                  <ul>
                    {group.items.map(item => (
                      <li key={item.name}>
                        <strong>{item.name}</strong>
                        <div className="float-nearby-meta">
                          <span>
                            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
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
                            {item.walk} a pie
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
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
                            {item.car} en carro
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="float-footer">
          <button
            type="button"
            className="float-cta float-cta--primary"
            onClick={event => {
              onClose();
              onContact(event);
            }}
          >
            <SketchIcon name="calendar" />
            <span>Agendar visita</span>
          </button>
          <button
            type="button"
            className="float-cta float-cta--secondary"
            onClick={event => {
              onClose();
              onContact(event);
            }}
          >
            <span>{listing.operation === "Venta" ? "Ofertar" : "Hablar con un asesor"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
