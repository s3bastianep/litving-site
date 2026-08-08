import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litving-bogota.macampoq.chatgpt.site"),
  title: "LITVING | Tu propiedad, bien administrada",
  description: "Administración residencial con presentación profesional, tecnología visible y atención humana en Bogotá.",
  openGraph: {
    title: "LITVING | Tu propiedad, bien administrada",
    description: "Tecnología que organiza. Personas que responden.",
    url: "/",
    siteName: "LITVING",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LITVING, tu propiedad bien administrada" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LITVING | Tu propiedad, bien administrada",
    description: "Tecnología que organiza. Personas que responden.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
