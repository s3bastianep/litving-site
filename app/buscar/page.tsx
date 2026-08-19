import type { Metadata } from "next";
import { SearchHub } from "../components/search-hub";
import "../search.css";

export const metadata: Metadata = {
  title: "Buscar inmueble | LITVING",
  description: "Elige si buscas arriendo o compra en Bogotá y explora propiedades verificadas.",
};

export default function BuscarPage() {
  return <SearchHub />;
}
