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
  assert.match(html, /Propiedades verificadas/i);
  assert.match(html, /Presentación profesional/i);
  assert.match(html, /Así se verá tu propiedad/i);
  assert.match(html, /No corresponden a inventario activo/i);
  assert.match(html, /Nuestro equipo responde/i);
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
  assert.match(page, /hero-architectural-illustration-v2\.png/);
  assert.match(page, /className="portal-window"/);
  assert.match(page, /asesora-litving-hd\.png/);
  assert.doesNotMatch(page, /approved-page|hotspot|litving-approved-page/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(css, /\.hero \{ width: 100%; max-width: none; min-height: calc\(100svh - 76px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.blueprint/);
  assert.match(css, /\.portal-window/);
  assert.match(packageJson, /"build": "vinext build"/);
  await access(new URL("../public/media/hero-daylight-hd.png", import.meta.url));
  await access(new URL("../public/media/hero-architectural-illustration-v2.png", import.meta.url));
  await access(new URL("../public/media/asesora-litving-hd.png", import.meta.url));
});
