/**
 * Populate src/data/properties.generated.json with commercial buildings on
 * O'ahu from OpenStreetMap via the Overpass API.
 *
 * Licence: OpenStreetMap data is ODbL 1.0 — attribution required, share-alike
 * for derived databases. Keep the attribution in the UI (PropertyFinder shows it).
 *
 * This deliberately does NOT touch LoopNet/CoStar: their terms of service
 * prohibit automated or programmatic access, and CoStar Group actively enforces
 * that. Use LoopLink (a licensed embed) for listing data.
 *
 * Usage:
 *   npm run properties              # fetch and write the JSON
 *   npm run properties -- --limit 500
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/properties.generated.json");
const ENDPOINT = "https://overpass-api.de/api/interpreter";

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg !== -1 ? Number(args[limitArg + 1]) : 400;

// Commercial/mixed-use buildings plus generic offices and retail landuse.
const QUERY = `
[out:json][timeout:120];
area["name"="Oahu"]["boundary"="administrative"]->.a;
(
  way["building"~"^(commercial|retail|office|industrial|warehouse|hotel|supermarket|mall)$"](area.a);
  way["landuse"="commercial"](area.a);
  way["shop"="mall"](area.a);
);
out center tags ${LIMIT};
`;

/** OSM tags -> the UI's coarse property types. */
const TYPE_MAP = {
  mall: "retail",
  supermarket: "retail",
  retail: "retail",
  commercial: "mixed",
  office: "office",
  industrial: "industrial",
  warehouse: "industrial",
  hotel: "hospitality",
};

/** Rough neighborhood lookup so results group the way the site talks about the island. */
const AREAS = [
  ["Kapolei", 21.3356, -158.0817],
  ["Ewa Beach", 21.3156, -158.0072],
  ["Waikele", 21.4006, -158.0075],
  ["Waipahu", 21.3867, -158.0094],
  ["Wahiawa", 21.5028, -158.0247],
  ["Mililani", 21.45, -158.0153],
  ["Pearl City", 21.3969, -157.9753],
  ["Aiea", 21.3822, -157.9331],
  ["Honolulu", 21.3069, -157.8583],
  ["Waikiki", 21.2793, -157.8292],
  ["Manoa", 21.3167, -157.8],
  ["Hawaii Kai", 21.2975, -157.7],
  ["Kailua", 21.4022, -157.7394],
  ["Kaneohe", 21.4186, -157.8036],
  ["Laie", 21.6486, -157.9253],
  ["Haleiwa", 21.5928, -158.1036],
  ["Waialua", 21.5753, -158.1317],
  ["North Shore", 21.68, -158.05],
  ["Kahala", 21.2697, -157.7767],
  ["Kaimuki", 21.2833, -157.8],
  ["Aina Haina", 21.2864, -157.7461],
  ["Mapunapuna", 21.3361, -157.9047],
];

const distance = (aLat, aLng, bLat, bLng) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

const nearestArea = (lat, lng) =>
  AREAS.reduce((best, entry) =>
    distance(lat, lng, entry[1], entry[2]) < distance(lat, lng, best[1], best[2]) ? entry : best,
  )[0];

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function main() {
  console.log(`Querying Overpass for up to ${LIMIT} commercial buildings on O'ahu...`);

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "oahu-wash-report/1.0 (property finder seed; contact: site owner)",
    },
    body: new URLSearchParams({ data: QUERY }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Overpass responded ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const elements = Array.isArray(payload.elements) ? payload.elements : [];
  if (elements.length === 0) {
    throw new Error("Overpass returned no elements — check the query or try again later.");
  }

  const listings = elements
    .map((element) => {
      const lat = element.center?.lat ?? element.lat;
      const lng = element.center?.lon ?? element.lon;
      const tags = element.tags ?? {};
      const name = tags.name ?? tags["addr:housenumber"] ?? null;
      if (!name || typeof lat !== "number" || typeof lng !== "number") return null;

      const type =
        TYPE_MAP[tags.building] ?? TYPE_MAP[tags.shop] ?? (tags.office ? "office" : "mixed");

      return {
        id: `osm-${element.type}-${element.id}`,
        name,
        type,
        area: nearestArea(lat, lng),
        address:
          [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ") || undefined,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        source: "osm",
        url: `https://www.openstreetmap.org/${element.type}/${element.id}`,
      };
    })
    .filter(Boolean)
    // De-duplicate repetitive names (parking structures, chains) by name+area.
    .filter((listing, index, all) => {
      const key = `${slug(listing.name)}|${listing.area}`;
      return all.findIndex((other) => `${slug(other.name)}|${other.area}` === key) === index;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  await writeFile(
    OUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "OpenStreetMap via Overpass API (ODbL 1.0)",
        listings,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const byType = listings.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Wrote ${listings.length} listings to ${path.relative(ROOT, OUT)}`);
  console.table(byType);
  console.log("Next: npm run verify");
}

main().catch((error) => {
  console.error(`\nFetch failed: ${error.message}`);
  console.error("The UI falls back to the seed listings, so nothing is broken.");
  process.exitCode = 1;
});
