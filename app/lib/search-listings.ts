export type SearchOperation = "arriendo" | "venta";

export type SearchListing = {
  id: string;
  code: string;
  operation: SearchOperation;
  kind: "Apartamento" | "Casa" | "Oficina";
  zone: string;
  city: string;
  address: string;
  /** Nombre del edificio / conjunto (principalmente ventas). */
  buildingName?: string;
  saleDetails?: import("./sale-details").SaleDetails;
  priceLabel: string;
  priceValue: number;
  area: string;
  areaM2: number;
  rooms: number;
  baths: number;
  parking: number;
  floor?: string;
  pets: boolean;
  furnished: boolean;
  elevator?: boolean;
  stratum?: string;
  status?: string;
  amenities?: string[];
  priceNote?: string;
  adminFee?: string;
  depositLabel?: string;
  depositValue?: number;
  image: string;
  gallery: string[];
  nearbyPlaces?: import("./nearby-places").NearbyPlace[];
  lat: number;
  lng: number;
  description: string;
};

export const searchListings: SearchListing[] = [
  {
    id: "chapinero-venta",
    code: "L-2312",
    operation: "venta",
    kind: "Apartamento",
    zone: "Chapinero",
    city: "Bogotá",
    address: "Calle 63 · Chapinero Alto",
    priceLabel: "$ 1.850.000.000",
    priceValue: 1850000000,
    area: "120 m²",
    areaM2: 120,
    rooms: 3,
    baths: 2,
    parking: 2,
    floor: "Piso 12",
    pets: true,
    furnished: false,
    adminFee: "$ 1.250.000",
    image: "/media/listing-chapinero-v2-living-hd.png",
    gallery: [
      "/media/listing-chapinero-v2-living-hd.png",
      "/media/listing-chapinero-v2-kitchen-hd.png",
      "/media/listing-chapinero-v2-bedroom-hd.png",
    ],
    lat: 4.6486,
    lng: -74.0628,
    description: "Apartamento amplio con vista a los cerros y acabados actualizados.",
  },
  {
    id: "chico-venta",
    code: "L-1190",
    operation: "venta",
    kind: "Apartamento",
    zone: "Chicó",
    city: "Bogotá",
    address: "Calle 93 · Chicó",
    priceLabel: "$ 1.420.000.000",
    priceValue: 1420000000,
    area: "95 m²",
    areaM2: 95,
    rooms: 2,
    baths: 2,
    parking: 1,
    floor: "Piso 9",
    pets: true,
    furnished: false,
    adminFee: "$ 980.000",
    image: "/media/listing-chico-kitchen-hd.jpg",
    gallery: ["/media/listing-chico-kitchen-hd.jpg", "/media/listing-chico-living-hd.jpg"],
    lat: 4.6741,
    lng: -74.0498,
    description: "Inversión sólida en una de las zonas con mayor demanda de arriendo.",
  },
  {
    id: "rosales-venta",
    code: "L-4488",
    operation: "venta",
    kind: "Apartamento",
    zone: "Rosales",
    city: "Bogotá",
    address: "Carrera 6 · Rosales",
    priceLabel: "$ 2.150.000.000",
    priceValue: 2150000000,
    area: "140 m²",
    areaM2: 140,
    rooms: 3,
    baths: 3,
    parking: 2,
    floor: "Piso 7",
    pets: true,
    furnished: false,
    adminFee: "$ 1.450.000",
    image: "/media/listing-chico-bedroom-hd.jpg",
    gallery: ["/media/listing-chico-bedroom-hd.jpg", "/media/listing-facade-rosales-v2.png"],
    lat: 4.6582,
    lng: -74.0544,
    description: "Espacios generosos, terraza y dos parqueaderos independientes.",
  },
  {
    id: "salitre-venta",
    code: "L-5299",
    operation: "venta",
    kind: "Apartamento",
    zone: "Salitre",
    city: "Bogotá",
    address: "Av. El Dorado · Salitre",
    priceLabel: "$ 780.000.000",
    priceValue: 780000000,
    area: "78 m²",
    areaM2: 78,
    rooms: 2,
    baths: 2,
    parking: 1,
    floor: "Piso 11",
    pets: false,
    furnished: false,
    adminFee: "$ 720.000",
    image: "/media/listing-salitre-terrace-b-hd.jpg",
    gallery: ["/media/listing-salitre-terrace-b-hd.jpg", "/media/listing-salitre-living-hd.jpg"],
    lat: 4.6688,
    lng: -74.0985,
    description: "Oportunidad cerca al aeropuerto y a corredores empresariales.",
  },
  {
    id: "castellana-venta",
    code: "L-3391",
    operation: "venta",
    kind: "Apartamento",
    zone: "La Castellana",
    city: "Bogotá",
    address: "Calle 100 · La Castellana",
    priceLabel: "$ 920.000.000",
    priceValue: 920000000,
    area: "85 m²",
    areaM2: 85,
    rooms: 2,
    baths: 2,
    parking: 1,
    floor: "Piso 14",
    pets: true,
    furnished: false,
    adminFee: "$ 850.000",
    image: "/media/listing-chapinero-v2-kitchen-hd.png",
    gallery: ["/media/listing-chapinero-v2-kitchen-hd.png", "/media/listing-chapinero-v2-living-hd.png"],
    lat: 4.6768,
    lng: -74.0702,
    description: "Torre reciente con gimnasio, coworking y sala de juntas.",
  },
  {
    id: "cabrera-venta",
    code: "L-5580",
    operation: "venta",
    kind: "Apartamento",
    zone: "La Cabrera",
    city: "Bogotá",
    address: "Calle 86 · La Cabrera",
    priceLabel: "$ 2.480.000.000",
    priceValue: 2480000000,
    area: "160 m²",
    areaM2: 160,
    rooms: 4,
    baths: 3,
    parking: 2,
    floor: "Piso 15",
    pets: true,
    furnished: false,
    adminFee: "$ 1.680.000",
    image: "/media/listing-chapinero-v2-bedroom-hd.png",
    gallery: ["/media/listing-chapinero-v2-bedroom-hd.png", "/media/listing-facade-la-cabrera-v2.png"],
    lat: 4.6642,
    lng: -74.0461,
    description: "Penthouse-like: terraza, cuarto de servicio y acabados de alta especificación.",
  },
  {
    id: "usaquen-venta",
    code: "L-6644",
    operation: "venta",
    kind: "Casa",
    zone: "Usaquén",
    city: "Bogotá",
    address: "Calle 119 · Usaquén",
    priceLabel: "$ 1.980.000.000",
    priceValue: 1980000000,
    area: "210 m²",
    areaM2: 210,
    rooms: 4,
    baths: 4,
    parking: 3,
    pets: true,
    furnished: false,
    adminFee: "$ 890.000",
    image: "/media/listing-facade-chico-reservado-v2.png",
    gallery: ["/media/listing-facade-chico-reservado-v2.png", "/media/listing-chico-living-hd.jpg"],
    lat: 4.6988,
    lng: -74.0321,
    description: "Casa de tres niveles con jardín, BBQ y cuarto de huéspedes.",
  },
  {
    id: "cedritos-venta",
    code: "L-7755",
    operation: "venta",
    kind: "Apartamento",
    zone: "Cedritos",
    city: "Bogotá",
    address: "Calle 147 · Cedritos",
    priceLabel: "$ 650.000.000",
    priceValue: 650000000,
    area: "72 m²",
    areaM2: 72,
    rooms: 2,
    baths: 2,
    parking: 1,
    floor: "Piso 8",
    pets: true,
    furnished: false,
    adminFee: "$ 580.000",
    image: "/media/listing-salitre-living-hd.jpg",
    gallery: ["/media/listing-salitre-living-hd.jpg", "/media/listing-chico-kitchen-hd.jpg"],
    lat: 4.7225,
    lng: -74.0362,
    description: "Apartamento listo para habitar, con balcón y parqueadero cubierto.",
  },
];

export function listingsFor(operation: SearchOperation) {
  return searchListings.filter(item => item.operation === operation);
}
