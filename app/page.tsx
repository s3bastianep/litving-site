"use client";

import { FormEvent, useEffect, useState } from "react";

const properties = [
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

const outcomes = [
  {
    number: "01",
    title: "Arrendar mejor",
    text: "Fotografía, video y tour 360 profesional para presentar el inmueble con un solo precio y datos verificados.",
    proof: "Una publicación coherente, lista para decidir",
  },
  {
    number: "02",
    title: "Elegir mejor",
    text: "Validamos candidatos, coordinamos visitas útiles y gestionamos la póliza antes de entregar las llaves.",
    proof: "Menos visitas vacías, más intención real",
  },
  {
    number: "03",
    title: "Cobrar con tranquilidad",
    text: "El canon, la póliza y cada movimiento quedan conciliados y disponibles para consulta.",
    proof: "Pago respaldado según la cobertura contratada",
  },
  {
    number: "04",
    title: "Cuidar sin perseguir",
    text: "Cada mantenimiento tiene responsable, diagnóstico, autorización, evidencia y cierre documentado.",
    proof: "Una historia completa de cada solicitud",
  },
];

const steps = [
  ["01", "Conocemos", "Visitamos el inmueble, validamos su información y definimos una estrategia de salida."],
  ["02", "Presentamos", "Producimos el contenido, publicamos y filtramos a quienes sí corresponden."],
  ["03", "Formalizamos", "Coordinamos póliza, contrato, inventario, firma y entrega de llaves."],
  ["04", "Respondemos", "Gestionamos pagos, solicitudes y mantenimiento durante toda la relación."],
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
    setMessage(`Mostrando hogares verificados en ${data.get("zone")} · ${data.get("type")}.`);
    document.querySelector("#resultados")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="header">
        <a href="#inicio" className="brand" aria-label="Litving, inicio">LITVING</a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Navegación principal">
          <a href="#propietarios" onClick={() => setMenuOpen(false)}>Para propietarios</a>
          <a href="#arrendatarios" onClick={() => setMenuOpen(false)}>Para arrendatarios</a>
          <a href="#experiencia" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
          <a href="#propiedades" onClick={() => setMenuOpen(false)}>Propiedades</a>
        </nav>
        <button className="portal" type="button" onClick={() => setPortalOpen(true)}>Entrar al portal</button>
        <button className="menu" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <section className="hero" id="inicio">
        <div className="heroCopy">
          <p className="kicker">ADMINISTRACIÓN DE ARRIENDOS · BOGOTÁ</p>
          <h1>Recibe tu arriendo.<br /><em>Nosotros cuidamos todo lo demás.</em></h1>
          <span className="dash" />
          <p className="lead">Presentamos tu propiedad, verificamos al inquilino y gestionamos póliza, contrato, pagos y mantenimiento. Tú puedes seguir cada avance desde tu celular.</p>
          <div className="heroActions">
            <a href="#contacto" className="primary">Quiero arrendar mi propiedad</a>
            <a href="#experiencia" className="underlink">Ver cómo funciona</a>
          </div>
          <p className="brandLine">Vivir bien también es estar bien acompañado.</p>
        </div>
        <div className="heroPhoto">
          <img src="/media/hero-reference-hd-v2.png" alt="Casa contemporánea administrada por Litving" />
          <span className="imageLabel"><b>Gestión Litving</b><small>Una propiedad · una historia · un responsable</small></span>
        </div>
        <div className="heroSignals" aria-label="Beneficios principales de Litving">
          <article><span>01</span><div><b>Propiedad mejor presentada</b><small>Fotografía, video y tour 360</small></div></article>
          <article><span>02</span><div><b>Pago respaldado</b><small>Póliza y seguimiento del canon</small></div></article>
          <article><span>03</span><div><b>Una persona responsable</b><small>Cada caso con plazo y próxima acción</small></div></article>
        </div>
      </section>

      <section className="answerStrip" aria-label="Atención humana Litving">
        <div className="answerAvatar"><img src="/media/advisor-reference-hd-v2.png" alt="Asesora Litving" /></div>
        <div><b>Cuando escribes, responde una persona que conoce tu propiedad.</b><p>La plataforma organiza la información. Tu Property Partner coordina al equipo y se hace cargo.</p></div>
        <a href="#equipo">Conocer al equipo <span>→</span></a>
      </section>

      <section className="problem" id="propietarios">
        <div className="problemCopy">
          <p className="kicker">EL PROBLEMA QUE RESOLVEMOS</p>
          <h2>Administrar un arriendo no debería convertirse en otro trabajo.</h2>
          <span className="dash" />
          <p>Perseguir respuestas, conciliar pagos, coordinar técnicos y reconstruir conversaciones desgasta el valor del inmueble y la tranquilidad del propietario.</p>
          <blockquote>Cada obligación se convierte en un responsable, un plazo y una evidencia.</blockquote>
        </div>
        <div className="problemPanel">
          <article><span>01</span><div><h3>Publicar sin perder valor</h3><p>Un solo precio, información validada y material profesional en cada canal.</p></div></article>
          <article><span>02</span><div><h3>Cobrar sin perseguir</h3><p>Póliza, canon, comprobantes y novedades reunidos en un mismo expediente.</p></div></article>
          <article><span>03</span><div><h3>Resolver sin improvisar</h3><p>Diagnóstico, cotización, autorización y cierre visibles para todas las partes.</p></div></article>
        </div>
      </section>

      <section className="outcomes">
        <div className="sectionIntro">
          <p className="kicker">EL VALOR DE LITVING</p>
          <h2>El resultado que compra el propietario.</h2>
          <p>No vendemos una plataforma. Construimos una administración que protege el ingreso, el inmueble y el tiempo de quien confía en nosotros.</p>
        </div>
        <div className="outcomeGrid">
          {outcomes.map((outcome) => (
            <article key={outcome.number}>
              <span>{outcome.number}</span>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
              <small>{outcome.proof}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="platform" id="administracion">
        <div className="platformCopy">
          <p className="kicker">PLATAFORMA LITVING</p>
          <h2>No te decimos que todo está bajo control.<br />Te lo mostramos.</h2>
          <span className="dash" />
          <p>Pagos, contratos, mantenimientos y decisiones viven en una sola historia. Propietario y arrendatario consultan el mismo estado, sin mensajes perdidos.</p>
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

      <section className="tenant" id="arrendatarios">
        <div className="tenantPhoto"><img src="/media/apartment-reference-hd.png" alt="Apartamento verificado por Litving" /><span>Verificada · información vigente</span></div>
        <div className="tenantCopy">
          <p className="kicker">PARA QUIEN BUSCA HOGAR</p>
          <h2>Menos anuncios dudosos. Más hogares que sí corresponden.</h2>
          <span className="dash" />
          <p>Cada propiedad se revisa antes de publicarse. El precio, la disponibilidad y las condiciones están claras antes de coordinar la visita.</p>
          <ul><li>Fotos reales y datos verificados</li><li>Visitas presenciales o virtuales coordinadas</li><li>Una persona que responde tus dudas</li></ul>
          <a href="#propiedades" className="underlink">Explorar hogares verificados</a>
        </div>
      </section>

      <section className="properties" id="propiedades">
        <div className="propertyTop">
          <div><p className="kicker">SELECCIÓN LITVING</p><h2>Hogares verificados para decidir mejor.</h2></div>
          <p>Información vigente, contenido profesional y el costo mensual presentado con claridad.</p>
        </div>
        <form className="search" onSubmit={submitSearch} aria-label="Buscar propiedades">
          <label><span>Zona</span><select name="zone" defaultValue="Bogotá"><option>Bogotá</option><option>Usaquén</option><option>Chapinero</option><option>Barrios Unidos</option><option>Teusaquillo</option></select></label>
          <label><span>Tipo de propiedad</span><select name="type" defaultValue="Todos los tipos"><option>Todos los tipos</option><option>Apartamento</option><option>Casa</option></select></label>
          <label><span>Presupuesto mensual</span><select name="budget" defaultValue="Todos los rangos"><option>Todos los rangos</option><option>Hasta COP 4 millones</option><option>COP 4–8 millones</option><option>Más de COP 8 millones</option></select></label>
          <button type="submit">Buscar hogar</button>
        </form>
        {message && <p className="result" role="status" aria-live="polite">{message}</p>}
        <div className="propertyLayout" id="resultados">
          {properties.map((property) => (
            <article className={property.feature ? "propertyCard feature" : "propertyCard"} key={property.title}>
              <div className="propertyImage"><img src={property.image} alt={property.title} /><span>{property.verified}</span></div>
              <div className="propertyInfo"><small>{property.zone}</small><h3>{property.title}</h3><span>{property.meta}</span><strong>{property.price}</strong><a href="#contacto">Ver propiedad →</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="experiencia">
        <div className="methodTitle"><p className="kicker">DE PRINCIPIO A FIN</p><h2>Una gestión que no deja cabos sueltos.</h2><span className="dash" /><p>Cuatro momentos, un mismo estándar y una persona responsable durante toda la relación.</p></div>
        {steps.map(([number, title, text]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}
      </section>

      <section className="human" id="equipo">
        <div className="humanPhoto"><img src="/media/advisor-reference-hd-v2.png" alt="Property Partner de Litving" /></div>
        <div className="humanCopy"><p className="kicker">PERSONAS DETRÁS DE CADA PROPIEDAD</p><b className="quote">“</b><h2>La tecnología organiza.<br />Nuestro equipo responde.</h2><span className="dash" /><p>Tu Property Partner conoce el inmueble, coordina a cada proveedor y te mantiene informado hasta el cierre. No es un bot y no desaparece cuando hay un problema.</p><a href="#contacto" className="underlink">Hablar con el equipo</a></div>
      </section>

      <section className="cta" id="contacto"><div><p className="kicker">CONVERSEMOS</p><h2>Hablemos de tu propiedad.</h2><p>Cuéntanos qué necesitas. Te responderá una persona de nuestro equipo.</p></div><a href="mailto:hola@litving.co">Agendar una conversación <span>→</span></a></section>
      <footer><a href="#inicio" className="brand">LITVING</a><p>Administración de arriendos residenciales.<br />Tecnología visible, atención humana.</p><div><b>Propietarios</b><a href="#propietarios">Por qué Litving</a><a href="#administracion">Plataforma</a><a href="#experiencia">Cómo funciona</a></div><div><b>Arrendatarios</b><a href="#arrendatarios">La experiencia</a><a href="#propiedades">Propiedades</a><button type="button" onClick={() => setPortalOpen(true)}>Portal</button></div><div><b>Contacto</b><span>hola@litving.co</span><span>Bogotá, Colombia</span></div><small>© 2026 LITVING. Todos los derechos reservados.</small></footer>

      {portalOpen && <div className="modalBackdrop" onMouseDown={() => setPortalOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="portal-title" onMouseDown={(e) => e.stopPropagation()}><button className="close" aria-label="Cerrar portal" onClick={() => setPortalOpen(false)}>×</button><p className="kicker">PORTAL LITVING</p><h2 id="portal-title">Todo en un solo lugar.</h2><div className="roleTabs"><button className={role === "propietario" ? "active" : ""} onClick={() => setRole("propietario")}>Propietario</button><button className={role === "arrendatario" ? "active" : ""} onClick={() => setRole("arrendatario")}>Arrendatario</button></div><p>{role === "propietario" ? "Revisa pagos, contratos, mantenimiento y solicitudes de tus propiedades." : "Consulta pagos, documentos y mantenimientos con trazabilidad completa."}</p><form onSubmit={(event) => { event.preventDefault(); setPortalOpen(false); }}><input type="email" placeholder="tu@correo.com" aria-label="Correo" required /><button>Solicitar acceso</button></form></section></div>}
    </main>
  );
}
