import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { agencyJsonLd, catalogJsonLd, JsonLd } from "./components/json-ld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://litving-bogota.macampoq.chatgpt.site"),
  title: "LITVING | Tu propiedad, bien administrada",
  description:
    "Arrendamos y administramos propiedades en Bogotá: canon respaldado, publicación profesional y un asesor responsable.",
  openGraph: {
    title: "LITVING | Tu propiedad, bien administrada",
    description:
      "Una inmobiliaria digital para arrendar mejor, proteger el ingreso y mantener el control.",
    url: "/",
    siteName: "LITVING",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LITVING, tu propiedad bien administrada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LITVING | Tu propiedad, bien administrada",
    description:
      "Una inmobiliaria digital para arrendar mejor, proteger el ingreso y mantener el control.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <JsonLd data={agencyJsonLd} />
        <JsonLd data={catalogJsonLd} />
        {children}
      </body>
    </html>
  );
}
