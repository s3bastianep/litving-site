import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the native Litving experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>LITVING \| Tu propiedad, bien administrada<\/title>/i);
  assert.match(html, /Tu propiedad,/i);
  assert.match(html, /Renta protegida/i);
  assert.match(html, /Una propiedad que destaca/i);
  assert.match(html, /El valor de tu propiedad/i);
  assert.match(html, /no es inventario activo/i);
  assert.match(html, /Ver publicación/i);
  assert.match(html, /Control sin perseguir respuestas/i);
  assert.match(html, /Si eres propietario/i);
  assert.match(html, /Si buscas un hogar/i);
  assert.match(html, /Del primer análisis a la operación continua/i);
  assert.match(html, /siempre bajo control/i);
  assert.match(html, /POR QUÉ ELEGIR LITVING/i);
  assert.match(html, /id="personas"/i);
  assert.match(html, /id="equipo"/i);
  assert.doesNotMatch(html, /litving-approved-page\.png|codex-preview|Building your site/i);
});

test("uses responsive native sections and HD assets", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /id="presentacion"/);
  assert.match(page, /id="portal"/);
  assert.match(page, /id="beneficios"/);
  assert.match(page, /id="personas"/);
  assert.match(page, /id="equipo"/);
  assert.match(page, /className="blueprint"/);
  assert.match(page, /hero-architectural-illustration-v4-transparent\.png/);
  assert.match(page, />LITVING<\/a>/);
  assert.match(page, /className="portal-window"/);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /aria-controls="main-navigation"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-pressed=/);
  assert.match(page, /nav-backdrop/);
  assert.match(page, /mailto:hola@litving\.com/);
  assert.match(page, /Ver reporte mensual \(demo\)/);
  assert.match(page, /Quiero agendar una visita/);
  assert.match(page, /asesora-litving-hd\.png/);
  assert.match(page, /audience-owner-blend-v3\.png/);
  assert.match(page, /audience-tenant-blend-v3\.png/);
  assert.doesNotMatch(page, /approved-page|hotspot|litving-approved-page/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(css, /\.hero \{[\s\S]*?min-height: min\(88vh, 820px\)/);
  assert.match(page, /function BenefitIllustration/);
  assert.match(page, /function InteractiveListingCard/);
  assert.match(page, /function ProcessIllustration/);
  assert.equal((page.match(/<BenefitIllustration/g) ?? []).length, 1, "benefit artwork must only appear in the value section");
  assert.doesNotMatch(page, /item\.sketch/);
  assert.match(page, /className="value-grid"/);
  assert.match(css, /family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700/);
  assert.match(css, /--font-display: "Montserrat"/);
  assert.match(css, /--paper: #f6f2ea/);
  assert.match(css, /--ink: #111312/);
  assert.match(css, /--teal: #2447e5/);
  assert.match(css, /--text-body:/);
  assert.match(css, /font-size: var\(--fs-body\)/);
  assert.match(css, /-webkit-font-smoothing: auto/);
  assert.match(page, /LUEGO: TE DEVOLVEMOS EL CONTROL/);
  assert.match(page, /className="journey-map"/);
  assert.match(page, /portal-footer/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.listing-gallery-nav button \{[\s\S]*?width: 44px/);
  assert.match(css, /\.nav-backdrop/);
  assert.match(css, /\.blueprint/);
  assert.match(css, /\.portal-window/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /text-size-adjust: 100%/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(packageJson, /"build": "vinext build"/);
  await access(new URL("../public/media/hero-daylight-hd.png", import.meta.url));
  await access(new URL("../public/media/hero-architectural-illustration-v4-transparent.png", import.meta.url));
  await access(new URL("../public/media/benefit-verified-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-presentation-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-management-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-human-sketch.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-rosales-v2.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-chico-reservado-v2.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-la-cabrera-v2.png", import.meta.url));
  await access(new URL("../public/media/process-valuation-v4.png", import.meta.url));
  await access(new URL("../public/media/process-positioning-v4.png", import.meta.url));
  await access(new URL("../public/media/process-contract-v4.png", import.meta.url));
  await access(new URL("../public/media/process-management-v4.png", import.meta.url));
  await access(new URL("../public/media/asesora-litving-hd.png", import.meta.url));
  await access(new URL("../public/media/audience-owner-blend-v3.png", import.meta.url));
  await access(new URL("../public/media/audience-tenant-blend-v3.png", import.meta.url));
});
