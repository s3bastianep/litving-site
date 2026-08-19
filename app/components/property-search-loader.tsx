"use client";

import dynamic from "next/dynamic";
import type { SearchOperation } from "../lib/search-listings";

const PropertySearch = dynamic(
  () => import("./property-search").then(module => module.PropertySearch),
  {
    ssr: false,
    loading: () => <div className="search-page search-page--app search-page--loading" aria-busy="true" />,
  },
);

export function PropertySearchLoader({ operation }: { operation: SearchOperation }) {
  return <PropertySearch operation={operation} />;
}
