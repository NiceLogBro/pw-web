/**
 * Commercial property records used by the property finder.
 *
 * Nothing here is scraped from LoopNet/CoStar — their terms prohibit automated
 * access. Records come from one of these, in order of preference:
 *
 *   1. `properties.generated.json` — produced by `npm run properties`, which
 *      pulls OpenStreetMap commercial buildings via the Overpass API (ODbL).
 *   2. `SEED_LISTINGS` below — a small sample so the UI is usable before the
 *      first fetch. Names are real O'ahu commercial properties; street numbers
 *      and coordinates are intentionally omitted rather than guessed.
 *
 * To move to LoopLink listings, set VITE_LOOPLINK_URL (see LoopLinkEmbed) and the
 * component renders the vendor widget instead of this local dataset.
 */

export type PropertyType =
  "retail" | "office" | "industrial" | "hospitality" | "institutional" | "mixed";

export type ListingSource = "seed" | "osm" | "manual" | "looplink";

export interface PropertyListing {
  id: string;
  name: string;
  type: PropertyType;
  /** Neighborhood / district, matching the areas the crew serves. */
  area: string;
  address?: string;
  lat?: number;
  lng?: number;
  /** Where the record came from, surfaced in the UI for transparency. */
  source: ListingSource;
  /** Optional public page about the property. */
  url?: string;
}

export const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: "retail", label: "Retail & centers" },
  { id: "office", label: "Office" },
  { id: "industrial", label: "Industrial & warehouse" },
  { id: "hospitality", label: "Hotel & resort" },
  { id: "institutional", label: "Institutional" },
  { id: "mixed", label: "Mixed use" },
];

/**
 * Sample records for UI development. These are real O'ahu properties people
 * search for, but they carry no street address or coordinates: address-level
 * data must come from the Overpass fetch or a licensed feed, never from memory.
 */
export const SEED_LISTINGS: PropertyListing[] = [
  {
    id: "seed-ala-moana-center",
    name: "Ala Moana Center",
    type: "retail",
    area: "Honolulu",
    source: "seed",
  },
  {
    id: "seed-royal-hawaiian-center",
    name: "Royal Hawaiian Center",
    type: "retail",
    area: "Waikiki",
    source: "seed",
  },
  {
    id: "seed-international-market-place",
    name: "International Market Place",
    type: "retail",
    area: "Waikiki",
    source: "seed",
  },
  { id: "seed-kahala-mall", name: "Kahala Mall", type: "retail", area: "Kahala", source: "seed" },
  {
    id: "seed-pearlridge-center",
    name: "Pearlridge Center",
    type: "retail",
    area: "Aiea",
    source: "seed",
  },
  {
    id: "seed-windward-mall",
    name: "Windward Mall",
    type: "retail",
    area: "Kaneohe",
    source: "seed",
  },
  {
    id: "seed-kapolei-commons",
    name: "Kapolei Commons",
    type: "retail",
    area: "Kapolei",
    source: "seed",
  },
  {
    id: "seed-ka-makana-alii",
    name: "Ka Makana Ali'i",
    type: "retail",
    area: "Kapolei",
    source: "seed",
  },
  {
    id: "seed-waikele-outlets",
    name: "Waikele Premium Outlets",
    type: "retail",
    area: "Waikele",
    source: "seed",
  },
  {
    id: "seed-kailua-town",
    name: "Kailua Town Center",
    type: "mixed",
    area: "Kailua",
    source: "seed",
  },
  {
    id: "seed-ala-moana-pacific",
    name: "Ala Moana Pacific Center",
    type: "office",
    area: "Honolulu",
    source: "seed",
  },
  {
    id: "seed-waterfront-plaza",
    name: "Waterfront Plaza",
    type: "office",
    area: "Honolulu",
    source: "seed",
  },
  {
    id: "seed-airport-industrial",
    name: "Mapunapuna industrial district",
    type: "industrial",
    area: "Mapunapuna",
    source: "seed",
  },
  {
    id: "seed-campbell-industrial",
    name: "Campbell Industrial Park",
    type: "industrial",
    area: "Kapolei",
    source: "seed",
  },
  {
    id: "seed-hawaii-kai-towne",
    name: "Hawai'i Kai Towne Center",
    type: "retail",
    area: "Hawaii Kai",
    source: "seed",
  },
  {
    id: "seed-mililani-town",
    name: "Mililani Town Center",
    type: "retail",
    area: "Mililani",
    source: "seed",
  },
  {
    id: "seed-haleiwa-storefronts",
    name: "Hale'iwa town storefronts",
    type: "mixed",
    area: "Haleiwa",
    source: "seed",
  },
  {
    id: "seed-uh-west-oahu",
    name: "UH West O'ahu campus",
    type: "institutional",
    area: "Kapolei",
    source: "seed",
  },
  {
    id: "seed-ko-olau",
    name: "Ko Olina Resort",
    type: "hospitality",
    area: "Kapolei",
    source: "seed",
  },
  {
    id: "seed-turtle-bay",
    name: "Turtle Bay Resort",
    type: "hospitality",
    area: "North Shore",
    source: "seed",
  },
];

/** Records from `npm run properties`, if that has been run. */
import generated from "./properties.generated.json";

const generatedListings = (generated as { listings?: PropertyListing[] }).listings ?? [];

/**
 * All available listings. Generated (real, geocoded) records take precedence and
 * the seed set is dropped once real data exists, so the map never mixes invented
 * points with fetched ones.
 */
export const listings: PropertyListing[] =
  generatedListings.length > 0 ? generatedListings : SEED_LISTINGS;

export const hasGeneratedListings = generatedListings.length > 0;

/** Free-text filter across name, area and address. */
export function filterListings(
  items: PropertyListing[],
  query: string,
  type: PropertyType | "all",
): PropertyListing[] {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (!needle) return true;
    return [item.name, item.area, item.address ?? ""].some((field) =>
      field.toLowerCase().includes(needle),
    );
  });
}

/** Google Maps deep link for a property, so no map library is needed. */
export function mapUrlFor(item: PropertyListing): string | null {
  if (typeof item.lat === "number" && typeof item.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
  }
  if (item.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`;
  }
  return null;
}
