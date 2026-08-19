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
  assert.match(html, /Más que administrar/i);
  assert.match(html, /Arriendo protegido/i);
  assert.match(html, /Ver publicación/i);
  assert.match(html, /id="beneficios"/i);
  assert.match(html, /id="personas"/i);
  assert.match(html, /id="equipo"/i);
  assert.match(html, /mailto:hola@litving\.com/i);
  assert.doesNotMatch(html, /litving-approved-page\.png|codex-preview|Building your site/i);
});

test("uses responsive native sections and core assets", async () => {
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
  assert.match(page, /hero-architectural-illustration-v4-paper\.png/);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /mailto:hola@litving\.com/);
  assert.match(page, /asesora-plataforma-crop\.png/);
  assert.match(page, /audience-owner-framed-v2-fuchsia\.png/);
  assert.match(page, /MobileAppNav/);
  assert.doesNotMatch(page, /approved-page|hotspot|litving-approved-page/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /manifest/);
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
  assert.match(css, /--font-display: var\(--font-montserrat\)/);
  assert.match(css, /--paper: #fdf9f6/);
  assert.match(css, /--ink: #132231/);
  assert.match(css, /--text-body:/);
  assert.match(css, /font-size: var\(--fs-body\)/);
  assert.match(css, /-webkit-font-smoothing: antialiased/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.mobile-app-nav/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(packageJson, /"build": "vinext build"/);
  await access(new URL("../public/manifest.json", import.meta.url));
  await access(new URL("../public/media/hero-architectural-illustration-v4-paper.png", import.meta.url));
  await access(new URL("../public/media/benefit-verified-sketch-paper.png", import.meta.url));
  await access(new URL("../public/media/listing-chico-living-hd.jpg", import.meta.url));
  await access(new URL("../public/media/asesora-plataforma-crop.png", import.meta.url));
});
