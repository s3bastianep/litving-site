"use client";

import { FormEvent, useEffect, useState } from "react";

const propertyData = [
  {
    zone: "Rosales, Bogotá",
    title: "Apartamento con vista",
    meta: "3 hab. · 4 baños · 210 m²",
    price: "COP 11.800.000 / mes",
    image: "/media/feature-reference-hd.png",
    verified: "Verificada · 02 ago 2026",
    feature: true,
  },
  {
    zone: "Chicó Reservado, Bogotá",
    title: "Apartamento Calle 94",
    meta: "3 hab. · 3 baños · 184 m²",
    price: "COP 8.900.000 / mes",
    image: "/media/apartment-reference-hd.png",
    verified: "Verificada · 01 ago 2026",
  },
  {
    zone: "Santa Bárbara, Bogotá",
    title: "Apartamento con terraza",
    meta: "2 hab. · 3 baños · 142 m²",
    price: "COP 6.400.000 / mes",
    image: "/media/terrace-reference-hd.png",
    verified: "Verificada · 31 jul 2026",
  },
];

const valueColumns = [
  {
    number: "01",
    eyebrow: "PARA PROPIETARIOS",
    title: "Tu ingreso y tu propiedad, bajo control.",
    text: "Administramos el arriendo, coordinamos la póliza y cuidamos el inmueble con información que puedes revisar cuando quieras.",
    points: ["Pago conciliado y visible", "Mantenimiento con autorización y evidencia", "Contratos, póliza y documentos vigentes"],
  },
  {
    number: "02",
    eyebrow: "PARA ARRENDATARIOS",
    title: "Un hogar verificado y alguien que responde.",
    text: "Desde la visita hasta la entrega, sabes qué sigue, quién atiende tu solicitud y cuándo recibirás una actualización.",
    points: ["Avisos vigentes y costos claros", "Solicitudes con responsable y plazo", "Entrada y salida documentadas"],
  },
];

const promises = [
  {
    number: "01",
    title: "Verificado de verdad",
    text: "Identidad, disponibilidad, precio total y estado del inmueble revisados antes de publicar.",
    proof: "Sello con fecha de verificación",
  },
  {
    number: "02",
    title: "Todo deja rastro",
    text: "Pagos, contratos, mensajes, cotizaciones y mantenimientos viven en un solo expediente.",
    proof: "Una línea de tiempo compartida",
  },
  {
    number: "03",
    title: "Una persona a cargo",
    text: "Un Property Partner conoce la propiedad, coordina al equipo y responde por el caso.",
    proof: "Responsable y próxima acción visibles",
  },
];

const steps = [
  ["01", "Verificamos", "Conocemos el inmueble, validamos la información y dejamos un inventario completo."],
  ["02", "Presentamos", "Creamos fotos, video y tour 360 para atraer candidatos que sí corresponden."],
  ["03", "Administramos", "Coordinamos contrato, póliza, pagos, solicitudes y comunicación de principio a fin."],
  ["04", "Cuidamos", "Gestionamos mantenimientos con autorización, evidencia, factura y seguimiento al cierre."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [role, setRole] = useState<"propietario" | "arrendatario">("propietario");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setPortalOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage(`Mostrando propiedades verificadas en ${data.get("zone")} · ${data.get("type")}.`);
    document.querySelector("#propiedades")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="header">
        <a href="#inicio" className="brand" aria-label="Litving, inicio">LITVING</a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Navegación principal">
          <a href="#valor" onClick={() => setMenuOpen(false)}>Por qué Litving</a>
          <a href="#propiedades" onClick={() => setMenuOpen(false)}>Propiedades</a>
          <a href="#experiencia" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
          <a href="#equipo" onClick={() => setMenuOpen(false)}>Nosotros</a>
        </nav>
        <button className="portal" type="button" onClick={() => setPortalOpen(true)}>Entrar al portal</button>
        <button className="menu" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <section className="hero" id="inicio">
        <div className="heroCopy">
          <p className="kicker">GESTIÓN INMOBILIARIA RESIDENCIAL · BOGOTÁ</p>
          <h1>Tu propiedad,<br />bien cuidada.<br /><em>Tu arriendo, claro.</em></h1>
          <span className="dash" />
          <p className="lead">Administramos cada arriendo con un asesor que conoce el inmueble y una plataforma donde todo queda visible.</p>
          <div className="heroActions">
            <a href="#contacto" className="primary">Confiar mi propiedad</a>
            <a href="#propiedades" className="underlink">Buscar un hogar</a>
          </div>
          <p className="brandLine">Vivir bien también es estar bien acompañado.</p>
        </div>
        <div className="heroPhoto">
          <img src="/media/hero-reference-hd-v2.png" alt="Casa contemporánea administrada por Litving" />
          <span className="imageLabel"><b>Propiedad verificada</b><small>Bogotá · agosto 2026</small></span>
        </div>
        <form className="search" onSubmit={submitSearch} aria-label="Buscar propiedades">
          <label><span>Zona</span><select name="zone" defaultValue="Bogotá"><option>Bogotá</option><option>Usaquén</option><option>Chapinero</option><option>Barrios Unidos</option><option>Teusaquillo</option></select></label>
          <label><span>Tipo de propiedad</span><select name="type" defaultValue="Todos los tipos"><option>Todos los tipos</option><option>Apartamento</option><option>Casa</option></select></label>
          <label><span>Presupuesto mensual</span><select name="budget" defaultValue="Todos los rangos"><option>Todos los rangos</option><option>Hasta COP 4 millones</option><option>COP 4–8 millones</option><option>Más de COP 8 millones</option></select></label>
          <button type="submit">Buscar</button>
        </form>
      </section>

      <section className="proof" aria-label="Estándares de servicio Litving">
        <article><b>01</b><p>Avisos con <strong>fecha de verificación</strong></p></article>
        <article><b>02</b><p>Cada solicitud con <strong>responsable y plazo</strong></p></article>
        <article><b>03</b><p>Póliza, pagos y documentos <strong>siempre visibles</strong></p></article>
      </section>

      <section className="value" id="valor">
        <div className="sectionIntro">
          <p className="kicker">UNA INMOBILIARIA SIN PUNTOS CIEGOS</p>
          <h2>Menos incertidumbre.<br />Más tranquilidad para ambos.</h2>
          <p>La tecnología no reemplaza el servicio. Lo hace visible, medible y más fácil de cumplir.</p>
        </div>
        <div className="valueGrid">
          {valueColumns.map((column) => (
            <article className="valueCard" key={column.number}>
              <span className="valueNumber">{column.number}</span>
              <p className="kicker">{column.eyebrow}</p>
              <h3>{column.title}</h3>
              <p>{column.text}</p>
              <ul>{column.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="platform" id="administracion">
        <div className="platformCopy">
          <p className="kicker">PLATAFORMA LITVING</p>
          <h2>Lo importante,<br />siempre visible.</h2>
          <span className="dash" />
          <p>Propietario e inquilino consultan el mismo estado. Pagos, contratos, mantenimientos y decisiones quedan reunidos en una sola historia.</p>
          <div className="platformNote"><b>En seguimiento</b><span>Fuga de agua · Cocina</span><small>Próxima actualización hoy, 4:30 p. m.</small></div>
        </div>
        <div className="dashboard" aria-label="Vista del portal Litving">
          <aside><b>LITVING</b>{["Resumen", "Pagos", "Mantenimientos", "Solicitudes", "Contratos", "Documentos"].map((item, i) => <span className={i === 0 ? "active" : ""} key={item}>{item}</span>)}</aside>
          <div className="dashMain">
            <div className="dashHeader"><div><small>PROPIETARIO</small><b>Hola, Carolina</b></div><span>Todo al día <i /></span></div>
            <div className="dashMetrics">
              <article><span>Próximo pago</span><b>COP 8.900.000</b><small>Esperado el 05 de agosto</small><em>Conciliación automática</em></article>
              <article><span>Mantenimiento</span><b>1 en proceso</b><small>Técnico confirmado</small><em>Actualiza hoy, 4:30 p. m.</em></article>
              <article><span>Documentos</span><b>5 vigentes</b><small>Contrato y póliza activos</small><em>Sin acciones pendientes</em></article>
            </div>
            <div className="caseTimeline">
              <div className="caseTitle"><div><small>SOLICITUD #0184</small><b>Fuga de agua · Cocina</b></div><span>En proceso</span></div>
              <div className="timeline"><i className="done" /><i className="done" /><i className="current" /><i /></div>
              <div className="timelineLabels"><span>Recibida<small>9:12</small></span><span>Diagnosticada<small>10:05</small></span><span>Técnico en camino<small>2:00 p. m.</small></span><span>Cierre<small>Pendiente</small></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="promises">
        <div className="promiseHeading">
          <p className="kicker">PROMESAS QUE SE PUEDEN VER</p>
          <h2>No tienes que creer que funciona.<br />Puedes comprobarlo.</h2>
        </div>
        <div className="promiseGrid">
          {promises.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><small>{item.proof}</small></article>)}
        </div>
      </section>

      <section className="properties" id="propiedades">
        <div className="propertyHeading">
          <p className="kicker">SELECCIÓN LITVING</p>
          <h2>Hogares que sí<br />corresponden.</h2>
          <span className="dash" />
          <p>Cada anuncio muestra información vigente, medios profesionales y el costo mensual de forma clara.</p>
          <a href="#propiedades">Ver todas las propiedades →</a>
        </div>
        {message && <p className="result" role="status" aria-live="polite">{message}</p>}
        <div className="propertyLayout">
          {propertyData.map((item) => (
            <article className={item.feature ? "propertyCard feature" : "propertyCard"} key={item.title}>
              <div className="propertyImage"><img src={item.image} alt={item.title} /><span>{item.verified}</span></div>
              <div className="propertyInfo"><small>{item.zone}</small><h3>{item.title}</h3><span>{item.meta}</span><strong>{item.price}</strong><a href="#contacto">Ver propiedad →</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="experiencia">
        <div className="methodTitle"><p className="kicker">DE PRINCIPIO A FIN</p><h2>Así cuidamos<br />cada arriendo.</h2><span className="dash" /><p>Un estándar claro para que la calidad no dependa de perseguir a nadie.</p></div>
        {steps.map(([number, title, text]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section className="human" id="equipo">
        <div className="humanPhoto"><img src="/media/advisor-reference-hd-v2.png" alt="Property Partner de Litving" /></div>
        <div className="humanCopy"><p className="kicker">PERSONAS DETRÁS DE CADA PROPIEDAD</p><b className="quote">“</b><h2>La tecnología deja todo claro.<br />Nuestro equipo se hace cargo.</h2><span className="dash" /><p>Un Property Partner conoce tu inmueble, coordina al equipo y te mantiene informado hasta el cierre.</p><a href="#contacto" className="underlink">Conocer cómo trabajamos</a></div>
      </section>

      <section className="cta" id="contacto"><div><p className="kicker">CONVERSEMOS</p><h2>Tu propiedad merece una gestión a su altura.</h2></div><a href="mailto:hola@litving.co">Agendar una conversación <span>→</span></a></section>
      <footer><a href="#inicio" className="brand">LITVING</a><p>Gestión inmobiliaria residencial.<br />Tecnología visible, atención humana.</p><div><b>Explorar</b><a href="#valor">Por qué Litving</a><a href="#propiedades">Propiedades</a><a href="#experiencia">Cómo funciona</a></div><div><b>Servicios</b><a href="#propiedades">Arriendo</a><a href="#administracion">Administración</a><a href="#contacto">Litving Switch</a></div><div><b>Contacto</b><span>hola@litving.co</span><span>Bogotá, Colombia</span></div><small>© 2026 LITVING. Todos los derechos reservados.</small></footer>

      {portalOpen && <div className="modalBackdrop" onMouseDown={() => setPortalOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="portal-title" onMouseDown={(e) => e.stopPropagation()}><button className="close" aria-label="Cerrar portal" onClick={() => setPortalOpen(false)}>×</button><p className="kicker">PORTAL LITVING</p><h2 id="portal-title">Todo en un solo lugar.</h2><div className="roleTabs"><button className={role === "propietario" ? "active" : ""} onClick={() => setRole("propietario")}>Propietario</button><button className={role === "arrendatario" ? "active" : ""} onClick={() => setRole("arrendatario")}>Arrendatario</button></div><p>{role === "propietario" ? "Revisa pagos, contratos, mantenimiento y solicitudes de tus propiedades." : "Consulta pagos, documentos y mantenimientos con trazabilidad completa."}</p><form onSubmit={(e) => { e.preventDefault(); setPortalOpen(false); }}><input type="email" placeholder="tu@correo.com" aria-label="Correo" required /><button>Solicitar acceso</button></form></section></div>}
    </main>
  );
}
