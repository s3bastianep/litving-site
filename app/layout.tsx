import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litving-bogota.macampoq.chatgpt.site"),
  title: "LITVING | Tu propiedad, bien administrada",
  description:
    "Arrendamos y administramos propiedades en Bogotá con canon respaldado, publicación profesional, portal de gestión y un asesor responsable.",
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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
