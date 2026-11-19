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

LoopLink is a hosted, paid widget from CoStar/LoopNet. **It is not an API**:
there is no public LoopNet/CoStar API, no developer portal, and no webhooks, and
CoStar's terms of service prohibit automated or programmatic access (which it has
actively litigated). So there is nothing to `npm install` and nothing to scrape.

To switch to LoopLink:

1. Sign up via LoopNet → Solutions → LoopLink for brokers and owners. It is
   sales-led; you will not get self-serve credentials.
2. They provision a host, e.g. `https://yourfirm.looplink.com/SearchResults`.
3. `cp .env.example .env.local` and set `VITE_LOOPLINK_URL` to that host.
4. Rebuild. `PropertyFinder` detects it and renders the widget.

Caveats once enabled: the widget is an iframe, so its content is not indexed as
your page's copy; it is third-party content, so disclose it in your privacy policy
(and gate on consent for EU/UK visitors); and if you add a CSP you must allow the
vendor host in `frame-src`. The embed is scroll-gated with reserved height so it
does not hurt CLS.

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
