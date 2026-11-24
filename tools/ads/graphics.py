"""Drawing primitives: gradients, shading, kinetic captions, particles, logo."""
from __future__ import annotations

import math
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from .config import (
    S,
    LOGO,
    GOLD,
    GOLD_DEEP,
    INK,
    MINT,
    SAFE_MARGIN,
    TEAL,
    WHITE,
    font,
)

ANTON = "anton.ttf"
BARLOW_XB = "barlow-xbold.ttf"
BARLOW_B = "barlow-bold.ttf"
BARLOW_SB = "barlow-semi.ttf"


@lru_cache(maxsize=64)
def load_font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(font(name), size)


# --------------------------------------------------------------------------
# Gradients & shading
# --------------------------------------------------------------------------
@lru_cache(maxsize=32)
def vertical_rgba(height: int, stops):
    """Build an HxW RGBA gradient. stops = ((pos, r, g, b, a), ...) with pos 0..1."""
    from .config import BUFFER_W

    col = np.zeros((height, 1, 4), dtype=np.float32)
    ys = np.linspace(0, 1, height)
    for channel in range(4):
        col[:, 0, channel] = np.interp(ys, [s[0] for s in stops],
                                       [s[channel + 1] for s in stops])
    arr = np.repeat(col, BUFFER_W, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def shade(img: Image.Image, stops, blur: int = 0) -> Image.Image:
    """Blend a vertical dark/scrim gradient over the image."""
    layer = vertical_rgba(img.size[1], tuple(stops))
    if layer.size != img.size:
        layer = layer.resize(img.size, Image.BILINEAR)
    if blur:
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(img.convert("RGBA"), layer)


def ease_out(t: float) -> float:
    t = min(1.0, max(0.0, t))
    return 1 - (1 - t) ** 3


def ease_in_out(t: float) -> float:
    t = min(1.0, max(0.0, t))
    return 3 * t * t - 2 * t * t * t


def ease_out_back(t: float, s: float = 1.7) -> float:
    t = min(1.0, max(0.0, t))
    return 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2


def clamp01(v: float) -> float:
    return 0.0 if v < 0 else (1.0 if v > 1 else v)


# --------------------------------------------------------------------------
# Kinetic caption block
# --------------------------------------------------------------------------
_HL_OPEN, _HL_CLOSE = "[[", "]]"


def _tokens(line: str):
    """Split a line into (text, highlighted) tokens, honouring [[highlight]]."""
    out, buf, hl = [], "", False
    i = 0
    while i < len(line):
        if line.startswith(_HL_OPEN, i):
            if buf:
                out.append((buf, hl))
            buf, hl = "", True
            i += 2
        elif line.startswith(_HL_CLOSE, i):
            if buf:
                out.append((buf, hl))
            buf, hl = "", False
            i += 2
        else:
            buf += line[i]
            i += 1
    if buf:
        out.append((buf, hl))
    return [t for t in out if t[0]]


def measure_line(tokens, fnt, space_w, pad_x):
    w = sum(fnt.getbbox(t)[2] - fnt.getbbox(t)[0] for t, _ in tokens)
    w += space_w * (len(tokens) - 1)
    pads = sum(2 * pad_x for _, hl in tokens if hl)
    return w + pads


def draw_caption(
    canvas: Image.Image,
    lines: list[str],
    bottom: int,
    *,
    size: int = int(112 * S),
    highlight_size: int | None = None,
    align: str = "left",
    color=WHITE,
    plate: bool = True,
    plate_color=(6, 16, 20, 205),
    line_gap: float = 1.14,
    max_width: int | None = None,
    shadow: bool = True,
    fade: float = 1.0,
    rise: float = 0.0,
) -> int:
    """Draw a bold, plate-backed multi-line caption. Returns the top y used.

    Words wrapped in [[ ]] render in a gold box (the punch word).
    """
    max_width = max_width or (canvas.size[0] - 2 * SAFE_MARGIN)
    fnt = load_font(ANTON, size)
    hfnt = load_font(ANTON, highlight_size or size)
    space_w = fnt.getlength(" ")
    h_space_w = hfnt.getlength(" ")

    # shrink to fit
    while size > 34:
        ok = True
        for ln in lines:
            tk = _tokens(ln)
            f = hfnt if any(h for _, h in tk) else fnt
            if measure_line(tk, f, f.getlength(" "), int(size * 0.14)) > max_width:
                ok = False
                break
        if ok:
            break
        size -= 4
        fnt = load_font(ANTON, size)
        hfnt = load_font(ANTON, highlight_size or size)
        space_w = fnt.getlength(" ")

    line_h = int(size * line_gap)
    pad_x = int(size * 0.14)
    total_h = line_h * len(lines)
    top = bottom - total_h

    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    for i, ln in enumerate(lines):
        tk = _tokens(ln)
        if not tk:
            continue
        use_h = any(h for _, h in tk)
        f, sp = (hfnt, h_space_w) if use_h else (fnt, space_w)
        w = measure_line(tk, f, sp, pad_x)
        x = SAFE_MARGIN if align == "left" else (canvas.size[0] - w) // 2
        y = top + i * line_h

        if plate:
            pw = w + pad_x * 2
            d.rounded_rectangle(
                [x - pad_x - 14, y + int(size * 0.06), x - pad_x - 14 + pw + 28,
                 y + line_h - int(size * 0.04)],
                radius=int(size * 0.16),
                fill=plate_color,
            )
            d.rounded_rectangle(
                [x - pad_x - 14, y + int(size * 0.06),
                 x - pad_x - 6, y + line_h - int(size * 0.04)],
                radius=4,
                fill=TEAL + (255,),
            )

        cx = x
        for text, hl in tk:
            tw = f.getbbox(text)[2] - f.getbbox(text)[0]
            asc, desc = f.getmetrics()
            ty = y + (line_h - (asc + desc)) / 2
            if hl:
                bx0 = cx - pad_x
                bx1 = cx + tw + pad_x
                by0 = y + int(size * 0.10)
                by1 = y + line_h - int(size * 0.06)
                d.rounded_rectangle([bx0, by0, bx1, by1], radius=int(size * 0.13), fill=GOLD + (255,))
                d.rounded_rectangle(
                    [bx0, by0, bx1, by0 + max(3, int(size * 0.045))],
                    radius=2, fill=GOLD_DEEP + (255,),
                )
                d.text((cx, ty), text, font=f, fill=INK + (255,))
            else:
                if shadow:
                    d.text((cx + 4, ty + 5), text, font=f, fill=(0, 0, 0, 150))
                d.text((cx, ty), text, font=f, fill=color + (255,))
            cx += tw + sp + (2 * pad_x if hl else 0)

    if fade < 1.0 or rise:
        alpha = layer.split()[3].point(lambda v: int(v * clamp01(fade)))
        layer.putalpha(alpha)
        if rise:
            layer = layer.transform(
                layer.size, Image.AFFINE, (1, 0, 0, 0, 1, -rise), resample=Image.BILINEAR
            )
    canvas.alpha_composite(layer)
    return top


def draw_kicker(canvas, text, y, *, color=GOLD, size=int(46 * S), align="left", fade=1.0):
    """Small uppercase eyebrow line with a rule."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = load_font(BARLOW_XB, size)
    tw = d.textlength(text, font=f)
    x = SAFE_MARGIN if align == "left" else (canvas.size[0] - tw) / 2
    d.text((x + 3, y + 4), text, font=f, fill=(0, 0, 0, 140))
    d.text((x, y), text, font=f, fill=color + (255,))
    if align == "left":
        d.rounded_rectangle([x, y + size * 1.55, x + tw * 0.42, y + size * 1.55 + 5], radius=3,
                            fill=color + (255,))
    if fade < 1.0:
        a = layer.split()[3].point(lambda v: int(v * clamp01(fade)))
        layer.putalpha(a)
    canvas.alpha_composite(layer)


def draw_sub(canvas, text, y, *, size=int(52 * S), color=(235, 245, 248), align="left", fade=1.0,
             weight=BARLOW_SB):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    f = load_font(weight, size)
    tw = d.textlength(text, font=f)
    x = SAFE_MARGIN if align == "left" else (canvas.size[0] - tw) / 2
    d.text((x + 3, y + 4), text, font=f, fill=(0, 0, 0, 160))
    d.text((x, y), text, font=f, fill=color + (255,))
    if fade < 1.0:
        a = layer.split()[3].point(lambda v: int(v * clamp01(fade)))
        layer.putalpha(a)
    canvas.alpha_composite(layer)


# --------------------------------------------------------------------------
# Particles: spray mist, droplets, sparkles
# --------------------------------------------------------------------------
@lru_cache(maxsize=8)
def _droplet_sprite(px: int = 26) -> Image.Image:
    s = px * 3
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([px, px, px * 2, px * 2], fill=(180, 240, 255, 235))
    d.ellipse([px * 1.25, px * 1.2, px * 1.62, px * 1.55], fill=(255, 255, 255, 255))
    return im.filter(ImageFilter.GaussianBlur(px * 0.10))


def spray_mist(canvas, t, *, origin=(0.5, 0.55), count=130, life=1.6, power=1.0,
               direction=(1.0, -0.25)):
    """Deterministic particle mist burst animated by absolute time t."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    W, H = canvas.size
    ox, oy = origin[0] * W, origin[1] * H
    for i in range(count):
        seed = (i * 2654435761) % 100000
        rnd = _rand(seed)
        period = life * (0.55 + rnd[0] * 0.9)
        tt = (t * (0.7 + rnd[1] * 0.8)) % period
        p = tt / period
        ang = -0.9 + rnd[2] * 1.6
        dist = (0.35 + rnd[3] * 1.1) * power * (0.25 + p) * 900
        dx = math.cos(ang) * dist * direction[0] + (rnd[4] - 0.5) * 160 * p
        dy = math.sin(ang) * dist * 0.55 + direction[1] * dist * 0.5 + 240 * p * p
        x, y = ox + dx, oy + dy
        r = 2 + rnd[5] * 7 * (1 - p * 0.4)
        a = int(200 * (1 - p) ** 1.5)
        if a <= 3:
            continue
        d.ellipse([x - r, y - r, x + r, y + r], fill=(215, 248, 255, a))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.4)))


def droplets(canvas, t, *, count=14, speed=1.0):
    W, H = canvas.size
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    for i in range(count):
        r = _rand(i * 7919 + 13)
        x = r[0] * W
        size = 10 + r[1] * 26
        period = (H + 200) / (speed * (220 + r[2] * 260))
        y = ((t + r[3] * period) % period) / period * (H + 200) - 100
        sp = _droplet_sprite(int(size))
        layer.alpha_composite(sp, (int(x - size), int(y - size * 1.2)))
    canvas.alpha_composite(layer)


def sparkles(canvas, t, *, count=7, progress=1.0):
    """Mint 4-point sparkles that pop in — used on 'clean' beats."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    W, H = canvas.size
    for i in range(count):
        r = _rand(i * 104729 + 5)
        x = (0.10 + r[0] * 0.80) * W
        y = (0.12 + r[1] * 0.62) * H
        s = (0.6 + 0.7 * abs(math.sin(t * 2.2 + i))) * (34 + r[2] * 46) * min(1, progress * 1.3)
        if s < 3:
            continue
        a = int(235 * min(1, progress * 1.4))
        w = max(2, s * 0.16)
        d.polygon([(x, y - s), (x + w, y), (x, y + s), (x - w, y)], fill=(255, 255, 255, a))
        d.polygon([(x - s, y), (x, y + w), (x + s, y), (x, y - w)], fill=(255, 255, 255, a))
        d.ellipse([x - s * 0.22, y - s * 0.22, x + s * 0.22, y + s * 0.22],
                  fill=MINT + (a,))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(0.6)))


def light_sweep(canvas, p, *, angle=-24, width=340, alpha=52, color=(255, 255, 255)):
    """Diagonal glare sweeping across the frame once per scene (p 0..1)."""
    if p <= 0 or p >= 1:
        return
    W, H = canvas.size
    bar = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(bar)
    x = -W * 0.6 + p * W * 2.2
    d.polygon(
        [(x, -H), (x + width, -H), (x + width - H * 0.5, H * 2), (x - H * 0.5, H * 2)],
        fill=color + (alpha,),
    )
    canvas.alpha_composite(bar.filter(ImageFilter.GaussianBlur(48)))


def streak(canvas, t, *, count=26, origin=(0.5, 0.0), alpha=44):
    """Fast radial speed-lines for the hook beat."""
    W, H = canvas.size
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ox, oy = origin[0] * W, origin[1] * H
    for i in range(count):
        r = _rand(i * 3571 + 91)
        ang = r[0] * math.tau
        phase = (t * (1.1 + r[1]) + r[2]) % 1.0
        d0 = phase * phase * 1500
        d1 = d0 + 160 + r[3] * 320
        x0, y0 = ox + math.cos(ang) * d0, oy + math.sin(ang) * d0
        x1, y1 = ox + math.cos(ang) * d1, oy + math.sin(ang) * d1
        d.line([(x0, y0), (x1, y1)], fill=(230, 250, 255, int(alpha * (1 - phase * 0.6))),
               width=max(2, int(2 + r[4] * 5)))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.0)))


def _rand(seed: int) -> tuple[float, ...]:
    """Deterministic pseudo-random tuple in [0,1)."""
    out = []
    x = (seed * 1103515245 + 12345) & 0x7FFFFFFF
    for _ in range(8):
        x = (x * 1103515245 + 12345) & 0x7FFFFFFF
        out.append(x / 0x7FFFFFFF)
    return tuple(out)


# --------------------------------------------------------------------------
# Brand furniture
# --------------------------------------------------------------------------
@lru_cache(maxsize=1)
def logo_cut() -> Image.Image:
    im = Image.open(LOGO).convert("RGBA")
    bbox = im.split()[-1].getbbox()
    return im.crop(bbox)


def reveal_wipe(canvas: Image.Image, dirty: Image.Image, p: float, *,
                angle: float = -34.0, soft: float = 0.055) -> Image.Image:
    """Diagonal 'dirty on the left, clean on the right' reveal with a spray edge."""
    from .config import BUFFER_H as BH, BUFFER_W as BW

    if p <= 0:
        return Image.alpha_composite(canvas, dirty.convert("RGBA"))
    if p >= 1:
        return canvas
    p = clamp01(p)
    th = math.radians(angle)
    nx, ny = math.cos(th), math.sin(th)
    span = abs(nx) + abs(ny)
    edge = -0.25 + p * 1.60           # projected position of the clean edge

    mw, mh = 160, 285
    yy, xx = np.mgrid[0:mh, 0:mw]
    u = ((xx / (mw - 1)) - 0.5) * nx + ((yy / (mh - 1)) - 0.5) * ny
    u = u / (span * 0.5)
    mask = np.clip((edge - u) / soft, 0, 1)
    mask = (mask * 255).astype(np.uint8)
    m = Image.fromarray(mask, "L").resize((BW, BH), Image.BILINEAR)

    out = Image.composite(dirty.convert("RGBA"), canvas, m)

    # bright spray edge + glow
    if 0.02 < p < 0.98:
        bx0 = (edge + 0.5) * span * 0.5
        ax, ay = -nx, -ny
        cx = BW * 0.5 + nx * bx0 * BW * 0.5 * 1.0
        cy = BH * 0.5 + ny * bx0 * BH * 0.5 * 1.0
        L = BH * 1.6
        glow = Image.new("RGBA", out.size, (0, 0, 0, 0))
        dg = ImageDraw.Draw(glow)
        dg.line([(cx + ax * L, cy + ay * L), (cx - ax * L, cy - ay * L)],
                fill=MINT + (150,), width=int(46 * (BW / 1080)))
        out = Image.alpha_composite(out, glow.filter(ImageFilter.GaussianBlur(22)))
        core = Image.new("RGBA", out.size, (0, 0, 0, 0))
        dc = ImageDraw.Draw(core)
        dc.line([(cx + ax * L, cy + ay * L), (cx - ax * L, cy - ay * L)],
                fill=(240, 253, 255, 235), width=int(9 * (BW / 1080)))
        out = Image.alpha_composite(out, core)
    return out


def paste_logo(canvas, x, y, width, *, opacity=1.0, anchor="left"):
    lg = logo_cut()
    h = round(lg.size[1] * width / lg.size[0])
    lg = lg.resize((int(width), int(h)), Image.LANCZOS)
    if opacity < 1.0:
        lg.putalpha(lg.split()[3].point(lambda v: int(v * clamp01(opacity))))
    if anchor == "center":
        x = x - width / 2
    canvas.alpha_composite(lg, (int(x), int(y)))
    return h


def progress_bar(canvas, p, *, y=None, color=TEAL):
    from .config import SAFE_BOTTOM

    W, H = canvas.size
    y = y if y is not None else SAFE_BOTTOM + 150
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, x1 = SAFE_MARGIN, W - SAFE_MARGIN - 160
    d.rounded_rectangle([x0, y, x1, y + 7], radius=4, fill=(255, 255, 255, 46))
    d.rounded_rectangle([x0, y, x0 + (x1 - x0) * clamp01(p), y + 7], radius=4, fill=color + (235,))
    canvas.alpha_composite(layer)
