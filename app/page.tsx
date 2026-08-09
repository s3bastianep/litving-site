"use client";

import { FormEvent, useEffect, useState } from "react";

const valueItems = [
  { number: "01", icon: "verify", title: "Arriendo con respaldo", copy: "Estudio del inquilino y póliza de aseguradora para proteger el canon según la cobertura contratada." },
  { number: "02", icon: "camera", title: "Menos tiempo desocupado", copy: "Precio competitivo, presentación profesional y publicación enfocada en conseguir mejores prospectos." },
  { number: "03", icon: "portal", title: "Control sin perseguir a nadie", copy: "Cartera, contratos, solicitudes y mantenimientos visibles desde un solo lugar." },
  { number: "04", icon: "people", title: "Un responsable de principio a fin", copy: "Un asesor conoce tu inmueble, coordina el proceso y responde por cada novedad." },
];

const listingExamples = [
  { image: "/media/el-virrey.png", facade: "/media/listing-facade-rosales-v2.png", zone: "Rosales", city: "Bogotá", operation: "Arriendo", kind: "Apartamento", price: "$8.900.000 / mes", tag: "Verificado", badge: "360°", proof: "12 fotos HD" },
  { image: "/media/san-simon.png", facade: "/media/listing-facade-chico-reservado-v2.png", zone: "Chicó Reservado", city: "Bogotá", operation: "Venta", kind: "Casa", price: "$3.950.000.000", tag: "Verificado", badge: "360°", proof: "Tour 360° listo" },
  { image: "/media/terraza-hd.png", facade: "/media/listing-facade-la-cabrera-v2.png", zone: "La Cabrera", city: "Bogotá", operation: "Arriendo", kind: "Apartamento", price: "$12.500.000 / mes", tag: "Verificado", badge: "360°", proof: "Ficha verificada" },
];

const ownerBenefits = [
  ["Canon con respaldo", "Seguro de arrendamiento sujeto a las condiciones de la aseguradora."],
  ["Menos vacancia", "Precio sustentado y una publicación preparada para competir mejor."],
  ["Propiedad cuidada", "Mantenimientos con responsable, estado e historial verificable."],
];

const tenantBenefits = [
  ["Inmuebles reales", "Información y estado revisados antes de publicar; cero avisos señuelo."],
  ["Proceso sin vueltas", "Requisitos claros, documentos digitales y respuestas oportunas."],
  ["Soporte que continúa", "Las solicitudes no se pierden: quedan registradas y asignadas."],
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

const benefitAssets: Record<string, { src: string; alt: string }> = {
  verify: { src: "/media/benefit-verified-sketch.png", alt: "Edificio, documento y lupa ilustrados a lápiz" },
  camera: { src: "/media/benefit-presentation-sketch.png", alt: "Cámara profesional, trípode y plano arquitectónico ilustrados a lápiz" },
  portal: { src: "/media/benefit-management-sketch.png", alt: "Portal digital de gestión inmobiliaria ilustrado a lápiz" },
  people: { src: "/media/benefit-human-sketch.png", alt: "Asesora inmobiliaria acompañando a un cliente" },
};

function BenefitIllustration({ type }: { type: string }) {
  const asset = benefitAssets[type] ?? benefitAssets.verify;
  return <img className={`benefit-illustration benefit-illustration--${type}`} src={asset.src} alt={asset.alt} />;
}

function ListingFacade({ src, zone, proof }: { src: string; zone: string; proof: string }) {
  return (
    <figure className="listing-facade">
      <img src={src} alt={`Boceto de la fachada del anuncio de muestra en ${zone}`} />
      <figcaption><i />{proof}</figcaption>
    </figure>
  );
}

const processAssets: Record<string, { src: string; alt: string }> = {
  valuation: { src: "/media/process-valuation-v2.png", alt: "Valoración comercial de un inmueble" },
  positioning: { src: "/media/process-positioning-v2.png", alt: "Preparación editorial del anuncio inmobiliario" },
  contract: { src: "/media/process-contract-v2.png", alt: "Contrato de arrendamiento protegido por aseguradora" },
  management: { src: "/media/process-management-v2.png", alt: "Gestión de mantenimiento y seguimiento del inmueble" },
};

function ProcessIllustration({ type }: { type: string }) {
  const asset = processAssets[type] ?? processAssets.valuation;
  return <img className="process-illustration" src={asset.src} alt={asset.alt} />;
}

function ArchitecturalBlueprint() {
  return (
    <div className="blueprint" aria-label="Ilustración arquitectónica de una casa moderna">
      <img
        className="blueprint-art"
        src="/media/hero-architectural-illustration-v4.png"
        alt="Casa moderna ilustrada con trazo arquitectónico y paisajismo detallado"
      />
      <span className="blueprint-status status--verified"><i /> Publicación verificada</span>
      <span className="blueprint-status status--updated"><i /> Asesor asignado <small>En línea</small></span>
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
          <a href="#presentacion" onClick={closeMenu}>Así publicamos</a>
          <a href="#portal" onClick={closeMenu}>Administración</a>
          <a href="#beneficios" onClick={closeMenu}>Por qué Litving</a>
          <a href="#personas" onClick={closeMenu}>Para quién</a>
          <a href="#proceso" onClick={closeMenu}>Cómo trabajamos</a>
          <button className="nav-contact" onClick={() => { setContactOpen(true); closeMenu(); }}>Hablar con un asesor <Arrow /></button>
        </nav>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <section className="hero section-shell" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">INMOBILIARIA DIGITAL · BOGOTÁ</p>
          <h1>Tu propiedad,<br />bien administrada.</h1>
          <p className="hero-lead">La inmobiliaria que protege tu ingreso y te devuelve el control.</p>
          <p className="hero-support">Conseguimos el inquilino, gestionamos el contrato y operamos pagos y mantenimientos con respaldo de aseguradora, tecnología y un equipo responsable.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => setContactOpen(true)}>Quiero arrendar mi propiedad <Arrow /></button>
            <a className="button button-secondary" href="#beneficios">Ver por qué Litving</a>
          </div>
        </div>
        <div className="hero-visual">
          <ArchitecturalBlueprint />
        </div>
      </section>

      <section className="value section-shell" id="beneficios">
        <p className="value-label">LO QUE CAMBIA CUANDO ADMINISTRAMOS TU PROPIEDAD</p>
        <div className="value-grid">
          {valueItems.map(item => (
            <article className="value-card" key={item.number}>
              <span className="value-number">{item.number}</span>
              <BenefitIllustration type={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
        <svg className="value-key" viewBox="0 0 100 74" aria-hidden="true">
          <circle cx="27" cy="25" r="14" />
          <circle cx="27" cy="25" r="5" />
          <path d="m38 35 36 36 9-9-7-7 7-7-9-9-7 7-20-20" />
        </svg>
      </section>

      <section className="presentation" id="presentacion">
        <div className="section-shell">
          <div className="catalog-heading">
            <div><h2>Así hacemos que tu propiedad compita mejor.</h2><p>Fotografía HD, recorrido 360° y ficha verificada. Estos son ejemplos de presentación, no inventario activo.</p></div>
            <a href="#portal">Conocer la gestión <Arrow /></a>
          </div>
          <div className="listing-grid">
            {listingExamples.map(item => (
              <article className="listing-card" key={item.zone}>
                <div className="listing-image"><img src={item.image} alt={`Ejemplo de fotografía inmobiliaria profesional en ${item.zone}`} /><span><i /> {item.tag}</span><b>{item.badge}</b></div>
                <div className="listing-body">
                  <div className="listing-copy"><small>{item.city}</small><h3>{item.zone}</h3><p>{item.operation} · {item.kind}</p><strong>{item.price}</strong></div>
                  <ListingFacade src={item.facade} zone={item.zone} proof={item.proof} />
                </div>
                <small className="listing-disclaimer">ANUNCIO DE MUESTRA · FICHA ACTUALIZADA</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-section section-shell" id="portal">
        <div className="portal-copy">
          <span className="section-number">03</span>
          <h2>Control sin perseguir respuestas.</h2>
          <p>Consulta el estado real de tu inmueble y de cada gestión. Lo importante deja de vivir en llamadas, chats y archivos dispersos.</p>
          <div className="micro-benefits">
            <span><LineIcon type="file" /> Canon y cartera</span>
            <span><LineIcon type="track" /> Mantenimientos con estado</span>
            <span><LineIcon type="document" /> Contratos y documentos</span>
            <span><LineIcon type="message" /> Responsable y trazabilidad</span>
          </div>
          <button className="text-link" onClick={() => setContactOpen(true)}>Ver cómo funciona <Arrow /></button>
        </div>
        <PortalPreview />
      </section>

      <section className="audiences" id="personas">
        <div className="section-shell">
          <div className="audience-grid">
            <article className="audience-card owner-card">
              <div className="audience-sketch"><img src="/media/audience-diptych-v2.png" alt="Propietario consultando la gestión de su inmueble" /></div>
              <div className="audience-content"><p className="eyebrow">SI ERES PROPIETARIO</p><h3>Protegemos el ingreso.<br />Cuidamos el inmueble.</h3>{ownerBenefits.map(([title, copy]) => <div className="benefit-row" key={title}><span>✓</span><p><b>{title}</b>{copy}</p></div>)}</div>
            </article>
            <article className="audience-card tenant-card">
              <div className="audience-content"><p className="eyebrow">SI BUSCAS UN HOGAR</p><h3>Inmuebles reales.<br />Un proceso que responde.</h3>{tenantBenefits.map(([title, copy]) => <div className="benefit-row" key={title}><span>✓</span><p><b>{title}</b>{copy}</p></div>)}</div>
              <div className="audience-sketch"><img src="/media/audience-diptych-v2.png" alt="Inquilina revisando su información en el portal" /></div>
            </article>
          </div>
        </div>
      </section>

      <section className="process section-shell" id="proceso">
        <div className="process-heading"><span className="section-number">06</span><h2>Del precio correcto al mantenimiento resuelto.</h2></div>
        <div className="process-grid">
          {[
            ['01', 'Valoramos', 'Definimos un canon competitivo y verificamos el estado inicial.', 'valuation', 'DIAGNÓSTICO'],
            ['02', 'Posicionamos', 'Creamos el anuncio, producimos el material y activamos los canales.', 'positioning', 'PUBLICACIÓN'],
            ['03', 'Arrendamos', 'Estudiamos al prospecto, coordinamos la póliza y firmamos digitalmente.', 'contract', 'CONTRATO'],
            ['04', 'Administramos', 'Supervisamos cartera, novedades y mantenimientos hasta resolverlos.', 'management', 'OPERACIÓN'],
          ].map(([n, title, copy, icon, status], index) => <article key={n}><span>{n}</span><ProcessIllustration type={icon} /><small><i />{status}</small><h3>{title}</h3><p>{copy}</p>{index < 3 && <Arrow />}</article>)}
        </div>
      </section>

      <section className="human-section section-shell">
        <div className="human-image"><img src="/media/asesora-litving-hd.png" alt="Asesora Litving acompañando personalmente a un cliente" /></div>
        <div className="human-copy"><span className="section-number">07</span><h2>La plataforma no reemplaza el servicio. Lo hace visible.</h2><p>Tu asesor se encarga de la operación; tú puedes verla completa y saber quién responde.</p><button className="button button-primary" onClick={() => setContactOpen(true)}>Hablar con un asesor <Arrow /></button></div>
      </section>

      <footer className="site-footer section-shell"><a className="brand" href="#inicio">LITVING</a><p>Bogotá · Colombia</p><button onClick={() => setContactOpen(true)}>Contacto</button><a href="#beneficios">Privacidad</a><small>© 2026 LITVING</small></footer>

      {contactOpen && (
        <div className="modal-backdrop" onMouseDown={() => setContactOpen(false)}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title" onMouseDown={event => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setContactOpen(false)} aria-label="Cerrar">×</button>
            <p className="eyebrow">LITVING · BOGOTÁ</p>
            <h2 id="contact-title">Hablemos de tu propiedad.</h2>
            <p>Cuéntanos sobre tu inmueble. Revisaremos su situación, el canon esperado y la mejor estrategia para arrendarlo y administrarlo.</p>
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
