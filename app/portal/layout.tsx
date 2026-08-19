import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portal de gestión | LITVING",
  description: "Consulta pagos, contratos y gestiones de tu propiedad con Litving.",
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return children;
}
