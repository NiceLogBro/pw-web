/**
 * Catalog data.
 *
 * Specs and price bands are modelled on what these accessory classes actually
 * sell for at big-box retail in 2026 (15" rotary cleaners $40–110, foam
 * cannons $30–50, turbo nozzles $25–50, telescoping wands ~$120, 50 ft hoses
 * $60–90). Product names here are Bahama Blast house brands, so nothing is
 * presented as another retailer's SKU.
 */

export type CategoryId =
  | "surface-cleaners"
  | "nozzles-tips"
  | "wands-reach"
  | "foam-cannon"
  | "hoses-fittings"
  | "kits";

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
};

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: CategoryId;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  image: string;
  blurb: string;
  bullets: string[];
  specs: { label: string; value: string }[];
  badges?: string[];
  bestFor: string;
  shipsIn: string;
  /**
   * Compatibility shorthand shown on the PDP: which machines the accessory
   * is designed to fit.
   */
  fits: ("electric" | "gas" | "pro" | "hot-water")[];
  stock: "in" | "low";
};

export const categories: Category[] = [
  {
    id: "surface-cleaners",
    name: "Surface cleaners",
    blurb: "Rotary decks that clean flatwork 4× faster than a wand.",
  },
  {
    id: "nozzles-tips",
    name: "Nozzles & tips",
    blurb: "Color-coded tips, turbo nozzles and pressure-matched orifices.",
  },
  {
    id: "wands-reach",
    name: "Wands & reach",
    blurb: "Extension and telescoping wands, gutters, undercarriage.",
  },
  {
    id: "foam-cannon",
    name: "Foam & chemistry",
    blurb: "Cannons, soap and additives for a clean that actually dwells.",
  },
  {
    id: "hoses-fittings",
    name: "Hoses & fittings",
    blurb: "Non-marking hose, brass quick-connects, strainers.",
  },
  {
    id: "kits",
    name: "Starter kits",
    blurb: "Bundle systems that save 10–20% versus buying separately.",
  },
];

export const products: Product[] = [
  {
    id: "rotary-15",
    name: "The Rotary 15",
    tagline: "15-inch stainless surface cleaner",
    category: "surface-cleaners",
    price: 79,
    compareAt: 99,
    rating: 4.9,
    reviews: 1284,
    image: "/img/p-surface-cleaner-15.webp",
    bestFor: "Driveways, patios, sidewalks",
    shipsIn: "Free 2-day",
    blurb:
      "Four wheels, twin spinner jets and a brushed stainless deck. At 3,000 PSI it strips a year of dirt off a driveway in about 15 minutes — no zebra stripes, no lap marks left by a wand.",
    bullets: [
      "Beats a 25-degree tip on flatwork by roughly 4× on square footage per minute",
      "Twin counter-rotating jets cancel each other's pull, so it tracks straight",
      "Replaceable 40-degree ceramic-core nozzles (spare pair included)",
      "Brass 1/4\" quick-connect plug drops onto any standard wand",
      "Non-marking polyurethane casters won't scuff a stained driveway",
    ],
    specs: [
      { label: "Cleaning width", value: "15 in (38 cm)" },
      { label: "Max pressure", value: "3,000 PSI" },
      { label: "Max flow", value: "2.8 GPM" },
      { label: "Water temp", value: "Cold water only" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Deck material", value: "Brushed 304 stainless" },
      { label: "Weight", value: "6.2 lb (2.8 kg)" },
    ],
    badges: ["Best seller", "Free spare nozzles"],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "monsoon-20",
    name: "Monsoon 20 Pro",
    tagline: "20-inch commercial surface cleaner",
    category: "surface-cleaners",
    price: 289,
    compareAt: 349,
    rating: 4.8,
    reviews: 214,
    image: "/img/p-surface-cleaner-20.webp",
    bestFor: "Full driveways, large patios, commercial flatwork",
    shipsIn: "Free 3-day",
    blurb:
      "The deck commercial crews run. Ten-inch pneumatic wheels roll over expansion joints, and a 20-inch swath means a 3-car driveway in two passes instead of six.",
    bullets: [
      "20-inch swath for high square footage — built for full-day use",
      "Pneumatic wheels roll over joints, hinges and uneven pavers",
      "T-handle grip keeps the deck from torquing on startup",
      "Rebuildable swivel union — service the spinner without replacing the deck",
      "Rated to 4,000 PSI / 3.5 GPM for gas and commercial machines",
    ],
    specs: [
      { label: "Cleaning width", value: "20 in (51 cm)" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Max flow", value: "3.5 GPM" },
      { label: "Water temp", value: "Cold water" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Deck material", value: "Powder-coated steel + stainless skirt" },
      { label: "Weight", value: "18 lb (8.2 kg)" },
    ],
    badges: ["Pro pick"],
    fits: ["gas", "pro"],
    stock: "low",
  },
  {
    id: "foam-cannon",
    name: "Soapworks 1L Foam Cannon",
    tagline: "Thick foam for cars, vinyl and soft wash",
    category: "foam-cannon",
    price: 36,
    compareAt: 45,
    rating: 4.8,
    reviews: 2140,
    image: "/img/p-foam-cannon.webp",
    bestFor: "Cars, trucks, vinyl siding, house pre-wash",
    shipsIn: "Free 2-day",
    blurb:
      "All-brass top end, wide-mouth 1-liter bottle, and a needle valve that actually holds it setting. Lay a blanket of foam thick enough to dwell — the dirt lifts before you touch the paint.",
    bullets: [
      "All-brass manifold and quick-connect — no plastic threads to crack",
      "Needle valve gives repeatable foam from wet snow to shaving cream",
      "Wide-mouth bottle rinses in seconds and takes a 1\" brush",
      "Two pickup tubes: short for everyday cars, long for the bottle's last ounce",
      "1/4\" quick-connect; also fits most aftermarket guns",
    ],
    specs: [
      { label: "Bottle capacity", value: "1.0 L (34 oz)" },
      { label: "Max pressure", value: "3,700 PSI" },
      { label: "Max flow", value: "5.3 GPM" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Body material", value: "Brass + PA66 nylon" },
      { label: "Dilution", value: "Adjustable needle valve" },
    ],
    badges: ["Best seller"],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "foam-2l-detail",
    name: "Detail 2L Foam Cannon",
    tagline: "High-output cannon for full-size trucks",
    category: "foam-cannon",
    price: 59,
    rating: 4.7,
    reviews: 486,
    image: "/img/p-foam-2l.webp",
    bestFor: "Full-size trucks, vans, boat hulls",
    shipsIn: "Free 2-day",
    blurb:
      "Same brass core as the Soapworks, with double the reservoir for a full-size truck without a refill. Includes a 1/4-turn metering head.",
    bullets: [
      "2.0 L bottle foams two full-size vehicles per fill",
      "Stainless steel pickup tube resists corrosion from heavy chems",
      "Wide foam fan at high pressure with a 1/4-turn metering head",
      "Fits standard 1/4\" quick-connect and most pressure-washer guns",
      "Thick-walled bottle survives being dropped off a tailgate",
    ],
    specs: [
      { label: "Bottle capacity", value: "2.0 L (68 oz)" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Max flow", value: "5.5 GPM" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Body material", value: "Brass + stainless" },
      { label: "Dilution", value: "Adjustable metering head" },
    ],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "turbo-nozzle",
    name: "Cyclone Turbo Nozzle",
    tagline: "Rotating zero-degree jet, 4,000 PSI",
    category: "nozzles-tips",
    price: 34,
    compareAt: 42,
    rating: 4.8,
    reviews: 1621,
    image: "/img/p-turbo-nozzle.webp",
    bestFor: "Concrete, brick, grills, stubborn stains",
    shipsIn: "Free 2-day",
    blurb:
      "A zero-degree jet that spins 3,000 times a minute. You get the bite of a pinpoint tip without the wand-chatter — and it leaves an even stripe instead of a gouge.",
    bullets: [
      "Rotating 0° jet combines pinpoint force with a consistent swath",
      "Stainless steel body with a replaceable ceramic core",
      "Rubber bumper protects the tip and your car when you drop it",
      "Anodized collar color-codes it against your other tips",
      "1/4\" brass quick-connect plug",
    ],
    specs: [
      { label: "Orifice", value: "3.0 (approx. 3,000 PSI @ 2.0 GPM)" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Max flow", value: "4.0 GPM" },
      { label: "Spray angle", value: "0° rotating" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Body material", value: "Stainless + ceramic core" },
    ],
    badges: ["Best seller"],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "nozzle-tips-5",
    name: "The Color Code 5-Pack",
    tagline: "0°, 15°, 25°, 40° and soap tips",
    category: "nozzles-tips",
    price: 22,
    rating: 4.9,
    reviews: 3120,
    image: "/img/p-nozzle-tips.webp",
    bestFor: "Every machine, every job",
    shipsIn: "Free 2-day",
    blurb:
      "The five tips that cover basically everything: red for concrete and nothing else, yellow and green for general work, white for delicate surfaces, black for soap.",
    bullets: [
      "Color-coded hardened stainless tips with brass quick-connect bases",
      "0° red — rust, paint, stubborn concrete stains",
      "15° yellow — concrete, brick and hard surfaces",
      "25° green — wood, siding, fences at a safer angle",
      "40° white — windows, screens; black — soap injection",
    ],
    specs: [
      { label: "Includes", value: "0°, 15°, 25°, 40°, soap" },
      { label: "Orifice", value: "3.0 (2,500–3,200 PSI class)" },
      { label: "Max pressure", value: "3,500 PSI" },
      { label: "Material", value: "Hardened stainless + brass" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
    ],
    badges: ["Best value"],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "telescoping-18",
    name: "Skyreach 18 Telescoping Wand",
    tagline: "18 ft reach for second-story siding",
    category: "wands-reach",
    price: 129,
    compareAt: 159,
    rating: 4.7,
    reviews: 632,
    image: "/img/p-telescoping-wand.webp",
    bestFor: "Two-story siding, soffits, gutters without a ladder",
    shipsIn: "Free 3-day",
    blurb:
      "Wash the second story from the lawn. Locks at any length to 18 feet, with a shoulder harness that takes the moment off your wrists instead of your back.",
    bullets: [
      "Reaches 18 ft locked — second-story siding from the ground",
      "Four-piece aluminum pole with positive twist-lock collars",
      "Padded shoulder harness carries the moment, not your wrists",
      "Ergonomic trigger gun with a safety detent",
      "Includes 0°, 15° and 25° tips and 1/4\" quick-connect adapters",
    ],
    specs: [
      { label: "Reach", value: "18 ft (5.5 m) extended · 5 ft collapsed" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Pole material", value: "T6 aluminum, graphite finish" },
      { label: "Includes", value: "Harness, 3 tips, 2 adapters" },
      { label: "Connection", value: '1/4 in quick-connect' },
    ],
    badges: ["Pro pick"],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "extension-wand-2pc",
    name: "Reach 2-Piece Wand Set",
    tagline: "Straight + 45° curved extension",
    category: "wands-reach",
    price: 39,
    compareAt: 49,
    rating: 4.6,
    reviews: 908,
    image: "/img/p-extension-wand.webp",
    bestFor: "Soffits, wheel wells, roof edges, gutters",
    shipsIn: "Free 2-day",
    blurb:
      "Two stainless extensions that clip together — 38 inches of extra reach in one, and a 45-degree bend in the other for getting under a fascia or inside a wheel well.",
    bullets: [
      "Fits between your gun and any 1/4\" quick-connect accessory",
      "Stainless tube with a knurled grip that doesn't slip when wet",
      "45° bend reaches under soffits and into wheel wells",
      "Brass couplers on both ends, both sexes",
      "Adds ~38 in of standoff to keep your hands out of the spray",
    ],
    specs: [
      { label: "Length", value: "19 in straight + 19 in curved" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Material", value: "304 stainless, TPR grip" },
      { label: "Connection", value: '1/4 in quick-connect both ends' },
    ],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "undercarriage-cleaner",
    name: "Underbody 16 Cleaner",
    tagline: "Rolling water broom for vehicle undercarriages",
    category: "wands-reach",
    price: 45,
    compareAt: 55,
    rating: 4.7,
    reviews: 741,
    image: "/img/p-undercarriage-cleaner.webp",
    bestFor: "Salt, road grime, mud and beach sand under vehicles",
    shipsIn: "Free 2-day",
    blurb:
      "Four jets on a castered bar that rolls under a car and blasts the salt and sand nobody sees. Cheapest rust insurance for a vehicle that gets driven on the coast.",
    bullets: [
      "Four brass jets angled down and back flush the rockers and frame",
      "Two swivel casters roll under low vehicles",
      "Three-piece straight wand stays dry where you hold it",
      "1/4\" quick-connect; works with electric machines from 1,500 PSI",
      "Also earns its keep on trailers, mowers and ATVs",
    ],
    specs: [
      { label: "Bar width", value: "16 in (41 cm)" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Wand", value: "3-piece, 36 in total" },
      { label: "Connection", value: '1/4 in brass quick-connect' },
      { label: "Material", value: "Stainless bar, brass jets" },
    ],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "gutter-cleaner",
    name: "Gutter Flush Kit",
    tagline: "Clean gutters from the ground",
    category: "wands-reach",
    price: 32,
    rating: 4.6,
    reviews: 519,
    image: "/img/p-gutter-cleaner.webp",
    bestFor: "Clogged downspouts and leaf-filled gutters",
    shipsIn: "Free 2-day",
    blurb:
      "A curved wand head that sweeps a gutter channel from the ground, plus four 1/4\" nozzles in different angles for downspouts and tight runs.",
    bullets: [
      "Curved aluminum head rides the gutter channel",
      "Four stainless tips for downspouts, corners and tight runs",
      "Attach to any extension wand to work from the ground",
      "Rated to 4,000 PSI",
      "Includes a 1/4\" male adapter for older wands",
    ],
    specs: [
      { label: "Reach", value: "Curved head + 4 tips" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Material", value: "Aluminum + stainless" },
      { label: "Connection", value: '1/4 in quick-connect' },
    ],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "hose-50",
    name: "Hose 50 Non-Marking",
    tagline: "50 ft steel-braided high-pressure hose",
    category: "hoses-fittings",
    price: 69,
    compareAt: 85,
    rating: 4.8,
    reviews: 1102,
    image: "/img/p-hose-50.webp",
    bestFor: "Replacing a short factory hose",
    shipsIn: "Free 2-day",
    blurb:
      "Fifty feet of steel-braided, non-marking hose with brass quick-connects on both ends. Reaches the back fence without dragging the machine through the petunias.",
    bullets: [
      "50 ft of 1/4\" steel-braided rubber rated to 4,000 PSI",
      "Non-marking cover won't leave black scuffs on concrete",
      "Brass 1/4\" quick-connect male/female ends, swivel both sides",
      "Flexible in cold weather — coils flat, no kinks to fight",
      "Burst-tested to 2× working pressure",
    ],
    specs: [
      { label: "Length", value: "50 ft (15.2 m)" },
      { label: "Inner diameter", value: "1/4 in" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Burst pressure", value: "8,000 PSI" },
      { label: "Connection", value: "Brass 1/4 in QC, both ends" },
      { label: "Temperature", value: "Up to 140 °F" },
    ],
    badges: ["Best seller"],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "qc-kit",
    name: "Brass Quick-Connect Kit",
    tagline: "5-piece adapter set",
    category: "hoses-fittings",
    price: 19,
    rating: 4.7,
    reviews: 1544,
    image: "/img/p-quick-connect-kit.webp",
    bestFor: "Mismatched threads and rubber-washer fittings",
    shipsIn: "Free 2-day",
    blurb:
      "The fix for the mystery fitting on the bottom of your machine. M22, 3/8\" and 1/4\" adapters in solid brass that won't round off after a season.",
    bullets: [
      "Five solid-brass pieces: 2 plugs, 2 couplers, 1 M22 adapter",
      "Turns any M22 or 3/8\" machine into a 1/4\" quick-connect system",
      "Precision-machined collars — no wobble, no leaks",
      "Stainless balls and springs rated for 4,000+ PSI",
      "Includes spare O-rings and thread tape",
    ],
    specs: [
      { label: "Includes", value: "5 brass adapters" },
      { label: "Threads covered", value: "M22-14, 3/8\", 1/4\"" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Material", value: "Nickel-plated solid brass" },
    ],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "pump-guard",
    name: "Pump Guard + Surface Soap",
    tagline: "Chemistry that protects the gear",
    category: "foam-cannon",
    price: 27,
    rating: 4.6,
    reviews: 388,
    image: "/img/p-pump-guard.webp",
    bestFor: "Hard-water scale and a weekly driveway wash",
    shipsIn: "Free 2-day",
    blurb:
      "One bottle stops hard-water scale in the pump, the other breaks down tire shine and road film. The two things that make an accessory last past one season.",
    bullets: [
      "Pump Guard absorbs calcium so scale can't glaze the pistons",
      "Surface Soap is a high-foam, low-residue cleaner for concrete and vinyl",
      "1 oz Pump Guard per 4 gallons — about 25 washes per bottle",
      "Phosphate-free and safe on plants once diluted",
      "Surface Soap dilutes 1:8 in a foam cannon",
    ],
    specs: [
      { label: "Includes", value: "32 oz Pump Guard + 32 oz Surface Soap" },
      { label: "Use", value: "Anti-scale + flatwork cleaner" },
      { label: "Dilution", value: "1:25 (guard) · 1:8 (soap)" },
      { label: "Volume", value: "2 × 32 fl oz" },
    ],
    fits: ["electric", "gas", "pro"],
    stock: "in",
  },
  {
    id: "starter-kit",
    name: "The Weekend Kit",
    tagline: "Surface cleaner + 5 tips + QC set",
    category: "kits",
    price: 99,
    compareAt: 120,
    rating: 4.9,
    reviews: 864,
    image: "/img/p-starter-kit.webp",
    bestFor: "First accessory order for a new machine",
    shipsIn: "Free 2-day",
    blurb:
      "Everything a new pressure washer is missing: the Rotary 15 deck, the Color Code 5-Pack and the Brass QC Kit — the exact three things people order in their first month anyway.",
    bullets: [
      "Saves $21 versus buying the three pieces separately",
      "Covers flatwork, delicate surfaces and stubborn stains",
      "Brass adapters make every piece work with every machine",
      "Ships in one box",
    ],
    specs: [
      { label: "Includes", value: "Rotary 15, 5-Pack tips, QC Kit" },
      { label: "Coverage", value: "Flatwork + general + chemistry" },
      { label: "Savings", value: "$21 vs. à la carte" },
    ],
    badges: ["Best value", "Save $21"],
    fits: ["electric", "gas"],
    stock: "in",
  },
  {
    id: "driveway-kit",
    name: "The Driveway Kit",
    tagline: "20\" pro deck + turbo + pump guard",
    category: "kits",
    price: 379,
    compareAt: 435,
    rating: 4.8,
    reviews: 173,
    image: "/img/p-driveway-kit.webp",
    bestFor: "Whole-driveway restoration, spring and fall",
    shipsIn: "Free 3-day",
    blurb:
      "The spring-clean package for a big driveway: the Monsoon 20 deck for the bulk of it, the Cyclone turbo for the stubborn rust and oil, and Pump Guard to keep the machine honest.",
    bullets: [
      "Saves $56 versus buying the components separately",
      "Everything needed for a full driveway restore in one order",
      "Deck rated for gas machines up to 4,000 PSI",
      "Pneumatic wheels roll over joints and edging",
    ],
    specs: [
      { label: "Includes", value: "Monsoon 20, Cyclone turbo, Pump Guard" },
      { label: "Best machine", value: "Gas, 2,800–4,000 PSI" },
      { label: "Savings", value: "$56 vs. à la carte" },
    ],
    badges: ["Save $56"],
    fits: ["gas", "pro"],
    stock: "low",
  },
];

export const byId = (id: string) => products.find((p) => p.id === id)!;

export const categoryName = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.name ?? id;

export const fitsLabel: Record<Product["fits"][number], string> = {
  electric: "Electric 1,500–3,000 PSI",
  gas: "Gas 2,500–4,000 PSI",
  pro: "Commercial / hot water",
  "hot-water": "Hot water rated",
};
