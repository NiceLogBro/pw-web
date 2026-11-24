# Tool Guys Power Washing — 10 Facebook Ad Creatives

Vertical 9:16 video ads built for [powerwashingoahu.com](https://powerwashingoahu.com), ready to
upload to Facebook / Instagram Reels, Stories and Advantage+ placements.

| | |
|---|---|
| **Format** | 1080 × 1920 (9:16), H.264 High, 30 fps, AAC 192 kbps |
| **Length** | 11.7 – 16.2 s (avg 13.8 s) · ~7 MB each |
| **Loudness** | −14.1 LUFS integrated, −1.5 dBTP (matches Meta's normalisation) |
| **Captions** | Burned in **and** supplied as `.srt` |
| **Music + VO** | Original synthesised bed + professional voiceover, ducked under speech |

---

## 1. What's in the folder

```
ads/
  videos/      10 finished .mp4 files (upload these)
  posters/     2 stills per ad — "-hook" for thumbnails, base for feed images
  captions/    matching .srt files (only needed if you re-cut without burned-in text)
  audio/vo/     the raw voiceover per ad (for re-edits)
  creative-brief.md   hooks, primary text, headlines, audience + testing plan
  README.md           this file
```

Tools that produced them live in `tools/ads/` (see *Re-rendering* at the bottom) — every
creative is a data file, so a new ad is ~20 lines.

---

## 2. The 10 ads

| # | File | Hook | Plays to | Best used for |
|---|---|---|---|---|
| 1 | `01-red-dirt.mp4` | "Oʻahu red dirt doesn't rinse off" | The island-specific pain every homeowner recognises | **Cold traffic / prospecting** |
| 2 | `02-driveway.mp4` | "The first thing they see" | Curb appeal, driveway before/after | **Best all-rounder** — start here |
| 3 | `03-roof-algae.mp4` | "Black streaks on your roof?" | Roof algae, shingle damage, soft wash | Cold + retarget Services visitors |
| 4 | `04-commercial.mp4` | "They judge your parking lot" | Property managers, HOAs, retail | **B2B audience** (not homeowners) |
| 5 | `05-soft-wash.mp4` | "4000 PSI can wreck a house" | Objection: "won't pressure washing damage my paint?" | Retargeting / consideration |
| 6 | `06-oil-stain.mp4` | "Oil stain in the stall?" | Stain lifting + runoff capture | Commercial + HOA |
| 7 | `07-lanai-small-jobs.mp4` | "The small jobs nobody wants" | Lanais, walkways, garage floors | Filling schedule gaps |
| 8 | `08-malama-aina.mp4` | "Every gallon we capture" | Water reclaim, protecting the ocean | Brand / shares (lowest direct response) |
| 9 | `09-five-star-local.mp4` | "5 stars. Locally owned." | Social proof, "your neighbors use us" | **Warm retargeting** |
| 10 | `10-booking-this-week.mp4` | "Booking this week" | Scarcity, west-side schedule | Only when the calendar actually has room |

Every ad uses **real job photos from your own site** plus the AI b-roll that ships in
`rdy-pwr-wash (3).zip`, the Tool Guys shark logo, and your brand palette
(teal `#17A08A`, mint `#5FD3BC`, gold `#F5B93F`).

---

## 3. Upload settings that matter

* **Placements:** Facebook Feed, Instagram Reels, Stories, Advantage+ — all are 9:16 native.
* **Thumbnail:** use `posters/<name>-hook.jpg`.
* **Primary text / headline:** take them from `creative-brief.md` (10 headline options, 10
  primary-text options, and the recommended pairing per ad).
* **Keep the voiceover** — it's mixed to be intelligible on phone speakers, but every ad also
  reads perfectly with the sound off (burned-in kinetic captions).
* **Don't add a second text overlay in Ads Manager** — the top ~13 % and bottom ~20 % of the
  frame are deliberately clear of the Meta UI, and all key copy sits inside the safe area.
* **Duration** is under 16 s on every ad, so all of them qualify for Reels/Feed optimisation
  without trimming.

## 4. Testing plan (start here)

1. **Week 1 — angle test.** Run ads 1, 2, 3, 5, 9 as five separate ad sets at equal budget,
   same audience (Oʻahu, 25–65, homeowners + 5 km radius of recent job areas). Goal: purchase
   of a *quote request*, not just clicks. Keep the winner's hook, kill the rest.
2. **Week 2 — proof test.** Best hook vs. the same hook with ad 9's social-proof framing.
3. **Week 3 — offer test.** Winner + ad 10 with a "free quote this week" CTA.
4. **Separately:** ad 4 and 6 into a property-manager audience, ad 8 only for retargeting
   site visitors (it builds trust, it doesn't sell hard).

Track *thumbstop ratio* (3-second video plays ÷ impressions) first: below ~25 % means the hook
frame needs work, not the offer.

---

## 5. Re-rendering / editing

```bash
python3 -m pip install --target work/pylibs pillow numpy imageio-ffmpeg
python3 -m tools.ads.prepare_assets          # unpack photos from the site zip
PYTHONPATH=work/pylibs:. python3 -m tools.ads.build                # all 10
PYTHONPATH=work/pylibs:. python3 -m tools.ads.build --only 3,7     # just those two
PYTHONPATH=work/pylibs:. python3 -m tools.ads.build --only 2 --stills 1.0,4.5   # quick stills
```

* Copy, shots, badges and pacing live in `tools/ads/ads.py` — `[[double brackets]]` mark the
  word that renders inside the gold block.
* Voiceover text lives in `tools/ads/scripts.py` **and** must match
  `ads/audio/vo/*.mp3`. If you change a script, regenerate that VO file (or re-record) —
  timings are derived from it.
* A full render is ~2 minutes per ad on 2 cores.

### Things to check before spending money

* The **"5.0 on Google"** and **"since 2020"** badges are from your own site copy — confirm
  they're current.
* Ad 10 promises this week's availability — only schedule it when true.
* Music is original (generated by `tools/ads/audio.py`) so there are no licensing claims.
  Voiceover is synthetic; if you'd rather use a real crew member's voice, drop new files into
  `ads/audio/vo/` with the same names and re-render.
* Photos are your own jobs, so no model releases are needed for the properties shown — but
  check with the client before running the identifiable-crew shots (`crew`, `garage`,
  `09`, `08`) in paid media.
