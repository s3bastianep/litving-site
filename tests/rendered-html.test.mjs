import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Litving value proposition", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>LITVING \| Administración de arriendos en Bogotá<\/title>/i);
  assert.match(html, /Recibe tu arriendo\./i);
  assert.match(html, /Nosotros cuidamos todo lo demás\./i);
  assert.match(html, /Propiedad mejor presentada/i);
  assert.match(html, /Pago respaldado/i);
  assert.match(html, /Cuando escribes, responde una persona/i);
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

  assert.match(page, /id="propietarios"/);
  assert.match(page, /id="arrendatarios"/);
  assert.match(page, /className="dashboard"/);
  assert.match(page, /Property Partner/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.heroSignals/);
  assert.match(packageJson, /"build": "vinext build"/);
  assert.doesNotMatch(page + layout + packageJson, /codex-preview|_sites-preview|react-loading-skeleton/);

  await access(new URL("../public/og.png", import.meta.url));
});
