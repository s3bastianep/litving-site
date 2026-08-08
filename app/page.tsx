"use client";

import { FormEvent, useEffect, useState } from "react";

const valueItems = [
  { number: "01", icon: "verify", title: "Propiedades verificadas", copy: "Documentos, datos y estado revisados antes de publicar." },
  { number: "02", icon: "camera", title: "Presentación profesional", copy: "Fotografía HD, video y recorrido 360° para decidir mejor." },
  { number: "03", icon: "portal", title: "Gestión transparente", copy: "Pagos, contratos y mantenimientos con trazabilidad." },
  { number: "04", icon: "people", title: "Acompañamiento humano", copy: "Una persona responsable conoce tu caso y te acompaña." },
];

const listingExamples = [
  { image: "/media/el-virrey.png", zone: "El Virrey", kind: "Apartamento", note: "Fotografía profesional", tag: "Verificado" },
  { image: "/media/san-simon.png", zone: "San Simón", kind: "Casa", note: "Recorrido 360°", tag: "Verificado" },
  { image: "/media/terraza-hd.png", zone: "Rosales", kind: "Apartamento", note: "Ficha completa", tag: "Verificado" },
];

const ownerBenefits = [
  ["Transparencia total", "Reportes, cartera y acceso permanente a la información."],
  ["Protegemos tu propiedad", "Validación de inquilinos y seguimiento documentado."],
  ["Ingresos más predecibles", "Seguro de arrendamiento y control mensual de pagos."],
];

const tenantBenefits = [
  ["Proceso simple", "Solicitudes claras, documentos digitales y menos vueltas."],
  ["Atención ágil", "Cada solicitud queda registrada y tiene un responsable."],
  ["Experiencia clara", "Contratos, pagos y mantenimientos en un solo lugar."],
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function LineIcon({ type }: { type: string }) {
  return (
    <span className={`line-icon line-icon--${type}`} aria-hidden="true">
      <i /><b /><em />
    </span>
  );
}

function ArchitecturalBlueprint() {
  return (
    <div className="blueprint" aria-label="Ilustración arquitectónica de una casa moderna">
      <img
        className="blueprint-art"
        src="/media/hero-architectural-illustration-v4.png"
        alt="Casa moderna ilustrada con trazo arquitectónico y paisajismo detallado"
      />
      <span className="blueprint-status status--verified"><i /> Inmueble verificado</span>
      <span className="blueprint-status status--updated"><i /> Ficha actualizada <small>Hoy, 09:40</small></span>
    </div>
  );
}

function PortalPreview() {
  return (
    <div className="portal-window" aria-label="Vista previa del portal Litving">
      <aside className="portal-sidebar">
        <strong>LITVING</strong>
        {['Inicio', 'Propiedades', 'Contratos', 'Pagos', 'Mantenimientos', 'Solicitudes', 'Documentos'].map((item, index) => (
          <span key={item} className={index === 0 ? 'active' : ''}><i />{item}</span>
        ))}
      </aside>
      <div className="portal-content">
        <header><div><b>Hola, Carolina</b><small>Resumen de tu propiedad</small></div><span className="online"><i /> Al día</span></header>
        <div className="portal-metrics">
          <article><small>Estado</small><strong><i /> Al día</strong></article>
          <article><small>Próximo pago</small><strong>05.Jun.2026</strong></article>
          <article><small>Contratos activos</small><strong>2</strong></article>
        </div>
        <div className="portal-activity">
          <div className="activity-head"><b>Actividad reciente</b><small>Seguimiento en tiempo real</small></div>
          {[['20 Abr', 'Pago recibido', 'Completado'], ['22 Abr', 'Mantenimiento', 'En proceso'], ['15 Abr', 'Solicitud', 'Respondida'], ['10 Abr', 'Documento', 'Actualizado']].map(row => (
            <div className="activity-row" key={row[0] + row[1]}><time>{row[0]}</time><i /><span>{row[1]}</span><b>{row[2]}</b></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [contactOpen]);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Litving, inicio">LITVING</a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegación principal">
          <a href="#presentacion" onClick={closeMenu}>Propiedades</a>
          <a href="#portal" onClick={closeMenu}>Administración</a>
          <a href="#beneficios" onClick={closeMenu}>Servicios</a>
          <a href="#personas" onClick={closeMenu}>Nosotros</a>
          <a href="#proceso" onClick={closeMenu}>Recursos</a>
          <button className="nav-contact" onClick={() => { setContactOpen(true); closeMenu(); }}>Portal <Arrow /></button>
        </nav>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">COMPRA · ARRIENDA · ADMINISTRA</p>
          <h1>Tu propiedad,<br />bien administrada.</h1>
          <p className="hero-lead">Una gestión clara de principio a fin.</p>
          <p className="hero-support">Procesos claros, tecnología que organiza y personas que responden.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#presentacion">Ver propiedades <Arrow /></a>
            <button className="button button-secondary" onClick={() => setContactOpen(true)}>Confía tu propiedad</button>
          </div>
        </div>
        <div className="hero-visual">
          <ArchitecturalBlueprint />
        </div>
        <div className="hero-trust" aria-label="Razones para elegir Litving">
          <span><b>Propiedades verificadas</b><small>Documentos y estado revisados</small></span>
          <span><b>Presentación profesional</b><small>Fotografía, video y tour 360°</small></span>
          <span><b>Gestión trazable</b><small>Pagos, contratos y solicitudes</small></span>
          <span><b>Asesor responsable</b><small>Una persona conoce tu caso</small></span>
        </div>
      </section>

      <section className="value section-shell" id="beneficios">
        <div className="section-intro"><p className="eyebrow">POR QUÉ LITVING</p><h2>Todo lo importante,<br />bien resuelto.</h2></div>
        <div className="value-grid">
          {valueItems.map(item => (
            <article className="value-card" key={item.number}>
              <span className="value-number">{item.number}</span>
              <LineIcon type={item.icon} />
              <h3>{item.title}<i /></h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="presentation" id="presentacion">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">PRESENTACIÓN PROFESIONAL</p><h2>Así se verá tu propiedad.</h2></div>
            <p>Ejemplos visuales de nuestros anuncios.<br /><b>No corresponden a inventario activo.</b></p>
          </div>
          <div className="listing-grid">
            {listingExamples.map((item, index) => (
              <article className="listing-card" key={item.zone}>
                <div className="listing-image"><img src={item.image} alt={`Ejemplo de fotografía inmobiliaria profesional en ${item.zone}`} /><span><i /> {item.tag}</span><b>{index === 1 ? 'VIDEO' : 'HD'}</b></div>
                <div className="listing-body"><small>ANUNCIO DE MUESTRA</small><h3>{item.zone}</h3><p>{item.kind} · {item.note}</p><div><span>Ficha verificada</span><button onClick={() => setContactOpen(true)} aria-label={`Quiero presentar mi propiedad como ${item.zone}`}><Arrow /></button></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-section section-shell" id="portal">
        <div className="portal-copy">
          <p className="eyebrow">TU PROPIEDAD, SIEMPRE VISIBLE</p>
          <h2>Todo en un solo lugar.</h2>
          <p>Pagos, contratos, solicitudes y mantenimientos con trazabilidad. Sin depender de llamadas, chats perdidos o respuestas de memoria.</p>
          <div className="micro-benefits">
            <span><LineIcon type="file" /> Información centralizada</span>
            <span><LineIcon type="track" /> Seguimiento en tiempo real</span>
            <span><LineIcon type="document" /> Documentos disponibles</span>
            <span><LineIcon type="message" /> Solicitudes registradas</span>
          </div>
          <button className="text-link" onClick={() => setContactOpen(true)}>Conocer el portal <Arrow /></button>
        </div>
        <PortalPreview />
      </section>

      <section className="audiences" id="personas">
        <div className="section-shell">
          <div className="audience-heading"><p className="eyebrow">UNA MISMA CLARIDAD</p><h2>Para quien confía su propiedad.<br />Para quien la habita.</h2></div>
          <div className="audience-grid">
            <article className="audience-card owner-card">
              <div className="audience-photo"><img src="/media/el-tesoro.png" alt="Interior de una propiedad administrada por Litving" /><span>PROPIETARIOS</span></div>
              <div className="audience-content"><h3>Protección y control,<br />sin perseguir respuestas.</h3>{ownerBenefits.map(([title, copy]) => <div className="benefit-row" key={title}><span>✓</span><p><b>{title}</b>{copy}</p></div>)}</div>
            </article>
            <article className="audience-card tenant-card">
              <div className="audience-content"><h3>Un arriendo claro,<br />desde el primer día.</h3>{tenantBenefits.map(([title, copy]) => <div className="benefit-row" key={title}><span>✓</span><p><b>{title}</b>{copy}</p></div>)}</div>
              <div className="audience-photo"><img src="/media/terraza-hd.png" alt="Terraza de una propiedad presentada por Litving" /><span>INQUILINOS</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="process section-shell" id="proceso">
        <div className="section-heading process-heading"><div><p className="eyebrow">ASÍ CUIDAMOS TU PROPIEDAD</p><h2>Un proceso visible<br />de principio a fin.</h2></div><p>Cada etapa tiene entregables,<br />estado y una persona responsable.</p></div>
        <div className="process-grid">
          {[
            ['01', 'Conocemos', 'Tu propiedad, tus objetivos y la documentación.'],
            ['02', 'Preparamos', 'Fotografía, video, ficha y estrategia de publicación.'],
            ['03', 'Gestionamos', 'Visitas, validación, contratos, pagos y mantenimiento.'],
            ['04', 'Respondemos', 'Seguimiento claro y atención durante toda la relación.'],
          ].map(([n, title, copy], index) => <article key={n}><span>{n}</span><div className={`process-symbol symbol-${index + 1}`}><i /><b /><em /></div><h3>{title}</h3><p>{copy}</p>{index < 3 && <Arrow />}</article>)}
        </div>
      </section>

      <section className="human-section">
        <div className="human-image"><img src="/media/asesora-litving-hd.png" alt="Asesora Litving acompañando personalmente a un cliente" /></div>
        <div className="human-copy"><p className="eyebrow">TECNOLOGÍA + PERSONAS</p><h2>La tecnología organiza.<br />Nuestro equipo responde.</h2><p>Cada propiedad tiene un asesor responsable. Siempre sabrás quién te acompaña y qué está pasando.</p><button className="button button-primary" onClick={() => setContactOpen(true)}>Hablemos de tu propiedad <Arrow /></button></div>
      </section>

      <footer className="site-footer section-shell"><a className="brand" href="#inicio">LITVING</a><p>Bogotá · Colombia</p><button onClick={() => setContactOpen(true)}>Contacto</button><a href="#beneficios">Privacidad</a><small>© 2026 LITVING</small></footer>

      {contactOpen && (
        <div className="modal-backdrop" onMouseDown={() => setContactOpen(false)}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={event => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setContactOpen(false)} aria-label="Cerrar">×</button>
            <p className="eyebrow">LITVING · BOGOTÁ</p>
            <h2 id="contact-title">Hablemos de tu propiedad.</h2>
            <p>Cuéntanos qué necesitas. Una persona del equipo te contactará para conocer tu caso.</p>
            {sent ? <div className="success-message"><b>Solicitud recibida.</b><span>Gracias. Pronto nos pondremos en contacto contigo.</span></div> : (
              <form onSubmit={submitContact}>
                <label>Nombre<input name="name" required autoFocus /></label>
                <label>Correo o teléfono<input name="contact" required /></label>
                <label>Quiero<select name="need" defaultValue="administrar"><option value="administrar">Administrar mi propiedad</option><option value="publicar">Publicar mi propiedad</option><option value="arrendar">Buscar una propiedad</option><option value="portal">Conocer el portal</option></select></label>
                <button type="submit">Quiero que me contacten <Arrow /></button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
