# PowerWashingOahu.com — pressure washing store

A production-shaped storefront for a pressure-washing **supply + service** business on O'ahu:
machines, parts, chemicals, a product-level fitment checker, and a Stripe-ready checkout.

Built with React 19 + Vite 7 + Tailwind 4. No backend is required to run the demo — the
checkout runs in **demo mode** until Stripe keys are added.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # single-file production build in dist/
```

The build uses `vite-plugin-singlefile`, so `dist/index.html` is fully self-contained and can be
dropped on any static host. Product photos live in `public/products/` (served as separate files —
keep that folder next to `index.html` when deploying).

Routing is hash-based (`/#/shop`, `/#/product/<slug>`), which means deep links work on static
hosts with zero rewrite rules.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, category bento, machine lineup, tabbed product shelf, fitment pitch, reviews, service cross-sell |
| `/shop` | Full catalog with category / price / stock filters, search, sort (URL-synced, shareable) |
| `/product/:slug` | Gallery, buy box, live **"will this fit?"** checker, spec table, shipping tab, related items |
| `/fitment` | Full part finder: picks your machine, grades every part *fits / needs adapter / won't work* |
| `/checkout` | Address + delivery method + Stripe Checkout hand-off, sticky order summary |
| `/success` | Order confirmation (reads the order snapshot written at checkout) |
| `/service` | O'ahu wash service: published pricing, process, quote request form |
| `/support` | Shipping rates, returns & fit guarantee, warranty matrix, FAQ, privacy/terms |
| `/about` | Story, pillars, how the dropship fulfillment works |

## Store mechanics

- **Cart** — `src/store/cart.tsx`. Persists to `localStorage`, slide-over drawer, free-shipping
  meter, freight-item logic, quantity limits.
- **Catalog** — `src/data/catalog.ts`. 22 SKUs across 7 categories, each with specs, PSI/connection
  requirements, stock state, and shipping copy. Add a product by adding one object.
- **Fitment** — `checkFitment(product, machine)` in the same file. Compares quick-connect family,
  pump type, and PSI rating against six machine profiles. Powers both the product page widget and
  the `/fitment` page.
- **Money** — all prices are integer cents. Helpers in `src/lib/format.ts`.
- **Site config** — `src/lib/site.ts`: phone, email, address, free-shipping threshold, flat rate,
  Hawaii GET rate.

---

## Turning on real payments (Stripe)

The frontend is already shaped for Stripe Checkout. Nothing in the UI needs to change.

1. **Deploy the endpoint** — `server/stripe-checkout.ts` is a ready reference (Vercel / Workers /
   Supabase Edge). It re-prices every line against the server-side catalog instead of trusting the
   browser, and applies the same shipping + GET rules as the client.
2. **Deploy the webhook** — `server/stripe-webhook.ts` verifies the signature, then calls
   `placeSupplierOrder()` — the hook where your dropship supplier order goes.
3. **Set env vars** in the storefront:

   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-api.example.com/checkout
   VITE_SITE_URL=https://powerwashingoahu.com
   ```

4. Redeploy. `createCheckoutSession()` (`src/lib/stripe.ts`) sees both keys, POSTs the cart, and
   redirects to the Stripe-hosted page. Without them it falls back to a demo session so the whole
   flow stays testable.

> Never put `sk_live_...` in a `VITE_` variable — those get inlined into the browser bundle.

---

## Dropshipping notes

- `supplier` data isn't hardcoded: `src/data/catalog.ts` is the single source of truth, so a CSV
  import can generate it.
- Everything currently ships from "regional US warehouses". If you start holding fast movers in
  Kapolei, add a per-product `shipFrom` field and split the shipping logic in `cart.tsx`
  (`totals`), plus mirror it in `server/stripe-checkout.ts`.
- Chemicals and gas machines are flagged ground-only in the product copy; if you add real carrier
  rules, gate those SKUs out of expedited shipping in `Checkout.tsx` (`shipMethod === "expedited"`
  already disables itself for freight items).

---

## Replace before going live

- `src/lib/site.ts` — phone, email, hours, address (currently placeholder `(808) 555-0142`).
- Product photos in `public/products/` — AI-generated studio shots, safe as placeholders but swap in
  your supplier's real photos (check their usage rights).
- Copy: reviews and order counts are illustrative.
- Add real analytics + a privacy policy page if you collect emails.
