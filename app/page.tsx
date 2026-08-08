"use client";

import { FormEvent, useState } from "react";

const benefits = [
  { number: "01", title: "Propiedades verificadas", text: "Documentos, datos y estado revisados antes de publicar.", kind: "house" },
  { number: "02", title: "Presentación profesional", text: "Fotografía, video y tour 360° para decidir mejor.", kind: "camera" },
  { number: "03", title: "Gestión transparente", text: "Pagos, contratos y mantenimientos con trazabilidad.", kind: "dashboard" },
  { number: "04", title: "Acompañamiento humano", text: "Una persona responsable te acompaña.", kind: "chat" },
];

const processSteps = [
  ["01", "Conocemos", "Entendemos tu inmueble y tus objetivos."],
  ["02", "Preparamos", "Organizamos contenido, documentos y estrategia."],
  ["03", "Gestionamos", "Publicamos, coordinamos y damos seguimiento."],
  ["04", "Respondemos", "Atención humana, rápida y efectiva."],
];

function Drawing({ kind }: { kind: string }) {
  return (
    <div className={`drawing drawing-${kind}`} aria-hidden="true">
      {kind === "house" && <><span className="draw-roof" /><span className="draw-body" /><span className="draw-window" /><span className="draw-check">✓</span></>}
      {kind === "camera" && <><span className="draw-tripod" /><span className="draw-camera" /><span className="draw-lens" /><span className="draw-orbit">360°</span></>}
      {kind === "dashboard" && <><span className="draw-screen" /><span className="draw-row row-one" /><span className="draw-row row-two" /><span className="draw-key">⌁</span><span className="draw-check">✓</span></>}
      {kind === "chat" && <><span className="draw-phone" /><span className="draw-message" /><span className="draw-person" /></>}
      {kind === "tablet" && <><span className="draw-tablet" /><span className="draw-list" /><span className="draw-magnify" /></>}
    </div>
  );
}

function PortalModal({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<"propietario" | "inquilino">("propietario");
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="portal-modal" role="dialog" aria-modal="true" aria-labelledby="portal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Cerrar portal" onClick={onClose}>×</button>
        <p className="eyebrow">PORTAL LITVING</p>
        <h2 id="portal-title">Todo bajo control.</h2>
        <div className="role-switch" role="tablist" aria-label="Tipo de usuario">
          <button type="button" className={role === "propietario" ? "selected" : ""} onClick={() => setRole("propietario")}>Propietario</button>
          <button type="button" className={role === "inquilino" ? "selected" : ""} onClick={() => setRole("inquilino")}>Inquilino</button>
        </div>
        <p>{role === "propietario" ? "Revisa pagos, contratos, mantenimientos y solicitudes de tus propiedades." : "Consulta pagos, documentos y solicitudes con trazabilidad completa."}</p>
        <form onSubmit={(event) => { event.preventDefault(); onClose(); }}>
          <label htmlFor="portal-email">Correo electrónico</label>
          <input id="portal-email" type="email" placeholder="tu@correo.com" required />
          <button className="button button-primary" type="submit">Solicitar acceso</button>
        </form>
      </section>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [demoNotice, setDemoNotice] = useState("");

  const go = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  function handleContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDemoNotice("Gracias. Una persona del equipo Litving te contactará para conocer tu propiedad.");
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Litving, inicio">LITVING</a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal">
          <button type="button" onClick={() => go("#anuncio")}>Propiedades</button>
          <button type="button" onClick={() => go("#portal")}>Administración</button>
          <button type="button" onClick={() => go("#beneficios")}>Servicios</button>
          <button type="button" onClick={() => go("#personas")}>Nosotros</button>
          <button type="button" onClick={() => go("#proceso")}>Recursos</button>
        </nav>
        <button className="button button-outline header-portal" type="button" onClick={() => setPortalOpen(true)}>Portal <span>→</span></button>
        <button className="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><i /><i /></button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">COMPRA · ARRIENDA · ADMINISTRA</p>
          <h1>Tu propiedad,<br />bien administrada.</h1>
          <p className="hero-lead">Una gestión clara de principio a fin.</p>
          <p className="hero-body">Procesos claros, tecnología que organiza y personas que responden.</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => go("#anuncio")}>Ver ejemplo <span>→</span></button>
            <button className="button button-outline" type="button" onClick={() => go("#contacto")}>Confía tu propiedad</button>
          </div>
          <div className="hero-signals" aria-label="Beneficios destacados">
            <span>DOCUMENTOS REVISADOS <b>■</b></span>
            <span>TOUR 360° <b>■</b></span>
            <span>ASESOR ASIGNADO <b>■</b></span>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/media/hero-daylight-hd.png" alt="Casa contemporánea presentada por Litving" />
          <span className="visual-label"><b>VERIFICADO</b><small>Información lista para decidir</small></span>
        </div>
      </section>

      <section className="benefits section" id="beneficios">
        <div className="section-heading"><p className="eyebrow">POR QUÉ LITVING</p><h2>La claridad también es un servicio.</h2></div>
        <div className="benefit-grid">
          {benefits.map((benefit) => <article className="benefit-card" key={benefit.number}><span className="benefit-number">{benefit.number}</span><Drawing kind={benefit.kind} /><h3>{benefit.title}<b>■</b></h3><p>{benefit.text}</p></article>)}
        </div>
      </section>

      <section className="announcement section" id="anuncio">
        <div className="section-heading split-heading"><div><p className="eyebrow">PRESENTACIÓN LITVING</p><h2>Así se verá tu anuncio.</h2></div><p>Una presentación completa, clara y profesional para cada propiedad.</p></div>
        <div className="announcement-card">
          <div className="announcement-media"><span className="sample-label">VISTA PREVIA · ANUNCIO DE EJEMPLO</span><img src="/media/feature-reference-hd.png" alt="Vista previa de una casa de muestra" /><div className="media-rail"><span><img src="/media/apartment-reference-hd.png" alt="Vista previa de fotos" />Fotos</span><span><img src="/media/hero-daylight-hd.png" alt="Vista previa de video" />Video <b>▶</b></span><span><img src="/media/terrace-reference-hd.png" alt="Vista previa de tour 360" />360°</span><span><Drawing kind="house" />Ficha</span></div></div>
          <div className="announcement-info"><span className="sample-badge">MUESTRA</span><h3>Casa de muestra</h3><p>Bogotá · Ficha demostrativa</p><div className="info-list"><span>▣ <b>Ficha completa</b></span><span>▣ <b>Documentos revisados</b></span><span>▣ <b>Fotografía profesional</b></span><span>▣ <b>Video</b></span><span>▣ <b>Tour 360°</b></span><span>▣ <b>Visita coordinada</b></span></div><button className="button button-primary" type="button" onClick={() => setDemoNotice("Esta es una vista previa de cómo presentaremos cada inmueble.")}>Ver ejemplo completo <span>→</span></button></div>
        </div>
        {demoNotice && <p className="notice" role="status">{demoNotice}</p>}
      </section>

      <section className="portal-section section" id="portal">
        <div className="portal-copy"><p className="eyebrow">PORTAL LITVING</p><h2>Tu propiedad,<br />siempre visible.</h2><p>Información y gestión de tu propiedad en un solo lugar.</p><button className="button button-primary" type="button" onClick={() => setPortalOpen(true)}>Conocer el portal <span>→</span></button><div className="portal-highlights"><span><b>▣</b> Información centralizada</span><span><b>↗</b> Seguimiento en tiempo real</span><span><b>▤</b> Documentos siempre disponibles</span><span><b>□</b> Solicitudes sin llamadas</span></div></div>
        <div className="dashboard-mock" aria-label="Vista previa del portal Litving"><aside><b>LITVING</b><span className="active">▣ &nbsp; Inicio</span><span>⌂ &nbsp; Propiedades</span><span>▤ &nbsp; Contratos</span><span>◫ &nbsp; Pagos</span><span>⚒ &nbsp; Mantenimientos</span><span>□ &nbsp; Solicitudes</span><span>▧ &nbsp; Documentos</span><span>◌ &nbsp; Chat</span></aside><div className="dashboard-content"><div className="dashboard-top"><div><small>PROPIETARIO</small><b>Hola, Carolina</b></div><span>Estado <strong>■ Al día</strong></span></div><div className="metric-row"><div><small>Próximo pago</small><b>05.Jun.2020</b><span>Conciliación visible</span></div><div><small>Contratos activos</small><b>2</b><span>Sin acciones pendientes</span></div><div><small>Solicitudes</small><b>1</b><span>En seguimiento</span></div></div><div className="timeline-box"><div><small>SOLICITUD #0184</small><b>Fuga de agua · Cocina</b></div><span className="status">En proceso</span><div className="timeline"><i className="done" /><i className="done" /><i className="current" /><i /></div><div className="timeline-labels"><span>Recibida</span><span>En revisión</span><span>En proceso</span><span>Resuelta</span></div></div></div></div>
      </section>

      <section className="people section" id="personas">
        <div className="people-column"><div className="people-title"><p className="eyebrow">PARA PROPIETARIOS</p><h2>Protegemos tu patrimonio.</h2></div><img src="/media/asesora-litving-hd.png" alt="Propietario revisando información de su inmueble" /><ul><li><b>Transparencia total</b><span>Reportes, cartera y acceso a la información.</span></li><li><b>Protegemos tu patrimonio</b><span>Validamos inquilinos y cuidamos tu propiedad.</span></li><li><b>Rentabilidad sostenible</b><span>Menos vacancia, mejores decisiones.</span></li></ul></div>
        <div className="people-column"><div className="people-title"><p className="eyebrow">PARA INQUILINOS</p><h2>Encuentra con claridad.</h2></div><img src="/media/advisor-reference-hd-v2.png" alt="Asesor Litving acompañando una visita" /><ul><li><b>Proceso simple</b><span>Información clara antes de visitar.</span></li><li><b>Atención ágil</b><span>Respuestas oportunas y efectivas.</span></li><li><b>Experiencia clara</b><span>Todo organizado en un solo lugar.</span></li></ul></div>
      </section>

      <section className="process section" id="proceso"><div className="section-heading"><p className="eyebrow">ASÍ CUIDAMOS CADA PROPIEDAD</p><h2>Un mismo estándar, de principio a fin.</h2></div><div className="process-grid">{processSteps.map(([number, title, text], index) => <article key={number}><span className="process-number">{number}</span><Drawing kind={index === 0 ? "tablet" : index === 1 ? "camera" : index === 2 ? "dashboard" : "chat"} /><h3>{title}</h3><p>{text}</p>{index < processSteps.length - 1 && <b className="process-arrow">→</b>}</article>)}</div></section>

      <section className="human section"><div className="human-photo"><img src="/media/advisor-reference-hd-v2.png" alt="Equipo Litving acompañando a una pareja" /></div><div className="human-copy"><p className="eyebrow">PERSONAS DETRÁS DE CADA PROPIEDAD</p><h2>La tecnología organiza.<br />Nuestro equipo responde.</h2><p>Siempre sabrás quién te acompaña, qué está pasando y cuál es el siguiente paso.</p><button className="button button-outline" type="button" onClick={() => go("#contacto")}>Conoce nuestro equipo <span>→</span></button></div></section>

      <section className="contact section" id="contacto"><div><p className="eyebrow">CONVERSEMOS</p><h2>Hablemos de tu propiedad.</h2><p>Cuéntanos qué necesitas. Te responderá una persona de nuestro equipo.</p></div><form onSubmit={handleContact}><label htmlFor="contact-name">Tu nombre</label><input id="contact-name" placeholder="Nombre y apellido" required /><label htmlFor="contact-email">Tu correo</label><input id="contact-email" type="email" placeholder="tu@correo.com" required /><button className="button button-primary" type="submit">Agendar una conversación <span>→</span></button></form></section>

      <footer className="site-footer"><div><a className="wordmark" href="#inicio">LITVING</a><p>Administración residencial.<br />Tecnología visible, atención humana.</p></div><div><b>NAVEGACIÓN</b><button type="button" onClick={() => go("#beneficios")}>Por qué Litving</button><button type="button" onClick={() => go("#portal")}>Portal</button><button type="button" onClick={() => go("#proceso")}>Cómo funciona</button></div><div><b>CONTACTO</b><span>hola@litving.co</span><span>Bogotá, Colombia</span></div><small>© 2026 LITVING · Todos los derechos reservados.</small></footer>

      {portalOpen && <PortalModal onClose={() => setPortalOpen(false)} />}
    </main>
  );
}
