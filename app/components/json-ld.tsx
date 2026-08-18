import { listingsFor, searchListings, type SearchListing, type SearchOperation } from "../lib/search-listings";

const SITE = "https://litving-bogota.macampoq.chatgpt.site";

function schemaType(kind: SearchListing["kind"]) {
  if (kind === "Casa") return "House";
  if (kind === "Oficina") return "Place";
  return "Apartment";
}

function listingPath(item: SearchListing) {
  return item.operation === "arriendo" ? "arrendar" : "comprar";
}

function listingNode(item: SearchListing) {
  const path = listingPath(item);
  return {
    "@type": schemaType(item.kind),
    name: `${item.kind} en ${item.zone}`,
    url: `${SITE}/${path}?inmueble=${item.id}`,
    identifier: item.code,
    description: item.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: item.address,
      addressLocality: item.city,
      addressRegion: item.zone,
      addressCountry: "CO",
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Barrio",
      value: item.zone,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: item.areaM2,
      unitCode: "MTK",
    },
    numberOfRooms: item.rooms,
    numberOfBathroomsTotal: item.baths,
    image: item.gallery.map(src => `${SITE}${src}`),
    offers: {
      "@type": "Offer",
      price: item.priceValue,
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
      businessFunction:
        item.operation === "arriendo" ? "https://schema.org/LeaseOut" : "https://schema.org/Sell",
    },
  };
}

function itemList(name: string, url: string, items: SearchListing[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: listingNode(item),
    })),
  };
}

export const agencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "LITVING",
  url: SITE,
  email: "hola@litving.com",
  areaServed: {
    "@type": "City",
    name: "Bogotá",
    containedInPlace: { "@type": "Country", name: "Colombia" },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bogotá",
    addressCountry: "CO",
  },
};

export const catalogJsonLd = itemList(
  "Propiedades LITVING en Bogotá",
  SITE,
  searchListings,
);

export function listingsJsonLd(operation: SearchOperation) {
  const items = listingsFor(operation);
  const path = operation === "arriendo" ? "arrendar" : "comprar";
  return itemList(
    operation === "arriendo"
      ? "Propiedades en arriendo en Bogotá"
      : "Propiedades en venta en Bogotá",
    `${SITE}/${path}`,
    items,
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
