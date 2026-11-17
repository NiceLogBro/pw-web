# Bahama Blast — pressure washer accessory storefront

A dropshipping-style storefront for pressure-washer accessories: rotary surface
cleaners, foam cannons, turbo nozzles, telescoping wands and brass
quick-connect fittings. Built with Vite, React 19 and Tailwind CSS v4.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static bundle in dist/
```

## What's here

| Section | Purpose |
| --- | --- |
| Hero + promo strip | Offer, positioning, top-product quick add |
| Trust bar | Shipping, returns, warranty, support promises |
| Start here | Directs a first-time buyer to the right single purchase |
| Catalog | Filter by category and price, sort, 11 SKUs |
| Fit guide | Interactive PSI/GPM compatibility check per machine and job |
| Why us | Honest comparison against big-box and marketplace sellers |
| Bundles | Two real multi-SKU kits with photo collages of their contents |
| The Lab | Short how-to guides, each linked to the accessory it covers |
| Reviews / FAQ / Support | Social proof, objection handling, contact form |
| Cart drawer | Promo codes, free-shipping threshold, checkout flow |

## Architecture

```
src/
  data/products.ts      Catalog: 9 single SKUs + 2 bundles, with specs
  store/cart.tsx        Cart context: localStorage-backed, drawer + toast state
  components/           One file per page section, plus shared UI
  assets/               (unused) generated product photography lives in public/img
scripts/process_images.py  Normalises studio renders into uniform 900px tiles
public/img/              WebPs served by the site
```

### Cart

Cart state lives in `CartProvider` (`src/store/cart.tsx`), persists to
`localStorage` under `bahama-blast.cart.v1`, and exposes `add`, `setQty`,
`remove`, `clear` plus derived `subtotal`, `savings` and free-shipping status.
Quick adds from grids use `{ openDrawer: false }` so they toast instead of
yanking the reader into the drawer.

### Product photography

`public/img/src/` holds the raw studio renders; `scripts/process_images.py`
crops each to a square at a consistent fill ratio and tone-matches the backdrop
to one shared gradient so every catalog tile reads as the same photo shoot.
Run `python3 scripts/process_images.py` (needs Pillow + numpy) after adding
new renders. Bundles don't get a hero shot — `ProductImage` renders a collage
from the `gallery` array so a kit shows exactly what's in the box.

### Making it live

This is a front-end template; orders and the contact form are demos. To take
real money, point the cart's checkout at a processor:

1. **Shopify / Stripe Checkout** — create products and variants matching
   `src/data/products.ts`, then replace `placeOrder` in
   `src/components/CartDrawer.tsx` with a redirect to a checkout session.
2. **Dropshipping feeds** — if you ingest supplier feeds, map them into the
   `Product` type in `src/data/products.ts`; nothing else needs to change.
3. **Inventory** — `stock: "low" | "in"` drives the "Low stock" badge; swap it
   for live inventory counts when you have them.

Prices and specs are modelled on real 2026 retail ranges (15" rotary cleaners
$40–110, foam cannons $30–50, turbo nozzles $25–50, telescoping wands ~$120),
and reviews/orders are illustrative demo data.

## Accessibility & robustness notes

- Reveal animations are opt-in via a `.js` class on `<html>`, so content is
  visible without JavaScript, and each observer has a time-based failsafe.
- Dialogs trap nothing silently: only one dialog can be open at a time, Escape
  closes them, and body scroll is locked while they're open.
- `prefers-reduced-motion` disables animations and smooth scrolling.
- Product images carry fixed width/height to avoid layout shift.
