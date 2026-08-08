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

test("server-renders the Litving value proposition", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LITVING \| Tu propiedad, bien administrada<\/title>/i);
  assert.match(html, /Tu propiedad,<br\/>bien administrada\./i);
  assert.match(html, /Propiedades verificadas/i);
  assert.match(html, /Presentación profesional/i);
  assert.match(html, /Así se verá tu anuncio/i);
  assert.match(html, /VISTA PREVIA · ANUNCIO DE EJEMPLO/i);
  assert.match(html, /Tu propiedad,<br\/>siempre visible\./i);
  assert.match(html, /Nuestro equipo responde/i);
  assert.match(html, /og:image/i);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the finished product metadata, layout and social card", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /id="beneficios"/);
  assert.match(page, /id="anuncio"/);
  assert.match(page, /id="portal"/);
  assert.match(page, /className="dashboard-mock"/);
  assert.match(page, /drawing-/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(css, /@media \(max-width: 740px\)/);
  assert.match(css, /\.hero-signals/);
  assert.match(packageJson, /"build": "vinext build"/);
  assert.doesNotMatch(page + layout + packageJson, /codex-preview|_sites-preview|react-loading-skeleton/);

  await access(new URL("../public/og.png", import.meta.url));
});
