/**
 * Storefront configuration.
 *
 * Everything a shop owner normally has to hand-tune lives here so it isn't
 * scattered through components.
 */

export const site = {
  name: "PowerWashingOahu",
  suffix: ".com",
  tagline: "O'ahu's pressure washing supply counter",
  phone: "(808) 555-0142",
  phoneHref: "tel:+18085550142",
  email: "orders@powerwashingoahu.com",
  emailHref: "mailto:orders@powerwashingoahu.com",
  address: "Kapolei, O'ahu, HI 96707",
  hours: "Mon–Sat · 7am–5pm HST",
  pickup: "Local pickup in Kapolei",
} as const;

export const shipping = {
  /** Cart subtotal (cents) at which shipping becomes free. */
  freeThreshold: 9900,
  flatRate: 995,
  /** Oversized freight items (washers) ship free over this subtotal instead. */
  freightNote: "Machines ship free via ground freight to any O'ahu or neighbor-island address.",
} as const;

export const tax = {
  /** Hawaii general excise tax, applied as an estimate at checkout. */
  rate: 0.04712,
  label: "HI GET (est.)",
} as const;

export const promises = [
  { title: "Ships free over $99", detail: "Flat $9.95 under that — no surprise handling fees." },
  { title: "2-day delivery to O'ahu", detail: "Ships from regional warehouses in CA, NV, and GA." },
  { title: "Real parts help", detail: "Text a photo of your pump and we'll match the SKU." },
  { title: "30-day fit guarantee", detail: "Wrong part? We cover return shipping, no restocking fee." },
] as const;
