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

test("server-renders the approved Litving experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LITVING \| Tu propiedad, bien administrada<\/title>/i);
  assert.match(html, /Tu propiedad, bien administrada\./i);
  assert.match(html, /Propiedades verificadas/i);
  assert.match(html, /Presentación profesional/i);
  assert.match(html, /Propiedades elegidas con criterio/i);
  assert.match(html, /Tu propiedad, siempre visible/i);
  assert.match(html, /Nuestro equipo responde/i);
  assert.match(html, /litving-approved-page\.png/i);
  assert.match(html, /og:image/i);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the approved visual, interactions and metadata", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /id="propiedades"/);
  assert.match(page, /id="portal"/);
  assert.match(page, /id="personas"/);
  assert.match(page, /className="approved-page"/);
  assert.match(page, /className="hotspot portal-button"/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /\.page-canvas/);
  assert.match(css, /\.hotspot/);
  assert.match(packageJson, /"build": "vinext build"/);
  assert.doesNotMatch(page + layout + packageJson, /codex-preview|_sites-preview|react-loading-skeleton/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/litving-approved-page.png", import.meta.url));
});
