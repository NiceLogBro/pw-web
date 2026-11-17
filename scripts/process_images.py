#!/usr/bin/env python3
"""
Turn the generated source photography in public/img/src into web-ready assets.

Every product render comes back on a similar warm-grey studio sweep, but the
exact tone and aspect ratio drift between generations. Catalog tiles look
sloppy unless the product sits at roughly the same size on the same backdrop,
so this script:

  1. finds the subject, ignoring its soft contact shadow;
  2. crops a square centred on the subject at a fixed fill ratio (padding by
     edge replication where the render is too narrow) — no compositing, so
     the studio gradient and reflection stay continuous, no seams;
  3. matches each row of the backdrop to one shared gradient so the tiles read
     as one photo shoot.

Usage:  python3 scripts/process_images.py
"""

from __future__ import annotations

import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "public/img/src"
OUT = ROOT / "public/img"

TILE = 900
FILL = 0.78  # share of the tile the subject's longest side occupies
BACKDROP_TOP = np.array([243, 241, 236], dtype=np.float32)
BACKDROP_BOTTOM = np.array([226, 222, 214], dtype=np.float32)


def subject_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box of the product, excluding faint backdrop and shadows."""
    w, h = im.size
    small = im.resize((w // 4, h // 4), Image.NEAREST)
    a = np.asarray(small, dtype=np.float32)
    edge = np.concatenate([a[:, : max(2, a.shape[1] // 14)], a[:, -max(2, a.shape[1] // 14) :]], axis=1)
    row_ref = np.median(edge, axis=1)
    diff = np.abs(a - row_ref[:, None, :]).mean(axis=2)
    mask = diff > 16
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return (0, 0, w, h)
    x0, x1 = np.percentile(xs, 0.5) * 4, np.percentile(xs, 99.5) * 4
    y0, y1 = np.percentile(ys, 0.5) * 4, np.percentile(ys, 99.5) * 4
    return int(x0), int(y0), int(x1), int(y1)


def square_crop(im: Image.Image) -> Image.Image:
    """Square crop centred on the subject with consistent fill ratio."""
    x0, y0, x1, y1 = subject_bbox(im)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    side = max(x1 - x0, y1 - y0) / FILL
    left, top = int(round(cx - side / 2)), int(round(cy - side / 2))
    right, bottom = left + int(round(side)), top + int(round(side))

    a = np.asarray(im, dtype=np.float32)
    pad_l, pad_t = max(0, -left), max(0, -top)
    pad_r, pad_b = max(0, right - im.width), max(0, bottom - im.height)
    if pad_l or pad_t or pad_r or pad_b:
        # Extend with the outer rows/columns (always backdrop) to stay seamless.
        a = np.pad(a, ((pad_t, pad_b), (pad_l, pad_r), (0, 0)), mode="edge")
        left, top = left + pad_l, top + pad_t
    padded = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return padded.crop((left, top, left + int(round(side)), top + int(round(side))))


def match_backdrop(im: Image.Image) -> Image.Image:
    """Shift each row's backdrop to a shared gradient, preserving shadow/reflection."""
    a = np.asarray(im, dtype=np.float32)
    h, w, _ = a.shape
    band = max(2, w // 18)
    edge = np.concatenate([a[:, :band], a[:, -band:]], axis=1)
    row_actual = np.median(edge, axis=1)  # (h, 3)

    ramp = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    row_target = BACKDROP_TOP[None, :] * (1 - ramp) + BACKDROP_BOTTOM[None, :] * ramp  # (h, 3)

    correction = np.clip(row_target - row_actual, -18, 18)
    # Smooth the correction so it never introduces banding.
    k = np.ones(15, dtype=np.float32) / 15
    for c in range(3):
        correction[:, c] = np.convolve(correction[:, c], k, mode="same")

    out = a + correction[:, None, :]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def save(im: Image.Image, name: str, quality: int = 82, width: int | None = None) -> None:
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    path = OUT / name
    im.save(path, "WEBP", quality=quality, method=6)
    print(f"{name:<28} {path.stat().st_size // 1024:>5} KB  {im.width}x{im.height}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    products = sorted(SRC.glob("p-*.jpg"))
    for src in products:
        im = Image.open(src).convert("RGB")
        tile = match_backdrop(square_crop(im)).resize((TILE, TILE), Image.LANCZOS)
        save(tile, f"{src.stem}.webp", quality=82)

    hero = Image.open(SRC / "hero.jpg").convert("RGB")
    save(hero, "hero.webp", quality=78, width=1600)
    save(hero.crop((330, 0, 1206, 1024)), "hero-portrait.webp", quality=76, width=900)

    print(f"\nDone — {len(products)} product tiles + hero.")


if __name__ == "__main__":
    main()
