import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://litving-bogota.macampoq.chatgpt.site"),
  title: "LITVING | Administración de arriendos en Bogotá",
  description: "Presentamos tu propiedad, verificamos al inquilino y gestionamos póliza, pagos y mantenimiento con tecnología visible y atención humana.",
  openGraph: {
    title: "LITVING | Administración de arriendos en Bogotá",
    description: "Recibe tu arriendo. Nosotros cuidamos todo lo demás.",
    url: "/",
    siteName: "LITVING",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LITVING, administración de arriendos en Bogotá" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LITVING | Administración de arriendos en Bogotá",
    description: "Recibe tu arriendo. Nosotros cuidamos todo lo demás.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
