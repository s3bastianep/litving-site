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
  assert.match(html, /Arriendo con respaldo/i);
  assert.match(html, /Menos tiempo desocupado/i);
  assert.match(html, /Así hacemos que tu propiedad compita mejor/i);
  assert.match(html, /no inventario activo/i);
  assert.match(html, /Control sin perseguir respuestas/i);
  assert.match(html, /Si eres propietario/i);
  assert.match(html, /Si buscas un hogar/i);
  assert.match(html, /Del precio correcto al mantenimiento resuelto/i);
  assert.match(html, /La plataforma no reemplaza el servicio/i);
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
  assert.match(page, /className="blueprint"/);
  assert.match(page, /hero-architectural-illustration-v4\.png/);
  assert.match(page, />LITVING<\/a>/);
  assert.match(page, /className="portal-window"/);
  assert.match(page, /asesora-litving-hd\.png/);
  assert.match(page, /audience-diptych-v2\.png/);
  assert.doesNotMatch(page, /approved-page|hotspot|litving-approved-page/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(css, /\.hero \{ width: 100%; max-width: none; min-height: 640px/);
  assert.match(page, /function BenefitIllustration/);
  assert.match(page, /function ListingFacade/);
  assert.match(page, /function ProcessIllustration/);
  assert.equal((page.match(/<BenefitIllustration/g) ?? []).length, 1, "benefit artwork must only appear in the value section");
  assert.doesNotMatch(page, /item\.sketch/);
  assert.match(page, /className="value-grid"/);
  assert.match(css, /family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700/);
  assert.match(css, /--font-display: "Montserrat"/);
  assert.match(css, /--teal: #9b3f58/);
  assert.doesNotMatch(css, /Lora|Georgia/);
  assert.match(page, /TU PROPIEDAD, SIEMPRE VISIBLE/);
  assert.match(page, /portal-footer/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.blueprint/);
  assert.match(css, /\.portal-window/);
  assert.match(packageJson, /"build": "vinext build"/);
  await access(new URL("../public/media/hero-daylight-hd.png", import.meta.url));
  await access(new URL("../public/media/hero-architectural-illustration-v4.png", import.meta.url));
  await access(new URL("../public/media/benefit-verified-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-presentation-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-management-sketch.png", import.meta.url));
  await access(new URL("../public/media/benefit-human-sketch.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-rosales-v2.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-chico-reservado-v2.png", import.meta.url));
  await access(new URL("../public/media/listing-facade-la-cabrera-v2.png", import.meta.url));
  await access(new URL("../public/media/process-valuation-v2.png", import.meta.url));
  await access(new URL("../public/media/process-positioning-v2.png", import.meta.url));
  await access(new URL("../public/media/process-contract-v2.png", import.meta.url));
  await access(new URL("../public/media/process-management-v2.png", import.meta.url));
  await access(new URL("../public/media/asesora-litving-hd.png", import.meta.url));
  await access(new URL("../public/media/audience-diptych-v2.png", import.meta.url));
});
