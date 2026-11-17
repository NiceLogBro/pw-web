# Launch checklist — PowerWashingOahu.com store

What's already built, what only you can fill in, and the order to do it in.

---

## 1. What ships in the box

| Piece | Where | Status |
|---|---|---|
| Storefront (10 routes) | `src/pages/`, `src/components/` | Built |
| Catalog — 22 SKUs, 7 categories, specs + fitment rules | `src/data/catalog.ts` | Built |
| Cart (persistent, drawer, free-ship meter, freight logic) | `src/store/cart.tsx` | Built |
| Fitment checker (product page + full `/fitment` page) | `src/data/catalog.ts` → `checkFitment` | Built |
| Checkout (address, delivery method, Stripe hand-off, demo fallback) | `src/pages/Checkout.tsx`, `src/lib/stripe.ts` | Built |
| Order confirmation | `src/pages/Success.tsx` | Built |
| Stripe session endpoint (server-side re-pricing) | `server/stripe-checkout.ts` | Reference — deploy it |
| Stripe webhook + dropship hook | `server/stripe-webhook.ts` | Reference — deploy it |
| Service page with quote form | `src/pages/Service.tsx` | Built (form is local-only) |
| Support / shipping / returns / warranty / FAQ | `src/pages/Support.tsx` | Built |

---

## 2. Before you take a single real order

- [ ] **Replace contact details** in `src/lib/site.ts` — phone, email, Kapolei address, hours.
      Everything in the UI reads from this file.
- [ ] **Swap product photos** in `public/products/`. Current images are AI studio renders — fine as
      placeholders, but your supplier's photos are the real product (check their usage rights).
- [ ] **Verify prices** against your supplier's live feed. All prices are in `src/data/catalog.ts`
      as integer cents, e.g. `price: 22900` = $229.00.
- [ ] **Confirm the tax treatment** with your accountant. `src/lib/site.ts` uses 4.712% Hawaii GET;
      the store currently shows it as an estimate and calculates the same way on the server.
- [ ] **Rewrite the reviews.** The testimonials and "2,100+ orders" figures are illustrative.
      Run a few real jobs, then quote real customers by name.
- [ ] **Write a real privacy policy** if you'll store emails (the `/support#privacy` block is a stub).

---

## 3. Stripe in about 30 minutes

1. Create a Stripe account → **Developers → API keys** → copy the **publishable** key (`pk_...`).
2. Deploy `server/stripe-checkout.ts` to Vercel (it's already a Fetch-style handler):
   ```bash
   mkdir -p api && cp server/stripe-checkout.ts api/checkout.ts
   npm i stripe && npx vercel deploy --prod
   ```
   Set `STRIPE_SECRET_KEY=sk_...` and `SITE_URL=https://powerwashingoahu.com` in Vercel.
3. Deploy `server/stripe-webhook.ts` to `api/webhook.ts`, then in Stripe add the endpoint
   `https://your-app.vercel.app/api/webhook` for `checkout.session.completed` and copy the
   signing secret into `STRIPE_WEBHOOK_SECRET`.
4. In the storefront's env:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_STRIPE_CHECKOUT_ENDPOINT=https://your-app.vercel.app/api/checkout
   VITE_SITE_URL=https://powerwashingoahu.com
   ```
5. Redeploy the store. Test with card `4242 4242 4242 4242` (Stripe test keys) before switching to
   live keys. The UI needs no changes — `createCheckoutSession()` detects the env vars.

> The server endpoint re-prices every line from its own catalog copy. If you edit prices, update
> `CATALOG` in `server/stripe-checkout.ts` too — or generate that file from `src/data/catalog.ts`.

---

## 4. Dropshipping setup

**Pick suppliers before products.** For pressure-washing gear, three tiers work:

1. **Parts & accessories** (nozzles, hose, guns, pumps) — low weight, high margin, easiest to dropship.
2. **Chemicals** — ground-only to Hawaii; confirm the supplier ships hazmat to the islands (many don't).
3. **Machines** — freight, higher return risk. Start with one or two gas models and one electric.

**Per-supplier checklist:**
- [ ] Wholesale/reseller account approved
- [ ] Confirm they ship to Hawaii (and at what rate/delay)
- [ ] API or CSV order feed? (many small suppliers want a weekly CSV email — that's fine)
- [ ] Blind shipping (their invoice not in the box) and whether they'll use your packing slip
- [ ] Stock feed frequency and backorder policy
- [ ] Return address and who pays return freight on fit errors

**Map supplier SKUs to this catalog.** Add a `supplier` object to each product in
`src/data/catalog.ts`:

```ts
supplier: { name: "Acme Parts Co", sku: "AP-NS5-40", cost: 1450, shipsFrom: "Ontario, CA" },
```

That gives you margin math (`price - cost`) and is what the webhook's `placeSupplierOrder()` reads.

---

## 5. Deployment

```bash
npm run build     # → dist/index.html (single file, ~126 KB gzipped)
```

Deploy `dist/` **plus** `public/products/` to any static host (Netlify, Vercel, Cloudflare Pages,
S3+CloudFront). Routing is hash-based, so no rewrite rules are needed — `/#/shop` and
`/#/product/steel-flex-50-hose` both work on a bare static host.

Assets referenced by the build are root-absolute (`/products/...`). If you host the site on a
subpath (e.g. `example.com/store/`), move `public/products/` into a matching subfolder and prefix
the `image` fields in `src/data/catalog.ts`.

---

## 6. Nice-to-have after launch

- Email capture → follow-up sequence (the footer form is wired to a UI success state only).
- Real order storage (Airtable/Postgres) in the webhook instead of `console.log`.
- Product review capture (photo reviews convert extremely well in this niche).
- Local SEO pages: `/service/mililani`, `/service/kailua` with real job photos.
- Google Business Profile + a "power washing Oahu" landing page linked to the store.
