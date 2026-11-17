export type CategorySlug =
  | "machines"
  | "surface"
  | "hoses-wands"
  | "nozzles"
  | "pumps"
  | "chemicals"
  | "accessories";

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
  image: string;
}

export type Connection = "QC-3/8" | "QC-1/4" | "M22-14" | "M22-15" | "Axial cam" | "Triplex" | "None";

export interface Product {
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  category: CategorySlug;
  price: number; // integer cents
  compareAt?: number; // integer cents — strike-through reference price
  image: string;
  rating: number;
  reviews: number;
  blurb: string;
  description: string;
  bullets: string[];
  specs: { label: string; value: string }[];
  tags: string[];
  stock: "in-stock" | "low-stock" | "backorder";
  shipsIn: string;
  featured?: boolean;
  bestseller?: boolean;
  /** Used by the fitment checker. */
  requires?: {
    connection?: Connection;
    maxPsi?: number;
    pumpType?: "Axial cam" | "Triplex";
    note?: string;
  };
}

export const categories: Category[] = [
  {
    slug: "machines",
    name: "Pressure Washers",
    short: "Machines",
    blurb: "Electric for driveways and lanais, gas for contractor days.",
    image: "/products/electric-washer.jpg",
  },
  {
    slug: "pumps",
    name: "Pumps & Valves",
    short: "Pumps",
    blurb: "Direct-fit axial cam and triplex pumps, unloaders, relief valves.",
    image: "/products/pump.jpg",
  },
  {
    slug: "nozzles",
    name: "Nozzles & Tips",
    short: "Nozzles",
    blurb: "Color-coded tip kits, turbo tips, soap nozzles.",
    image: "/products/nozzle-kit.jpg",
  },
  {
    slug: "hoses-wands",
    name: "Hoses, Guns & Wands",
    short: "Hoses",
    blurb: "Steel-braid hose, ergonomic guns, stainless wands.",
    image: "/products/hose-kit.jpg",
  },
  {
    slug: "surface",
    name: "Surface Cleaners",
    short: "Surface",
    blurb: "Rotary cleaners that end zebra striping on concrete.",
    image: "/products/surface-cleaner.jpg",
  },
  {
    slug: "chemicals",
    name: "Chemicals & Sealers",
    short: "Chemicals",
    blurb: "Concrete, wood, roof and rust chemistry that actually works.",
    image: "/products/detergent.jpg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    short: "Accessories",
    blurb: "Foam cannons, injectors, and the small parts that save a job.",
    image: "/products/foam-cannon.jpg",
  },
];

export const products: Product[] = [
  /* ── Machines ─────────────────────────────────────────────────────── */
  {
    slug: "tidal-1800-electric-washer",
    name: "Tidal 1800 Electric Pressure Washer",
    shortName: "Tidal 1800",
    brand: "Tidal Works",
    category: "machines",
    price: 22900,
    compareAt: 27900,
    image: "/products/electric-washer.jpg",
    rating: 4.7,
    reviews: 412,
    blurb: "The driveway starter that doesn't feel like a toy. 1,800 PSI, quiet enough for a condo.",
    description:
      "Most sub-$250 electric washers give up on the second car. The Tidal 1800 runs a brass-headed axial cam pump, a steel-braided feed hose, and a wand that doesn't wobble after a season. It pulls from a 2-gallon bucket if you don't have a spigot, which matters on more O'ahu properties than you'd think.",
    bullets: [
      "1,800 PSI / 1.2 GPM — right for driveways, lanais, siding, and cars",
      "Brass-head axial cam pump with thermal relief valve",
      "Self-priming from a bucket or rain barrel",
      "20 ft steel-braid hose + ProGrip-style gun and 4 tips",
      "Two-year residential warranty, US service center",
    ],
    specs: [
      { label: "Pressure", value: "1,800 PSI" },
      { label: "Flow", value: "1.2 GPM" },
      { label: "Motor", value: "13 amp / 120V" },
      { label: "Pump", value: "Axial cam, brass head" },
      { label: "Connection", value: "M22-14 machine · QC-3/8 gun" },
      { label: "Weight", value: "26 lb" },
    ],
    tags: ["electric", "driveway", "home", "1800-psi"],
    stock: "in-stock",
    shipsIn: "Ships in 1–2 business days",
    featured: true,
    bestseller: true,
    requires: { connection: "M22-14", pumpType: "Axial cam", maxPsi: 2000 },
  },
  {
    slug: "tidal-2600-pro-electric-washer",
    name: "Tidal 2600 Pro Electric Pressure Washer",
    shortName: "Tidal 2600 Pro",
    brand: "Tidal Works",
    category: "machines",
    price: 39900,
    image: "/products/electric-washer.jpg",
    rating: 4.8,
    reviews: 188,
    blurb: "Condo-friendly power with contractor-grade hose. The best all-rounder for island homes.",
    description:
      "For most O'ahu homes this is the sweet spot: enough pressure to cut a year of red dirt off concrete, but no gasoline, no carburetor, no HOA complaints. Ships with the same steel-braid hose we sell separately at $89.",
    bullets: [
      "2,600 PSI / 1.6 GPM with 30 ft steel-braid hose",
      "Brass pump head, total-stop gun, 5-piece tip kit included",
      "Runs off a standard 20A dedicated outlet",
      "Folds flat for a 14 in storage footprint",
      "Three-year residential warranty",
    ],
    specs: [
      { label: "Pressure", value: "2,600 PSI" },
      { label: "Flow", value: "1.6 GPM" },
      { label: "Motor", value: "15 amp / 120V, dedicated circuit" },
      { label: "Pump", value: "Axial cam, brass head" },
      { label: "Connection", value: "M22-14 machine · QC-3/8 gun" },
      { label: "Weight", value: "38 lb" },
    ],
    tags: ["electric", "driveway", "siding", "2600-psi", "pro"],
    stock: "in-stock",
    shipsIn: "Ships in 1–2 business days",
    featured: true,
    requires: { connection: "M22-14", pumpType: "Axial cam", maxPsi: 2800 },
  },
  {
    slug: "breaker-3400-gas-washer",
    name: "Breaker 3400 Gas Pressure Washer",
    shortName: "Breaker 3400",
    brand: "Breaker Power",
    category: "machines",
    price: 71900,
    compareAt: 84900,
    image: "/products/gas-washer.jpg",
    rating: 4.9,
    reviews: 96,
    blurb: "Honda-powered, 3,400 PSI, and built for people who wash for a living.",
    description:
      "A horizontal-shaft Honda GX200 driving a triplex plunger pump, on a welded cart that doesn't flex. This is the machine we hand to crews doing three driveways before lunch. Ships ground freight; ETA 4–7 business days.",
    bullets: [
      "Honda GX200 OHV engine, low-oil shutdown",
      "3,400 PSI / 2.6 GPM triplex plunger pump",
      "50 ft braided hose, 4.0 nozzles, pro gun and wand",
      "Welded steel cart with 12 in pneumatic wheels",
      "Two-year commercial warranty",
    ],
    specs: [
      { label: "Pressure", value: "3,400 PSI" },
      { label: "Flow", value: "2.6 GPM" },
      { label: "Engine", value: "Honda GX200 (196cc)" },
      { label: "Pump", value: "Triplex plunger, brass head" },
      { label: "Connection", value: "QC-3/8 outlet · 3/4 in garden inlet" },
      { label: "Weight", value: "96 lb" },
    ],
    tags: ["gas", "contractor", "3400-psi", "honda"],
    stock: "in-stock",
    shipsIn: "Free ground freight · 4–7 business days",
    featured: true,
    bestseller: true,
    requires: { connection: "QC-3/8", pumpType: "Triplex", maxPsi: 3600 },
  },
  {
    slug: "breaker-4200-contractor-washer",
    name: "Breaker 4200 Contractor Pressure Washer",
    shortName: "Breaker 4200",
    brand: "Breaker Power",
    category: "machines",
    price: 114900,
    image: "/products/gas-washer.jpg",
    rating: 4.8,
    reviews: 41,
    blurb: "4,200 PSI for hood cleaning, fleet washing, and hauling rust off anything.",
    description:
      "The big gun. Triplex pump with ceramic plungers, belt drive, and a 1 in steel frame that survives a truck bed. If you're quoting commercial work on O'ahu, this is the pressure those jobs actually require.",
    bullets: [
      "4,200 PSI / 4.0 GPM belt-drive triplex pump",
      "Ceramic plungers and stainless valves",
      "50 ft 2-wire hose rated to 6,000 PSI",
      "Downstream injector plumbed in from the factory",
      "Two-year commercial warranty",
    ],
    specs: [
      { label: "Pressure", value: "4,200 PSI" },
      { label: "Flow", value: "4.0 GPM" },
      { label: "Engine", value: "Honda GX390 (389cc)" },
      { label: "Pump", value: "Belt-drive triplex, ceramic plungers" },
      { label: "Connection", value: "QC-3/8 outlet" },
      { label: "Weight", value: "187 lb" },
    ],
    tags: ["gas", "contractor", "commercial", "4200-psi"],
    stock: "low-stock",
    shipsIn: "Free ground freight · 4–7 business days",
    requires: { connection: "QC-3/8", pumpType: "Triplex", maxPsi: 4500 },
  },

  /* ── Surface cleaners ─────────────────────────────────────────────── */
  {
    slug: "orbit-20-surface-cleaner",
    name: 'Orbit 20" Rotary Surface Cleaner',
    shortName: "Orbit 20",
    brand: "Orbit Surface",
    category: "surface",
    price: 18900,
    compareAt: 21900,
    image: "/products/surface-cleaner.jpg",
    rating: 4.9,
    reviews: 263,
    blurb: "The single upgrade that makes concrete look professionally done. No stripes, no wand arms.",
    description:
      "Two counter-rotating jets under a 20-inch shroud, on four casters, with a swivel that doesn't leak after month three. Cuts driveway time by roughly half and removes the zebra striping that hand-wanding always leaves behind.",
    bullets: [
      "20 in cleaning width, 4,000 PSI rated",
      "Twin counter-rotating stainless spray bars",
      "Rebuildable swivel with replaceable seals",
      "Casters and a kickstand for easy storage",
      "Works with any QC-3/8 gun",
    ],
    specs: [
      { label: "Width", value: "20 in" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Min flow", value: "3.0 GPM for best results" },
      { label: "Connection", value: "QC-3/8 gun" },
      { label: "Wheels", value: "4 × 2 in casters" },
      { label: "Weight", value: "18 lb" },
    ],
    tags: ["surface", "concrete", "driveway", "4000-psi"],
    stock: "in-stock",
    shipsIn: "Ships in 1–2 business days",
    featured: true,
    bestseller: true,
    requires: { connection: "QC-3/8", maxPsi: 4000 },
  },
  {
    slug: "orbit-15-surface-cleaner",
    name: 'Orbit 15" Rotary Surface Cleaner',
    shortName: "Orbit 15",
    brand: "Orbit Surface",
    category: "surface",
    price: 12900,
    image: "/products/surface-cleaner.jpg",
    rating: 4.6,
    reviews: 154,
    blurb: "A 15-inch deck that suits 1,800–2,600 PSI electrics without bogging down.",
    description:
      "A 20-inch cleaner on a 1.6 GPM electric washer starves and leaves snail trails. The Orbit 15 is sized for those machines: less width, faster travel, cleaner finish.",
    bullets: [
      "15 in cleaning width, 3,200 PSI rated",
      "Twin rotating jets, poly shroud",
      "3 × 1.5 in casters plus a stability brush",
      "Best match for 1,800–2,600 PSI electrics",
    ],
    specs: [
      { label: "Width", value: "15 in" },
      { label: "Max pressure", value: "3,200 PSI" },
      { label: "Min flow", value: "1.4 GPM" },
      { label: "Connection", value: "QC-3/8 gun" },
      { label: "Weight", value: "11 lb" },
    ],
    tags: ["surface", "electric", "concrete", "3200-psi"],
    stock: "in-stock",
    shipsIn: "Ships in 1–2 business days",
    requires: { connection: "QC-3/8", maxPsi: 3200 },
  },

  /* ── Hoses, guns, wands ───────────────────────────────────────────── */
  {
    slug: "steel-flex-50-hose",
    name: "Steel-Flex 50 ft High-Pressure Hose",
    shortName: "Steel-Flex 50",
    brand: "Steel-Flex",
    category: "hoses-wands",
    price: 8900,
    compareAt: 10900,
    image: "/products/hose-kit.jpg",
    rating: 4.8,
    reviews: 327,
    blurb: "The hose that stops kinking at the worst moment. 4,000 PSI, 3/8 in, both ends QC.",
    description:
      "Single-wire steel braid under a polyurethane jacket, with crimped brass couplers that don't weep. Flexible down to 20°F and rated for hot-water rigs — which matters if you ever run a burner.",
    bullets: [
      "50 ft × 3/8 in, 4,000 PSI working pressure",
      "Single-wire steel braid, PU jacket, bend restrictors",
      "3/8 in quick-connect couplers, brass, crimped",
      "Rated for hot water up to 195°F",
    ],
    specs: [
      { label: "Length", value: "50 ft" },
      { label: "Inner diameter", value: "3/8 in" },
      { label: "Working pressure", value: "4,000 PSI" },
      { label: "Burst pressure", value: "16,000 PSI" },
      { label: "Connection", value: "QC-3/8 both ends" },
      { label: "Weight", value: "7 lb" },
    ],
    tags: ["hose", "4000-psi", "replacement"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    bestseller: true,
    requires: { connection: "QC-3/8", maxPsi: 4000 },
  },
  {
    slug: "steel-flex-25-hose",
    name: "Steel-Flex 25 ft High-Pressure Hose",
    shortName: "Steel-Flex 25",
    brand: "Steel-Flex",
    category: "hoses-wands",
    price: 5400,
    image: "/products/hose-kit.jpg",
    rating: 4.7,
    reviews: 142,
    blurb: "A short hose for upstairs lanais and tight parking structures.",
    description:
      "Same construction as the 50 ft, cut to 25 ft for jobs where a long hose is a liability — condos, lanais, elevator-adjacent garages.",
    bullets: [
      "25 ft × 3/8 in, 4,000 PSI working pressure",
      "Single-wire steel braid, PU jacket",
      "QC-3/8 couplers both ends",
    ],
    specs: [
      { label: "Length", value: "25 ft" },
      { label: "Inner diameter", value: "3/8 in" },
      { label: "Working pressure", value: "4,000 PSI" },
      { label: "Connection", value: "QC-3/8 both ends" },
      { label: "Weight", value: "4 lb" },
    ],
    tags: ["hose", "4000-psi"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    requires: { connection: "QC-3/8", maxPsi: 4000 },
  },
  {
    slug: "progrip-spray-gun",
    name: "ProGrip Ergonomic Spray Gun",
    shortName: "ProGrip Gun",
    brand: "ProGrip",
    category: "hoses-wands",
    price: 5900,
    image: "/products/gun-wand.jpg",
    rating: 4.8,
    reviews: 219,
    blurb: "Molded grip, brass internals, and a trigger that doesn't fight you for four hours.",
    description:
      "Replacement guns ship with plastic internals and fail at the trigger pin. This one runs brass seats and a stainless spring, with a swivel inlet so the hose stops fighting your wrist.",
    bullets: [
      "4,000 PSI rated, brass internals",
      "Swivel QC-3/8 inlet, QC-3/8 outlet",
      "Molded overmold grip with lock-off safety",
      "Drop-tested to 6 ft on concrete",
    ],
    specs: [
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Inlet", value: "QC-3/8 swivel" },
      { label: "Outlet", value: "QC-3/8" },
      { label: "Weight", value: "1.4 lb" },
    ],
    tags: ["gun", "wand", "4000-psi"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    requires: { connection: "QC-3/8", maxPsi: 4000 },
  },
  {
    slug: "titan-36-wand",
    name: 'Titan 36" Stainless Steel Wand',
    shortName: "Titan 36",
    brand: "ProGrip",
    category: "hoses-wands",
    price: 6900,
    compareAt: 7900,
    image: "/products/gun-wand.jpg",
    rating: 4.7,
    reviews: 88,
    blurb: "Stainless tube, insulated grip, threaded nozzle end that takes standard tips.",
    description:
      "A 36-inch wand keeps your knuckles out of the splash zone and reaches under eaves without a ladder. Stainless tube, replaceable grip, standard 1/4 in threaded nozzle port.",
    bullets: [
      "36 in stainless tube with insulated grip",
      "1/4 in threaded nozzle port — takes standard tips",
      "QC-3/8 inlet socket",
      "Replaceable grip and coupler",
    ],
    specs: [
      { label: "Length", value: "36 in" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Inlet", value: "QC-3/8" },
      { label: "Nozzle port", value: "1/4 in NPT" },
      { label: "Weight", value: "1.9 lb" },
    ],
    tags: ["wand", "4000-psi"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
  },

  /* ── Nozzles ──────────────────────────────────────────────────────── */
  {
    slug: "spectrum-5-nozzle-kit",
    name: "Spectrum 5-Piece Nozzle Kit (4.0)",
    shortName: "Spectrum 5-Kit",
    brand: "Spectrum",
    category: "nozzles",
    price: 2400,
    compareAt: 3200,
    image: "/products/nozzle-kit.jpg",
    rating: 4.9,
    reviews: 604,
    blurb: "The color-coded set every machine should have shipped with. Stainless, 4.0 orifice.",
    description:
      "Stainless steel tips in the standard color language — red 0°, yellow 15°, green 25°, white 40°, black soap. Sized at 4.0 orifice for 3–4 GPM gas machines; we also stock 3.0 for electrics.",
    bullets: [
      "Stainless steel inserts, not brass",
      "1/4 in quick-connect base",
      "Color-coded collars: 0°, 15°, 25°, 40°, soap",
      "4.0 orifice — sized for 3.0–4.0 GPM",
    ],
    specs: [
      { label: "Pieces", value: "5" },
      { label: "Orifice", value: "4.0" },
      { label: "Connection", value: "QC-1/4" },
      { label: "Material", value: "Stainless insert, nylon collar" },
    ],
    tags: ["nozzle", "tips", "kit"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    bestseller: true,
    requires: { connection: "QC-1/4" },
  },
  {
    slug: "turbocore-rotating-nozzle",
    name: "TurboCore Rotating Turbo Nozzle (4.0)",
    shortName: "TurboCore",
    brand: "Spectrum",
    category: "nozzles",
    price: 3900,
    image: "/products/turbo-nozzle.jpg",
    rating: 4.7,
    reviews: 276,
    blurb: "Zero-degree cutting power with a 25-degree footprint. Strips gum, rust, and paint fast.",
    description:
      "A ceramic core spins a zero-degree jet through a cone, giving you the cutting power of a red tip without the gouging. The go-to for gum, tire marks, and prepping concrete for sealer.",
    bullets: [
      "Ceramic rotating core, 4,000 PSI rated",
      "25° effective spray pattern",
      "4.0 orifice for 3–4 GPM machines",
      "Replaceable ceramic cartridge",
    ],
    specs: [
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Pattern", value: "25° effective" },
      { label: "Orifice", value: "4.0" },
      { label: "Connection", value: "QC-1/4" },
    ],
    tags: ["nozzle", "turbo", "concrete"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    requires: { connection: "QC-1/4", maxPsi: 4000 },
  },
  {
    slug: "soap-nozzle-pair",
    name: "Low-Pressure Soap Nozzle Pair",
    shortName: "Soap Nozzles",
    brand: "Spectrum",
    category: "nozzles",
    price: 1400,
    image: "/products/nozzle-kit.jpg",
    rating: 4.6,
    reviews: 71,
    blurb: "Replacement black tips sized for downstream injectors.",
    description:
      "Downstream injectors need a large-orifice tip to create the venturi draw. These are the correct black soap nozzles for 3–4 GPM machines, sold in pairs because you will lose one.",
    bullets: [
      "Large-orifice soap tips, sold in pairs",
      "QC-1/4 base",
      "Correct draw rate for downstream injectors",
    ],
    specs: [
      { label: "Pieces", value: "2" },
      { label: "Orifice", value: "6.5" },
      { label: "Connection", value: "QC-1/4" },
    ],
    tags: ["nozzle", "soap", "tips"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    requires: { connection: "QC-1/4" },
  },

  /* ── Pumps & valves ───────────────────────────────────────────────── */
  {
    slug: "axial-3000-replacement-pump",
    name: "Axial Cam 3,000 PSI Replacement Pump",
    shortName: "Axial 3,000",
    brand: "Steel-Flex",
    category: "pumps",
    price: 10900,
    compareAt: 13900,
    image: "/products/pump.jpg",
    rating: 4.6,
    reviews: 193,
    blurb: "The direct-fit fix for a frozen pump. Brass head, thermal relief, standard bolt pattern.",
    description:
      "Nine times out of ten a dead electric washer is a dead pump — usually from a freeze or a 20-minute run with the trigger closed. This is the standard 7/8 in shaft, 4-bolt pattern replacement that fits most 2,600–3,000 PSI consumer electrics.",
    bullets: [
      "3,000 PSI / 2.5 GPM axial cam",
      "Brass head, ceramic plungers",
      "7/8 in hollow shaft, standard 4-bolt flange",
      "Thermal relief valve and detergent injector included",
      "Pre-filled with pump oil",
    ],
    specs: [
      { label: "Max pressure", value: "3,000 PSI" },
      { label: "Max flow", value: "2.5 GPM" },
      { label: "Shaft", value: "7/8 in hollow" },
      { label: "Inlet / outlet", value: "M22-14 both" },
      { label: "Weight", value: "7 lb" },
    ],
    tags: ["pump", "axial", "repair"],
    stock: "in-stock",
    shipsIn: "Ships in 1–2 business days",
    requires: { pumpType: "Axial cam", connection: "M22-14", maxPsi: 3000 },
  },
  {
    slug: "triplex-4000-replacement-pump",
    name: "Triplex Plunger 4,000 PSI Replacement Pump",
    shortName: "Triplex 4,000",
    brand: "Breaker Power",
    category: "pumps",
    price: 28900,
    image: "/products/pump.jpg",
    rating: 4.8,
    reviews: 57,
    blurb: "Ceramic plungers, stainless valves, 1 in solid shaft. The long-haul replacement.",
    description:
      "For gas machines doing commercial hours, a triplex pump outlasts an axial cam by years. Solid 1 in shaft, 24 mm bolt pattern, and service kits available for every wear part.",
    bullets: [
      "4,000 PSI / 4.0 GPM triplex",
      "Ceramic plungers, stainless valves and seats",
      "1 in solid keyed shaft, 24 mm flange",
      "Rebuild kit stocked — not a throwaway",
      "Ships pre-oiled",
    ],
    specs: [
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Max flow", value: "4.0 GPM" },
      { label: "Shaft", value: "1 in solid, keyed" },
      { label: "Inlet / outlet", value: "1/2 in NPT / 3/8 in NPT" },
      { label: "Weight", value: "19 lb" },
    ],
    tags: ["pump", "triplex", "repair", "contractor"],
    stock: "low-stock",
    shipsIn: "Ships in 1–2 business days",
    requires: { pumpType: "Triplex", maxPsi: 4000 },
  },
  {
    slug: "adjustable-unloader-valve",
    name: "Adjustable Unloader Valve (4,500 PSI)",
    shortName: "Unloader Valve",
    brand: "Breaker Power",
    category: "pumps",
    price: 4400,
    image: "/products/pump.jpg",
    rating: 4.5,
    reviews: 64,
    blurb: "The $44 part that saves a $300 pump from running dry.",
    description:
      "When an unloader sticks, pressure creeps and the pump cooks itself. Replacing it takes ten minutes with a wrench. Brass body, 3/8 in NPT, adjustable from 1,500 to 4,500 PSI.",
    bullets: [
      "3/8 in NPT fittings, brass body",
      "Adjustable 1,500–4,500 PSI",
      "Fits most axial cam and triplex pumps",
      "Includes knob locknut",
    ],
    specs: [
      { label: "Max pressure", value: "4,500 PSI" },
      { label: "Fittings", value: "3/8 in NPT" },
      { label: "Material", value: "Brass" },
      { label: "Weight", value: "1 lb" },
    ],
    tags: ["valve", "repair", "pump"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
  },

  /* ── Chemicals ────────────────────────────────────────────────────── */
  {
    slug: "concrete-rescue-oil-rust",
    name: "ConcreteRescue Oil & Rust Remover (1 gal)",
    shortName: "ConcreteRescue",
    brand: "Island Chem",
    category: "chemicals",
    price: 3400,
    image: "/products/detergent.jpg",
    rating: 4.8,
    reviews: 341,
    blurb: "Red dirt, oil shadows, and irrigation rust — off concrete without etching it.",
    description:
      "O'ahu concrete takes a beating from red dirt and irrigation rust. This is an oxalic-acid blend sized for driveways: it lifts the stain, doesn't bleach the aggregate, and rinses clean with a garden hose after ten minutes.",
    bullets: [
      "1 gallon concentrate — makes 5 gallons working solution",
      "Lifts rust, irrigation staining, and oil shadows",
      "Safe on concrete, pavers, and rock walls",
      "Wet the surface first, dwell 5–10 minutes, rinse",
    ],
    specs: [
      { label: "Size", value: "1 gallon" },
      { label: "Dilution", value: "1:4 with water" },
      { label: "Coverage", value: "~400 sq ft" },
      { label: "Ships", value: "Ground only" },
    ],
    tags: ["chemical", "concrete", "rust", "stain"],
    stock: "in-stock",
    shipsIn: "Ground shipping only · 3–5 business days",
    bestseller: true,
  },
  {
    slug: "deckbrite-wood-cleaner",
    name: "DeckBrite Wood & Composite Cleaner (1 gal)",
    shortName: "DeckBrite",
    brand: "Island Chem",
    category: "chemicals",
    price: 2900,
    image: "/products/detergent.jpg",
    rating: 4.7,
    reviews: 158,
    blurb: "Restores gray, weathered decking without stripping it down to splinters.",
    description:
      "A sodium percarbonate cleaner that brightens instead of bleaching. Works on cedar, redwood, composite, and the painted decking on a thousand O'ahu lanais.",
    bullets: [
      "Oxygen-based — no chlorine smell, no bleaching",
      "1 gallon makes 4 gallons of solution",
      "Wood, composite, and vinyl siding safe",
      "Rinse with a 40° tip, not a turbo",
    ],
    specs: [
      { label: "Size", value: "1 gallon" },
      { label: "Dilution", value: "1:3 with warm water" },
      { label: "Coverage", value: "~300 sq ft" },
      { label: "Ships", value: "Ground only" },
    ],
    tags: ["chemical", "wood", "deck", "lanai"],
    stock: "in-stock",
    shipsIn: "Ground shipping only · 3–5 business days",
  },
  {
    slug: "surface-seal-concrete-sealer",
    name: "SurfaceSeal Concrete Sealer (2 gal)",
    shortName: "SurfaceSeal",
    brand: "Island Chem",
    category: "chemicals",
    price: 7900,
    image: "/products/detergent.jpg",
    rating: 4.6,
    reviews: 89,
    blurb: "Lock the clean in. Water-based, low-VOC, satin finish, no yellowing.",
    description:
      "Washing a driveway and skipping sealer means doing it again in a year. This is a water-based acrylic that keeps red dirt on the surface instead of in the pores. Applies with a pump sprayer or roller.",
    bullets: [
      "2 gallon pail covers ~500 sq ft, one coat",
      "Water-based, low VOC — safe near landscaping",
      "Satin finish, non-yellowing under UV",
      "Recoat every 18–24 months",
    ],
    specs: [
      { label: "Size", value: "2 gallons" },
      { label: "Coverage", value: "~500 sq ft / coat" },
      { label: "Finish", value: "Satin" },
      { label: "Ships", value: "Ground only" },
    ],
    tags: ["chemical", "sealer", "concrete"],
    stock: "in-stock",
    shipsIn: "Ground shipping only · 3–5 business days",
  },
  {
    slug: "foam-fusion-cannon",
    name: "FoamFusion Foam Cannon",
    shortName: "FoamFusion",
    brand: "ProGrip",
    category: "chemicals",
    price: 4400,
    compareAt: 5600,
    image: "/products/foam-cannon.jpg",
    rating: 4.8,
    reviews: 452,
    blurb: "Thick, clingy foam for cars, siding, and roofs. 1L bottle, QC-1/4 inlet.",
    description:
      "A properly sized orificed foam cannon is the difference between shaving-cream foam and watery spit. Adjustable fan and foam thickness, with a wide-mouth bottle that's easy to rinse.",
    bullets: [
      "1 L bottle with foam and fan adjustment",
      "QC-1/4 inlet, fits most guns",
      "Works with any pH-neutral snow foam or soap",
      "Wide-mouth bottle, rinse cap included",
    ],
    specs: [
      { label: "Capacity", value: "1 L" },
      { label: "Max pressure", value: "3,500 PSI" },
      { label: "Connection", value: "QC-1/4" },
      { label: "Weight", value: "1.6 lb" },
    ],
    tags: ["foam", "cannon", "soap", "car"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    featured: true,
    requires: { connection: "QC-1/4", maxPsi: 3500 },
  },

  /* ── Accessories ──────────────────────────────────────────────────── */
  {
    slug: "downstream-soap-injector",
    name: "DownStream Soap Injector Kit",
    shortName: "Soap Injector",
    brand: "Steel-Flex",
    category: "accessories",
    price: 3400,
    image: "/products/hose-kit.jpg",
    rating: 4.4,
    reviews: 118,
    blurb: "Draw chemical downstream in seconds. Includes 1/4 in metering tips.",
    description:
      "Clips inline between the pump and hose and uses venturi suction to draw soap or bleach. The kit ships with three metering tips so you can control the draw rate for detergent versus roof mix.",
    bullets: [
      "Inline QC-3/8 body",
      "1.8 mm, 2.1 mm, and 3.2 mm metering tips",
      "3/8 in clear suction hose with strainer",
      "Bleach-rated body and seals",
    ],
    specs: [
      { label: "Connection", value: "QC-3/8 inline" },
      { label: "Draw rate", value: "Adjustable, 3 tips" },
      { label: "Max pressure", value: "4,000 PSI" },
      { label: "Weight", value: "0.9 lb" },
    ],
    tags: ["injector", "soap", "accessory"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
    requires: { connection: "QC-3/8", maxPsi: 4000 },
  },
  {
    slug: "surface-cleaner-rebuild-kit",
    name: "Surface Cleaner Rebuild Kit",
    shortName: "Cleaner Rebuild",
    brand: "Orbit Surface",
    category: "accessories",
    price: 2900,
    image: "/products/surface-cleaner.jpg",
    rating: 4.5,
    reviews: 46,
    blurb: "Swivel seals, O-rings, and two nozzles — everything that wears out.",
    description:
      "Surface cleaners fail at the swivel, not the deck. This kit has the three seal sets, both spray nozzles, and the caster bolts to bring an Orbit 15 or 20 back to new.",
    bullets: [
      "Complete swivel seal set",
      "Two replacement spray nozzles",
      "Caster hardware and O-rings",
      "Fits Orbit 15 and Orbit 20",
    ],
    specs: [
      { label: "Fits", value: "Orbit 15 / Orbit 20" },
      { label: "Includes", value: "Seals, 2 nozzles, hardware" },
      { label: "Weight", value: "0.6 lb" },
    ],
    tags: ["repair", "surface", "kit"],
    stock: "in-stock",
    shipsIn: "Ships same business day",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const featuredProducts = products.filter((p) => p.featured);

export const bestsellers = products.filter((p) => p.bestseller);

/** Machine profiles used by the fitment checker. */
export interface MachineProfile {
  id: string;
  name: string;
  psi: number;
  gpm: number;
  pumpType: "Axial cam" | "Triplex";
  connection: Connection;
}

export const machineProfiles: MachineProfile[] = [
  { id: "tidal-1800", name: "Tidal 1800 Electric", psi: 1800, gpm: 1.2, pumpType: "Axial cam", connection: "M22-14" },
  { id: "tidal-2600", name: "Tidal 2600 Pro Electric", psi: 2600, gpm: 1.6, pumpType: "Axial cam", connection: "M22-14" },
  { id: "breaker-3400", name: "Breaker 3400 Gas", psi: 3400, gpm: 2.6, pumpType: "Triplex", connection: "QC-3/8" },
  { id: "breaker-4200", name: "Breaker 4200 Gas", psi: 4200, gpm: 4.0, pumpType: "Triplex", connection: "QC-3/8" },
  { id: "other-electric", name: "Another electric washer (≤3,000 PSI)", psi: 2800, gpm: 1.4, pumpType: "Axial cam", connection: "M22-14" },
  { id: "other-gas", name: "Another gas washer (≥3,000 PSI)", psi: 3200, gpm: 2.5, pumpType: "Triplex", connection: "QC-3/8" },
];

export interface FitmentResult {
  status: "fits" | "caution" | "no";
  headline: string;
  detail: string;
}

/** Deterministic compatibility check between a product and a machine profile. */
export function checkFitment(product: Product, machine: MachineProfile): FitmentResult {
  const req = product.requires;
  if (!req) {
    return {
      status: "fits",
      headline: "Fits most machines",
      detail: `${product.shortName} is universal and doesn't depend on your pump or gun connection.`,
    };
  }

  if (req.pumpType && req.pumpType !== machine.pumpType) {
    return {
      status: "no",
      headline: "Not a direct fit",
      detail: `This part is built for ${req.pumpType.toLowerCase()} pumps. Your ${machine.name} runs a ${machine.pumpType.toLowerCase()} pump — check the “Fits” notes or message us and we'll match the right SKU.`,
    };
  }

  if (req.connection && req.connection !== "None" && req.connection !== machine.connection) {
    return {
      status: "caution",
      headline: "Needs an adapter",
      detail: `Your ${machine.name} uses ${machine.connection}; this part is ${req.connection}. Add a $9 adapter and it works — or pick the matching version.`,
    };
  }

  if (req.maxPsi && machine.psi > req.maxPsi) {
    return {
      status: "caution",
      headline: "Pressure-limited",
      detail: `Rated to ${req.maxPsi.toLocaleString()} PSI and your machine makes ${machine.psi.toLocaleString()} PSI. It will hold, but you'll be shortening its life — go up a tier.`,
    };
  }

  return {
    status: "fits",
    headline: "Fits your machine",
    detail: `${req.connection ?? "Universal connection"} matches, and your ${machine.psi.toLocaleString()} PSI is within this part's ${(req.maxPsi ?? 4000).toLocaleString()} PSI rating.`,
  };
}
