import type { Metadata } from "next";
import { PropertySearch } from "../components/property-search";
import { JsonLd, listingsJsonLd } from "../components/json-ld";
import "../search.css";

export const metadata: Metadata = {
  title: "Arrendar en Bogotá | LITVING",
  description:
    "Apartamentos y casas en arriendo en Chicó, Salitre y más barrios de Bogotá, con precio, área y datos verificados.",
};

export default function ArrendarPage() {
  return (
    <>
      <JsonLd data={listingsJsonLd("arriendo")} />
      <PropertySearch operation="arriendo" />
    </>
  );
}
