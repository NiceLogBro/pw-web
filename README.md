# The O'ahu Wash Report

A single-page, editorial comparison of five power washing companies on O'ahu
(2026). Built with React 19, Vite 7 and Tailwind CSS 4.

The page ranks companies with a weighted scorecard, explains the methodology,
shows project photography, and ends with a call to action for the #1 pick.

## Quick start

```bash
npm ci          # install exact locked dependencies
npm run dev     # http://localhost:5173
```

## Scripts

| Script                 | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Vite dev server with HMR                                         |
| `npm run build`        | Typecheck, then production build into `dist/`                    |
| `npm run build:single` | Typecheck, then a fully inlined single `index.html` (see below)  |
| `npm run preview`      | Serve the production build locally                               |
| `npm run typecheck`    | `tsc --noEmit` (strict, no unused locals/params)                 |
| `npm run lint`         | Prettier check                                                   |
| `npm run format`       | Prettier write                                                   |
| `npm test`             | Vitest: data-integrity and content assertions                    |
| `npm run photos`       | Regenerate responsive photo derivatives + `src/assets/photos.ts` |
| `npm run verify`       | typecheck → lint → test → build (same as CI)                     |

## Project layout

```
src/
  App.tsx                 page composition + error boundary + skip link
  components/             one file per page section; ui.tsx holds shared primitives
  data/companies.ts       THE SOURCE OF TRUTH for rankings, criteria, copy, FAQ
  assets/photos/          committed WebP images (3 widths each)
  assets/photos.ts        generated manifest consumed by components
scripts/
  optimize-photos.mjs     regenerates photo derivatives + manifest
```

## Where the ranking comes from

`src/data/companies.ts` holds a `breakdown` matrix: six criteria, a weight per
criterion (they must total 100), and a 1–10 value per company.

Everything else is **derived** from it at module load:

- `company.score` — weighted total, to one decimal
- `company.rank` — position by weighted score (never hand-edited)
- `verdicts` — per-company prose, including live scores and category-win counts
- `criteria[0]` — the "overall score" row of the head-to-head table
- `faqs` — score/rank references are interpolated, not typed

To change a ranking, edit `breakdown` (and the descriptive strings alongside it),
then run `npm test`. The tests assert that ranks match computed scores, that
prose agrees with the matrix, and that every `services[].img` key exists in the
photo manifest — so a stale hardcoded number fails CI instead of shipping.

> **Note** — `companies` entries still carry placeholder `rank: 0` / `score: 0`
> in the source. Those are overwritten at import time; the tests are what
> guarantee the derived values are consistent.

## Photography

Images are committed WebP derivatives under `src/assets/photos/` at 480/900/≤1400
px. `scripts/optimize-photos.mjs` (requires `sharp`, a devDependency) reads the
widest file per photo, emits the smaller variants, and rewrites
`src/assets/photos.ts` with static imports so Vite hashes and emits each file as
a separately cacheable asset.

Components render them through `<Photo>` (`src/components/ui.tsx`), which sets
`srcSet`, `sizes` and intrinsic `width`/`height`.

Do **not** inline photos as base64 data URIs: that was the previous approach and
it produced a 3.7 MB HTML document with no lazy loading and no image caching.

### Single-file builds

`viteSingleFile()` is only enabled under `--mode singlefile`
(`npm run build:single`). It is useful for embedding or emailing the page, but it
re-inlines every image and stylesheet, so the whole document must download before
first paint. CI asserts the default build stays small.

## Commercial property finder

The **Properties** section lists commercial buildings on O'ahu with search and a
property-type filter. Two data paths, in this order:

1. **`VITE_LOOPLINK_URL` set** → `LoopLinkEmbed` renders the licensed
   CoStar/LoopNet widget instead of the local list.
2. **Otherwise** → the local dataset from `src/data/properties.ts`.

### About LoopLink

LoopLink is a hosted, paid search widget from CoStar/LoopNet — **not an API**.
There is no public LoopNet/CoStar API, no developer portal, and their terms
prohibit automated access, so there is nothing to `npm install` and nothing to
scrape. Access means CoStar provisions a host for you, e.g.
`https://yourfirm.looplink.com/SearchResults`, which displays **your company's**
listings.

#### Configuring it (no rebuild needed)

The URL is resolved at runtime, in this order:

| 1 | `?looplink=<url>` on any page URL | instant test, works in production |
| 2 | `<meta name="looplink-url" content="…">` in `index.html` | set once, change post-deploy |
| 3 | `VITE_LOOPLINK_URL` in `.env.local` | build-time default |

So to try a URL right now — dev or deployed — just append it:

```
https://your-domain.com/?looplink=https://yourfirm.looplink.com/SearchResults#properties
```

Paste that and you will see either the widget or a **LoopLink setup check** panel
in the bottom-right. The panel reports the resolved URL, whether the frame
painted, your `origin`, and a `curl` that prints the response headers. Remove
`?looplink=` to hide it. Once CoStar confirms the host, put it in the `<meta>`
tag so it applies to every visitor.

#### Expected first failure: framing is blocked

LoopLink sends `X-Frame-Options` / `Content-Security-Policy: frame-ancestors` and
only allows hosts registered in your account's **website allowlist**. An
unregistered origin renders an empty box with _no_ error event, which is why the
component probes after load and shows a notice rather than a blank rectangle.

If the panel says `refused`, the fix is on CoStar's side: give them the exact
`origin` the panel prints (e.g. `https://powerwashingoahu.com`, and any preview
domain you test from) and ask them to add it to the allowlist. The `curl`
command reveals the header they need to change.

#### Other things to check with them

- **Which domain is registered?** `www` vs apex are different origins.
- **Is a SSL/HTTPS URL available?** A plain `http://` host will be blocked as
  mixed content on an HTTPS page.
- **Does the account have listings?** The widget renders _your_ availabilities;
  with none it will look empty even when framing works.
- **Any per-domain or traffic limits** in the agreement.

#### Analytics and lead attribution (there is no affiliate program)

LoopNet/CoStar has **no affiliate or referral program** and pays no commission; the
only identifier they hand you is the embed itself. So what this repo measures is
_lead attribution_ — which outbound destination a visitor reached:

| Event             | Fires when                       | Params                                  |
| ----------------- | -------------------------------- | --------------------------------------- |
| `looplink_view`   | the embed is mounted in viewport | `url`                                   |
| `looplink_event`  | the widget posts an interaction  | `widget_event`                          |
| `outbound_click`  | any external link is clicked     | `link_domain`, `link_label`, `link_url` |
| `quote_click`     | phone/email CTA is clicked       | `channel`, `label`                      |
| `property_search` | reserved for finder queries      | —                                       |

Delivery (`src/utils/analytics.ts`): fires GA4 `gtag` if the property owner has
installed it, and **always** dispatches a DOM `site:analytics` CustomEvent, so GTM,
Plausible or any other tool can subscribe without touching call sites:

```js
window.addEventListener("site:analytics", (e) => console.log(e.detail));
```

Outbound links use `OutboundLink` (`src/components/OutboundLink.tsx`), which renders
a plain `<a>` — no behaviour or a11y change, just instrumentation.

If you ever agree a referral/lead-gen deal with the broker, `outbound_click` and
`quote_click` counts are the numbers it would be settled on. Any `?ref=` code you
append to `powerwashingoahu.com` is **yours**, not a CoStar-issued affiliate code.

#### Listening to the widget

LoopLink's install code is the iframe plus a small script that posts messages to
the parent — content height (`PAGE_HEIGHT_CHANGE`) and interaction events. Both are
handled in `LoopLinkEmbed` and **origin-checked**: only messages whose origin matches
the embedded URL are trusted, never `"*"` (a permissive listener would let any framed
origin resize your page and forge analytics). `readIframeHeight` also clamps to
400–20000px.

Privacy note: an iframe is third-party content. Disclose it in your privacy
policy and gate it behind consent if you target EU/UK. It is also not indexed as
your page's markup, so it adds nothing to SEO. The frame is scroll-gated with
reserved height (no CLS cost) and sandboxed to what a search UI needs.

### The local dataset

`npm run properties` queries the Overpass API for commercial/retail/office/
industrial/hotel buildings on O'ahu and writes geocoded records
(`lat`/`lng`, address when tagged, nearest neighborhood). Data is
**© OpenStreetMap contributors, ODbL 1.0** — keep the attribution that
`PropertyFinder` renders.

Until the script is run, `SEED_LISTINGS` provides 20 real O'ahu commercial
property _names_ with **no addresses or coordinates** (those are never invented).
The finder labels this state in the UI. No map library or tile server is used —
"View on map" is a Google Maps deep link.

## Accessibility & motion

- `.reveal` animations only hide content when scripting is enabled
  (`@media (scripting: enabled)`), so a JS failure or a printout still shows text.
- `prefers-reduced-motion` disables marquees, droplet drift, shimmer and count-up
  animations.
- The FAQ uses `aria-controls` + `inert` so collapsed answers leave the
  accessibility tree.
- There is a skip link, and each nav landmark has a distinct accessible name.
- The property finder announces result counts via `aria-live` and every input has
  a real `<label>`.

## Deployment

The build is fully static. Publish `dist/` to any static host; `public/robots.txt`,
`public/sitemap.xml` and any configured LoopLink embed are copied through. If the production URL changes, update
the canonical/OG URLs in `index.html`, `StructuredData.tsx`, and `public/sitemap.xml`.

## Editorial disclosure

The footer states the site is independent and uncompensated. Every outbound link
and all photography point at the #1-ranked company, so that claim should be
reviewed by whoever owns the site before launch (see "Open items" in the last
review). Ranking copy is editorial opinion; verify licensing, insurance and
pricing with any contractor directly.
