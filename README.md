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

## Accessibility & motion

- `.reveal` animations only hide content when scripting is enabled
  (`@media (scripting: enabled)`), so a JS failure or a printout still shows text.
- `prefers-reduced-motion` disables marquees, droplet drift, shimmer and count-up
  animations.
- The FAQ uses `aria-controls` + `inert` so collapsed answers leave the
  accessibility tree.
- There is a skip link, and each nav landmark has a distinct accessible name.

## Deployment

The build is fully static. Publish `dist/` to any static host; `public/robots.txt`
and `public/sitemap.xml` are copied through. If the production URL changes, update
the canonical/OG URLs in `index.html`, `StructuredData.tsx`, and `public/sitemap.xml`.

## Editorial disclosure

The footer states the site is independent and uncompensated. Every outbound link
and all photography point at the #1-ranked company, so that claim should be
reviewed by whoever owns the site before launch (see "Open items" in the last
review). Ranking copy is editorial opinion; verify licensing, insurance and
pricing with any contractor directly.
