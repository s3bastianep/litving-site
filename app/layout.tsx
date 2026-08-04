import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LITVING | Gestión inmobiliaria residencial",
  description: "Administramos cada arriendo con propiedades verificadas, una plataforma clara y un equipo que conoce cada inmueble.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
