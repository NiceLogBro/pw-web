/**
 * Stripe Checkout endpoint — reference implementation.
 *
 * This file is NOT bundled with the storefront (it needs a secret key, so it
 * must run on a server). Deploy it anywhere that runs Node 18+ serverless
 * functions — Vercel, Netlify, Cloudflare Workers, Supabase Edge Functions, or
 * a small Express server.
 *
 * ── Vercel (api/checkout.ts) ────────────────────────────────────────────────
 *   npm i stripe
 *   Set env: STRIPE_SECRET_KEY=sk_live_...
 *   Deploy, then in the frontend .env set:
 *     VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
 *     VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-app.vercel.app/api/checkout
 *
 * ── Cloudflare Workers ──────────────────────────────────────────────────────
 *   Replace `res.status(...).json(...)` with `Response.json(...)`.
 *
 * Security notes
 *  - Never trust prices from the browser. Re-price every line item against your
 *    own catalog (see `CATALOG` below — generated from src/data/catalog.ts).
 *  - Compute shipping and tax server-side.
 *  - Verify the webhook signature before marking orders paid.
 */

import Stripe from "stripe";

// Generated from src/data/catalog.ts — keep slugs and prices in sync.
const CATALOG: Record<string, { name: string; price: number; image: string }> = {
  "tidal-1800-electric-washer": { name: "Tidal 1800 Electric Pressure Washer", price: 22900, image: "/products/electric-washer.jpg" },
  "tidal-2600-pro-electric-washer": { name: "Tidal 2600 Pro Electric Pressure Washer", price: 39900, image: "/products/electric-washer.jpg" },
  "breaker-3400-gas-washer": { name: "Breaker 3400 Gas Pressure Washer", price: 71900, image: "/products/gas-washer.jpg" },
  "breaker-4200-contractor-washer": { name: "Breaker 4200 Contractor Pressure Washer", price: 114900, image: "/products/gas-washer.jpg" },
  "orbit-20-surface-cleaner": { name: 'Orbit 20" Rotary Surface Cleaner', price: 18900, image: "/products/surface-cleaner.jpg" },
  "orbit-15-surface-cleaner": { name: 'Orbit 15" Rotary Surface Cleaner', price: 12900, image: "/products/surface-cleaner.jpg" },
  "steel-flex-50-hose": { name: "Steel-Flex 50 ft High-Pressure Hose", price: 8900, image: "/products/hose-kit.jpg" },
  "steel-flex-25-hose": { name: "Steel-Flex 25 ft High-Pressure Hose", price: 5400, image: "/products/hose-kit.jpg" },
  "progrip-spray-gun": { name: "ProGrip Ergonomic Spray Gun", price: 5900, image: "/products/gun-wand.jpg" },
  "titan-36-wand": { name: 'Titan 36" Stainless Steel Wand', price: 6900, image: "/products/gun-wand.jpg" },
  "spectrum-5-nozzle-kit": { name: "Spectrum 5-Piece Nozzle Kit (4.0)", price: 2400, image: "/products/nozzle-kit.jpg" },
  "turbocore-rotating-nozzle": { name: "TurboCore Rotating Turbo Nozzle (4.0)", price: 3900, image: "/products/turbo-nozzle.jpg" },
  "soap-nozzle-pair": { name: "Low-Pressure Soap Nozzle Pair", price: 1400, image: "/products/nozzle-kit.jpg" },
  "axial-3000-replacement-pump": { name: "Axial Cam 3,000 PSI Replacement Pump", price: 10900, image: "/products/pump.jpg" },
  "triplex-4000-replacement-pump": { name: "Triplex Plunger 4,000 PSI Replacement Pump", price: 28900, image: "/products/pump.jpg" },
  "adjustable-unloader-valve": { name: "Adjustable Unloader Valve (4,500 PSI)", price: 4400, image: "/products/pump.jpg" },
  "concrete-rescue-oil-rust": { name: "ConcreteRescue Oil & Rust Remover (1 gal)", price: 3400, image: "/products/detergent.jpg" },
  "deckbrite-wood-cleaner": { name: "DeckBrite Wood & Composite Cleaner (1 gal)", price: 2900, image: "/products/detergent.jpg" },
  "surface-seal-concrete-sealer": { name: "SurfaceSeal Concrete Sealer (2 gal)", price: 7900, image: "/products/detergent.jpg" },
  "foam-fusion-cannon": { name: "FoamFusion Foam Cannon", price: 4400, image: "/products/foam-cannon.jpg" },
  "downstream-soap-injector": { name: "DownStream Soap Injector Kit", price: 3400, image: "/products/hose-kit.jpg" },
  "surface-cleaner-rebuild-kit": { name: "Surface Cleaner Rebuild Kit", price: 2900, image: "/products/surface-cleaner.jpg" },
};

const FREE_SHIPPING_OVER = 9900;
const FLAT_SHIPPING = 995;
const HI_GET = 0.04712;
const SITE = process.env.SITE_URL ?? "https://powerwashingoahu.com";

interface IncomingLine {
  quantity: number;
  price_data?: { product_data?: { metadata?: { slug?: string } } };
}

interface IncomingBody {
  line_items?: IncomingLine[];
  customer?: { email?: string; shipMethod?: string };
  success_url?: string;
  cancel_url?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return Response.json({ error: "STRIPE_SECRET_KEY is not configured" }, { status: 500 });
  }
  const stripe = new Stripe(secret, { apiVersion: "2025-10-29.clover" });

  let body: IncomingBody;
  try {
    body = (await req.json()) as IncomingBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lines = (body.line_items ?? [])
    .map((line) => {
      const slug = line.price_data?.product_data?.metadata?.slug;
      const item = slug ? CATALOG[slug] : undefined;
      const qty = Math.max(1, Math.min(12, Math.round(line.quantity ?? 1)));
      return item && slug ? { slug, item, qty } : null;
    })
    .filter((l): l is { slug: string; item: (typeof CATALOG)[string]; qty: number } => l !== null);

  if (lines.length === 0) {
    return Response.json({ error: "No valid line items" }, { status: 400 });
  }

  // Re-price server-side — never trust the browser's totals.
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const hasFreight = lines.some((l) => l.item.price >= 20000);
  const pickup = body.customer?.shipMethod === "pickup";
  const expedited = body.customer?.shipMethod === "expedited";

  let shippingAmount = 0;
  if (!hasFreight && !pickup) {
    shippingAmount = expedited ? 2495 : subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
  }
  const taxAmount = Math.round(subtotal * HI_GET);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lines.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: "usd",
      unit_amount: l.item.price,
      product_data: {
        name: l.item.name,
        images: [`${SITE}${l.item.image}`],
        metadata: { slug: l.slug },
      },
    },
  }));

  if (shippingAmount > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: shippingAmount,
        product_data: { name: expedited ? "Expedited shipping (next business day)" : "Standard shipping" },
      },
    });
  }

  if (taxAmount > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: taxAmount,
        product_data: { name: "Hawaii GET (est. 4.712%)" },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: body.customer?.email,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: pickup
        ? [{ shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 0, currency: "usd" }, display_name: "Local pickup · Kapolei" } }]
        : undefined,
      allow_promotion_codes: true,
      metadata: { ship_method: body.customer?.shipMethod ?? "standard" },
      success_url: body.success_url ?? `${SITE}/#/success`,
      cancel_url: body.cancel_url ?? `${SITE}/#/checkout`,
    });

    return Response.json({ id: session.id, url: session.url, amount_total: session.amount_total });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return Response.json({ error: message }, { status: 502 });
  }
}
