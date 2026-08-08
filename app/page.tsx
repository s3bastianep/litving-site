"use client";

import { FormEvent, useState } from "react";

type Target = "inicio" | "propiedades" | "portal" | "personas" | "equipo";

export default function Home() {
  const [portalOpen, setPortalOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const goTo = (target: Target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="prototype-shell">
      <div className="page-canvas" aria-label="Página de inicio de Litving">
        <img
          className="approved-page"
          src="/litving-approved-page.png"
          alt="Diseño completo de Litving: administración inmobiliaria clara, tecnológica y humana"
        />

        <span id="inicio" className="scroll-anchor anchor-home" />
        <span id="propiedades" className="scroll-anchor anchor-properties" />
        <span id="portal" className="scroll-anchor anchor-portal" />
        <span id="personas" className="scroll-anchor anchor-people" />
        <span id="equipo" className="scroll-anchor anchor-team" />

        <button className="hotspot nav-properties" onClick={() => goTo("propiedades")} aria-label="Ir a propiedades" />
        <button className="hotspot nav-admin" onClick={() => goTo("portal")} aria-label="Ir a administración" />
        <button className="hotspot nav-services" onClick={() => goTo("personas")} aria-label="Ir a servicios" />
        <button className="hotspot nav-us" onClick={() => goTo("equipo")} aria-label="Ir a nosotros" />
        <button className="hotspot nav-resources" onClick={() => goTo("equipo")} aria-label="Ir a recursos" />
        <button className="hotspot portal-button" onClick={() => setPortalOpen(true)} aria-label="Abrir portal Litving" />

        <button className="hotspot hero-properties" onClick={() => goTo("propiedades")} aria-label="Ver propiedades" />
        <button className="hotspot hero-trust" onClick={() => goTo("equipo")} aria-label="Confiar mi propiedad a Litving" />
        <button className="hotspot all-properties" onClick={() => goTo("propiedades")} aria-label="Ver todas las propiedades" />

        <button className="hotspot card-one" onClick={() => goTo("equipo")} aria-label="Ver ejemplo de anuncio Rosales" />
        <button className="hotspot card-two" onClick={() => goTo("equipo")} aria-label="Ver ejemplo de anuncio Chicó Reservado" />
        <button className="hotspot card-three" onClick={() => goTo("equipo")} aria-label="Ver ejemplo de anuncio La Cabrera" />
        <button className="hotspot portal-preview" onClick={() => setPortalOpen(true)} aria-label="Conocer el portal de propietarios" />
        <button className="hotspot team-button" onClick={() => setPortalOpen(true)} aria-label="Conocer el equipo Litving" />
      </div>

      <section className="sr-only" aria-label="Contenido de Litving">
        <h1>Tu propiedad, bien administrada.</h1>
        <p>Una gestión clara de principio a fin.</p>
        <p>Procesos claros, tecnología que organiza y personas que responden.</p>
        <h2>Por qué Litving</h2>
        <ul>
          <li>Propiedades verificadas: documentos, datos y estado revisados antes de publicar.</li>
          <li>Presentación profesional: fotografía, video y tour 360°.</li>
          <li>Gestión transparente: pagos, contratos y mantenimientos con trazabilidad.</li>
          <li>Acompañamiento humano: una persona responsable te acompaña.</li>
        </ul>
        <h2>Propiedades elegidas con criterio</h2>
        <p>Ejemplos visuales de cómo se presentarán los anuncios. No corresponden a inventario activo.</p>
        <h2>Tu propiedad, siempre visible</h2>
        <p>Información centralizada, seguimiento en tiempo real, documentos disponibles y solicitudes sin llamadas.</p>
        <h2>Para propietarios y para inquilinos</h2>
        <p>Transparencia, protección, proceso simple, atención ágil y experiencia clara.</p>
        <h2>Así cuidamos tu propiedad</h2>
        <p>Conocemos, preparamos, gestionamos y respondemos.</p>
        <h2>La tecnología organiza. Nuestro equipo responde.</h2>
      </section>

      {portalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPortalOpen(false)}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="portal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setPortalOpen(false)} aria-label="Cerrar">×</button>
            <p className="modal-kicker">LITVING</p>
            <h2 id="portal-title">Hablemos de tu propiedad.</h2>
            <p>Déjanos tus datos y una persona del equipo te contactará para conocer lo que necesitas.</p>
            {sent ? (
              <div className="success-message">Gracias. Tu solicitud quedó registrada.</div>
            ) : (
              <form onSubmit={submitContact}>
                <label>
                  Nombre
                  <input name="name" required autoFocus />
                </label>
                <label>
                  Correo o teléfono
                  <input name="contact" required />
                </label>
                <label>
                  ¿Qué necesitas?
                  <select name="need" defaultValue="administrar">
                    <option value="administrar">Administrar mi propiedad</option>
                    <option value="arrendar">Arrendar una propiedad</option>
                    <option value="comprar">Comprar una propiedad</option>
                    <option value="portal">Conocer el portal</option>
                  </select>
                </label>
                <button type="submit">Quiero que me contacten →</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
