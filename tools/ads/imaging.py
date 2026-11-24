"""Photo loading, cover-cropping, and static grading."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

from .config import BUFFER_H, BUFFER_W, PHOTO_GEN, PHOTO_REAL

_cache: dict[str, Image.Image] = {}

SOURCES = {
    "hero": PHOTO_REAL / "hero.webp",
    "crew": PHOTO_REAL / "crew.webp",
    "driveway": PHOTO_REAL / "driveway.webp",
    "siding": PHOTO_REAL / "siding.webp",
    "roof": PHOTO_REAL / "roof.webp",
    "garage": PHOTO_REAL / "garage.webp",
    "community": PHOTO_REAL / "community.webp",
    "stain": PHOTO_REAL / "stain.webp",
    "work": PHOTO_REAL / "work.webp",
    "finish": PHOTO_REAL / "finish.webp",
    "cta": PHOTO_REAL / "cta.webp",
    # AI-rendered B-roll that ships with the site repo
    "g_hero": PHOTO_GEN / "hero.jpg",
    "g_roof": PHOTO_GEN / "roof.jpg",
    "g_siding": PHOTO_GEN / "siding.jpg",
    "g_driveway": PHOTO_GEN / "driveway.jpg",
    "g_commercial": PHOTO_GEN / "commercial.jpg",
    "g_condo": PHOTO_GEN / "condo.jpg",
    "g_lanai": PHOTO_GEN / "lanai.jpg",
    "g_oilstain": PHOTO_GEN / "oilstain.jpg",
}


def buffer_for(key: str, grade: str = "warm") -> Image.Image:
    """Return a 1350x2400 cover-cropped, graded RGB buffer for a photo key."""
    ck = f"{key}:{grade}"
    if ck in _cache:
        return _cache[ck]

    path = SOURCES[key]
    im = Image.open(path)
    im = im.convert("RGB")
    if im.size[0] < BUFFER_W:  # upscale with a light sharpening pass
        im = im.resize(
            (BUFFER_W, round(im.size[1] * BUFFER_W / im.size[0])), Image.LANCZOS
        )
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))
    if im.size[1] < BUFFER_H:
        im = im.resize(
            (round(im.size[0] * BUFFER_H / im.size[1]), BUFFER_H), Image.LANCZOS
        )
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))

    # cover crop
    scale = max(BUFFER_W / im.size[0], BUFFER_H / im.size[1])
    nw, nh = round(im.size[0] * scale), round(im.size[1] * scale)
    if (nw, nh) != im.size:
        im = im.resize((nw, nh), Image.LANCZOS)
    left = (nw - BUFFER_W) // 2
    top = (nh - BUFFER_H) // 2
    im = im.crop((left, top, left + BUFFER_W, top + BUFFER_H))

    im = _grade(im, grade)
    _cache[ck] = im
    return im


def dirty_for(key: str, grade: str = "warm") -> Image.Image:
    """A grubby version of the same photo for before/after reveals: heavy grime
    blotches, splatter specks, an algae-green cast and a dirt gradient at the
    bottom where runoff collects."""
    ck = f"{key}:{grade}:dirty"
    if ck in _cache:
        return _cache[ck]
    im = buffer_for(key, grade)
    w, h = im.size
    rng = np.random.default_rng(abs(hash(key)) % 2 ** 32)

    # 1. big low-frequency grime clouds
    small = rng.random((14, 8)).astype(np.float32)
    blotch = Image.fromarray((small * 255).astype(np.uint8), "L")
    blotch = blotch.resize(im.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    blotch = blotch.point(lambda v: int(min(255, max(0, (v - 60) * 2.4))))
    grime = ImageEnhance.Brightness(im).enhance(0.42)
    grime = ImageEnhance.Color(grime).enhance(0.5)
    im = Image.composite(grime, im, blotch)

    # 2. splatter specks
    specks = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(specks)
    for _ in range(260):
        x, y = rng.integers(0, w), rng.integers(0, h)
        r = int(3 + rng.random() * 16)
        d.ellipse([x - r, y - r, x + r, y + r], fill=int(120 + rng.random() * 120))
    specks = specks.filter(ImageFilter.GaussianBlur(3))
    im = Image.composite(ImageEnhance.Brightness(im).enhance(0.55), im, specks)

    # 3. cast + bottom dirt gradient
    arr = np.asarray(im).astype(np.float32)
    arr[..., 0] = arr[..., 0] * 0.94 + 3.0   # brown-grey grime, not green
    arr[..., 1] *= 0.88
    arr[..., 2] *= 0.70
    ramp = np.linspace(0.30, 1.0, h, dtype=np.float32) ** 1.6
    arr *= (1 - 0.42 * ramp)[:, None, None]
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")
    _cache[ck] = im
    return im


def _grade(im: Image.Image, grade: str) -> Image.Image:
    if grade == "warm":
        im = ImageEnhance.Color(im).enhance(1.16)
        im = ImageEnhance.Contrast(im).enhance(1.10)
        r, g, b = im.split()
        r = r.point(lambda v: min(255, int(v * 1.05 + 4)))
        g = g.point(lambda v: min(255, int(v * 1.01 + 2)))
        b = b.point(lambda v: min(255, int(v * 0.97)))
        im = Image.merge("RGB", (r, g, b))
    elif grade == "cool":
        im = ImageEnhance.Color(im).enhance(1.10)
        im = ImageEnhance.Contrast(im).enhance(1.14)
        r, g, b = im.split()
        r = r.point(lambda v: min(255, int(v * 0.97)))
        b = b.point(lambda v: min(255, int(v * 1.06 + 3)))
        im = Image.merge("RGB", (r, g, b))
    elif grade == "punch":
        im = ImageEnhance.Color(im).enhance(1.28)
        im = ImageEnhance.Contrast(im).enhance(1.20)
        im = ImageEnhance.Brightness(im).enhance(0.97)
    return im
