import type { Metadata } from "next";
import { PropertySearchLoader } from "../components/property-search-loader";
import { JsonLd, listingsJsonLd } from "../components/json-ld";
import "../search.css";
export const metadata: Metadata = {
  title: "Comprar en Bogotá | LITVING",
  description:
    "Apartamentos y casas en venta en Bogotá, con precio, barrio y ficha verificada para evaluar con calma.",
};

export default function ComprarPage() {
  return (
    <>
      <JsonLd data={listingsJsonLd("venta")} />
      <PropertySearchLoader operation="venta" />    </>
  );
}
