import { describe, expect, it } from "vitest";
import {
  PROPERTY_TYPES,
  SEED_LISTINGS,
  filterListings,
  listings,
  mapUrlFor,
  type PropertyType,
} from "@/data/properties";

/**
 * The finder ships a seed set until `npm run properties` runs. These assertions
 * keep the seed set honest (no invented coordinates) and keep the filter contract
 * used by PropertyFinder from rotting.
 */

const knownTypes = new Set<PropertyType>(PROPERTY_TYPES.map((entry) => entry.id));

describe("property data", () => {
  it("uses only declared property types", () => {
    for (const item of [...SEED_LISTINGS, ...listings]) {
      expect(knownTypes.has(item.type), `${item.name} has type ${item.type}`).toBe(true);
    }
  });

  it("never invents coordinates in the seed set", () => {
    // Address-level data must come from the Overpass fetch or a licensed feed.
    for (const item of SEED_LISTINGS) {
      expect(item.id).toMatch(/^seed-/);
      expect(item.lat).toBeUndefined();
      expect(item.lng).toBeUndefined();
      expect(item.address).toBeUndefined();
    }
  });

  it("has unique ids and non-empty names", () => {
    // `listings` falls back to SEED_LISTINGS when no generated data exists, so
    // check uniqueness within the set that is actually rendered.
    const ids = listings.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of listings) {
      expect(item.name.trim().length).toBeGreaterThan(0);
      expect(item.area.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps every area within the island's vocabulary", () => {
    // `area` is rendered as the location line, so it should read like a place.
    for (const item of listings) {
      expect(item.area).not.toMatch(/\d{3,}/);
    }
  });
});

describe("filterListings", () => {
  const all = SEED_LISTINGS;

  it("matches on name, area and address case-insensitively", () => {
    expect(filterListings(all, "ala moana", "all").map((i) => i.name)).toEqual([
      "Ala Moana Center",
      "Ala Moana Pacific Center",
    ]);
    expect(filterListings(all, "WAIKIKI", "all").length).toBe(2);
    expect(filterListings(all, "  kailua  ", "all").length).toBe(1);
  });

  it("filters by property type", () => {
    const hotels = filterListings(all, "", "hospitality");
    expect(hotels.length).toBeGreaterThan(0);
    expect(hotels.every((item) => item.type === "hospitality")).toBe(true);
  });

  it("combines query and type", () => {
    expect(filterListings(all, "kapolei", "retail").length).toBe(2);
    expect(filterListings(all, "kapolei", "office")).toEqual([]);
  });

  it("returns everything for an empty query with no type", () => {
    expect(filterListings(all, "", "all")).toHaveLength(all.length);
  });

  it("returns nothing for a non-matching query", () => {
    expect(filterListings(all, "zzzz-no-such-place", "all")).toEqual([]);
  });
});

describe("mapUrlFor", () => {
  it("prefers coordinates, then address, then nothing", () => {
    expect(
      mapUrlFor({
        id: "a",
        name: "A",
        type: "office",
        area: "Honolulu",
        source: "seed",
        lat: 21.3,
        lng: -157.8,
      }),
    ).toContain("21.3,-157.8");

    expect(
      mapUrlFor({
        id: "b",
        name: "B",
        type: "office",
        area: "Honolulu",
        source: "manual",
        address: "123 Main St",
      }),
    ).toContain("123%20Main%20St");

    expect(
      mapUrlFor({ id: "c", name: "C", type: "office", area: "Honolulu", source: "seed" }),
    ).toBeNull();
  });
});
