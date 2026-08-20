import { listPublishedSearchListings } from "../../lib/listings-store";
import type { SearchOperation } from "../../lib/search-listings";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const operation = url.searchParams.get("operation");
  const op =
    operation === "arriendo" || operation === "venta" ? (operation as SearchOperation) : undefined;
  const listings = await listPublishedSearchListings(op);
  return Response.json({ listings });
}
