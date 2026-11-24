"""Render engine: turns each Ad spec into a 9:16 vertical video.

Pipeline per ad
  1. measure the VO and derive scene beats from its speech span
  2. synthesise a music bed whose length matches the VO
  3. render frames (photo move + kinetic captions + particles) into an ffmpeg pipe
  4. mix VO / music / SFX with sidechain ducking, mux, loudness normalise
  5. emit poster frames + an .srt caption file for the same copy
"""
from __future__ import annotations

import math
import subprocess
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from . import audio
from .ads import Ad, Shot
from .config import (
    BUFFER_H,
    BUFFER_W,
    CITY_LINE,
    DOMAIN,
    FPS,
    GOLD,
    H,
    INK,
    MINT,
    MUSIC_DIR,
    OUT,
    PHONE,
    POSTER_DIR,
    SAFE_BOTTOM,
    SAFE_MARGIN,
    SAFE_TOP,
    S,
    SRT_DIR,
    TEAL,
    VIDEO_DIR,
    VO_DIR,
    W,
)
from .graphics import (
    ANTON,
    BARLOW_SB,
    BARLOW_XB,
    clamp01,
    draw_caption,
    draw_kicker,
    draw_sub,
    droplets,
    ease_out,
    ease_in_out,
    light_sweep,
    load_font,
    logo_cut,
    paste_logo,
    progress_bar,
    reveal_wipe,
    shade,
    sparkles,
    spray_mist,
    streak,
    vertical_rgba,
)
from .imaging import buffer_for, dirty_for

S1 = BUFFER_W / 1080          # helper: buffer pixels per 1080-design pixel
CTA_CAP_BOTTOM = int(1005 * S1)
CTA_PANEL_TOP = int(1120 * S1)

_WIDE_SCENES: set[int] = set()   # scenes that use the photo-first scrim
FFMPEG = ""


def _set_ffmpeg(path: str):
    global FFMPEG
    FFMPEG = path


# --------------------------------------------------------------------------
# VO measurement
# --------------------------------------------------------------------------
@dataclass
class Word:
    text: str
    start: int   # ms, already scaled by the ad's VO tempo
    end: int


def probe_duration(path: Path) -> float:
    p = subprocess.run([FFMPEG, "-hide_banner", "-i", str(path)],
                       capture_output=True, text=True)
    for line in p.stderr.splitlines():
        if "Duration:" in line:
            hms = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = hms.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"could not read duration of {path}")


def vo_words(vo_path: Path, speed: float) -> tuple[list[Word], float]:
    """Measure the VO and distribute word timings across the spoken span."""
    import re

    def detect(thresh, silence):
        cmd = [FFMPEG, "-hide_banner", "-i", str(vo_path), "-af",
               f"silencedetect=noise={thresh}dB:d={silence}", "-f", "null", "-"]
        p = subprocess.run(cmd, capture_output=True, text=True)
        starts = [float(x) for x in re.findall(r"silence_start: ([-\\d.]+)", p.stderr)]
        ends = [float(x) for x in re.findall(r"silence_end: ([\\d.]+)", p.stderr)]
        dur = 0.0
        m = re.search(r"Duration: (\\d+):(\\d+):([\\d.]+)", p.stderr)
        if m:
            dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
        return starts, ends, dur

    spans: list[tuple[float, float]] = []
    for thresh, silence in ((-34, 0.13), (-28, 0.08), (-42, 0.05)):
        starts, ends, dur = detect(thresh, silence)
        spans = [(max(0.0, a), min(dur, b)) for a, b in zip(starts, ends) if b > a]
        if spans:
            break
    if not spans:
        dur = probe_duration(vo_path)
        spans = [(0.0, dur)]

    speech_start, speech_end = spans[0][0], spans[-1][1]
    words = [Word(w, 0, 0) for w in _script_words(vo_path)]
    inv = 1.0 / speed
    if not words:
        return words, speech_end * inv
    weights = [max(2.0, len(w.text) ** 0.85) for w in words]
    total_w = sum(weights)
    cursor = speech_start
    for w, wt in zip(words, weights):
        d = (speech_end - speech_start) * wt / total_w
        w.start = int(round(cursor * 1000 * inv))
        cursor += d
        w.end = int(round(cursor * 1000 * inv))
    return words, speech_end * inv


def _script_words(vo_path: Path) -> list[str]:
    from .scripts import SCRIPTS

    key = vo_path.stem.split("-")[0]
    return SCRIPTS.get(key, "").split()


# --------------------------------------------------------------------------
# Motion
# --------------------------------------------------------------------------
def shot_pan(anim: str, t: float, dur: float, zoom: float = 1.16):
    p = clamp01(t / dur) if dur else 0
    e = ease_in_out(p)
    z0, z1 = 1.02, zoom
    if anim == "pull":
        z = z0 + (z1 - z0) * (1 - e)
    elif anim == "shake":
        z = z0 + (z1 - z0) * min(1, p * 1.6)
    else:
        z = z0 + (z1 - z0) * min(1, p * 1.25)
    mx = (BUFFER_W * z - BUFFER_W) / 2
    my = (BUFFER_H * z - BUFFER_H) / 2
    cx, cy = {"panl": (-1, -0.4), "panr": (1, -0.4), "tilt": (0, 1)}.get(anim, (0, 0))
    jitter = (1 - p) * 9 * S1 if anim == "shake" else 0.0
    x = mx * cx * (0.55 + 0.45 * e) + math.sin(t * 31.0) * jitter
    y = my * cy * (0.55 + 0.45 * e) + math.cos(t * 24.0) * jitter
    return z, x, y


def render_shot(shot: Shot, t: float, dur: float) -> Image.Image:
    buf = buffer_for(shot.key, shot.grade)
    z, x, y = shot_pan(shot.anim, t, dur)
    if abs(z - 1) < 1e-3 and abs(x) < 1e-3 and abs(y) < 1e-3:
        return buf.convert("RGBA")
    a = 1 / z
    cx = BUFFER_W / 2 + (x / z)
    cy = BUFFER_H / 2 + (y / z)
    return buf.transform(
        (BUFFER_W, BUFFER_H), Image.AFFINE,
        (a, 0, cx - a * BUFFER_W / 2, 0, a, cy - a * BUFFER_H / 2),
        resample=Image.BICUBIC,
    ).convert("RGBA")


# --------------------------------------------------------------------------
# Timeline
# --------------------------------------------------------------------------
@dataclass
class Scene:
    start: float
    end: float
    caption: list[str]
    shot: Shot
    kicker: str = ""
    sub: str = ""
    mist: bool = False
    sparks: bool = False

    @property
    def dur(self) -> float:
        return self.end - self.start


def build_timeline(ad: Ad, total: float) -> list[Scene]:
    t1, t2, t3 = total * 0.335, total * 0.585, total * 0.795
    s1, s2, s3, s4 = (ad.shots + ad.shots)[:4]
    scenes = [
        Scene(0.0, t1, ad.hook, s1, kicker=ad.kicker, mist=ad.n in (1, 10)),
        Scene(t1, t2, ad.lines2, s2, kicker=ad.kicker2 or ad.kicker),
        Scene(t2, t3, ad.lines3, s3, kicker=ad.kicker3 or ad.kicker,
              sparks=ad.n in (2, 5, 9)),
        Scene(t3, total, ad.cta, s4, kicker=ad.cta_eyebrow, sub=ad.cta_sub),
    ]
    _WIDE_SCENES.clear()
    for i in ad.wide_beats:
        _WIDE_SCENES.add(id(scenes[i]))
    return scenes


# --------------------------------------------------------------------------
# Brand furniture
# --------------------------------------------------------------------------
def draw_cta_panel(canvas, ad: Ad, p: float, total_ratio: float):
    """Bottom brand block: logo, tap-to-call pill, domain, service area."""
    a = ease_out(clamp01(p / 0.28))
    if a <= 0:
        return
    W_ = BUFFER_W
    lay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)

    grad = vertical_rgba(BUFFER_H, (
        (0.0, 2, 9, 14, 0), (0.55, 2, 9, 14, 0), (0.70, 2, 9, 14, 225),
        (1.0, 2, 9, 14, 246)))
    canvas.alpha_composite(grad)

    d.rectangle([0, CTA_PANEL_TOP, int(W_ * clamp01(p / 0.40)), CTA_PANEL_TOP + int(4 * S1)],
                fill=TEAL + (int(255 * a),))

    lg = logo_cut()
    lw = int(250 * S1)
    lh = int(lg.size[1] * lw / lg.size[0])
    ly = CTA_PANEL_TOP + int(20 * S1)
    logo_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    paste_logo(logo_layer, W_ // 2, ly, lw, opacity=1.0, anchor="center")

    size = int(96 * S1)
    maxw = W_ - 2 * SAFE_MARGIN
    while size > int(40 * S1):
        if load_font(ANTON, size).getlength(PHONE) + int(150 * S1) <= maxw:
            break
        size -= 2
    f_phone = load_font(ANTON, size)
    tw = f_phone.getlength(PHONE)
    pill_h = int(size * 1.42)
    pill_w = tw + int(132 * S1)
    px = (W_ - pill_w) / 2
    py = ly + lh + int(18 * S1)
    d.rounded_rectangle([px, py, px + pill_w, py + pill_h], radius=pill_h // 2,
                        fill=GOLD + (int(255 * a),))
    asc, desc = f_phone.getmetrics()
    d.text((px + int(66 * S1), py + (pill_h - asc - desc) / 2), PHONE, font=f_phone,
           fill=INK + (int(255 * a),))
    cx, cy = px + pill_w - int(58 * S1), py + pill_h / 2
    d.ellipse([cx - int(30 * S1), cy - int(30 * S1), cx + int(30 * S1), cy + int(30 * S1)],
              fill=INK + (int(225 * a),))
    gw = max(2, int(3.4 * S1))
    d.arc([cx - int(15 * S1), cy - int(15 * S1), cx + int(9 * S1), cy + int(9 * S1)],
          200, 290, fill=GOLD + (int(255 * a),), width=gw)
    d.arc([cx - int(10 * S1), cy - int(10 * S1), cx + int(16 * S1), cy + int(16 * S1)],
          200, 290, fill=GOLD + (int(255 * a),), width=gw)

    f_dom = load_font(BARLOW_XB, int(56 * S1))
    dy = py + pill_h + int(26 * S1)
    d.text(((W_ - f_dom.getlength(DOMAIN)) / 2, dy), DOMAIN, font=f_dom,
           fill=MINT + (int(255 * a),))
    f_city = load_font(BARLOW_SB, int(40 * S1))
    d.text(((W_ - f_city.getlength(CITY_LINE)) / 2, dy + int(62 * S1)), CITY_LINE,
           font=f_city, fill=(206, 230, 236, int(238 * a)))

    if a < 1.0:
        lay.putalpha(lay.split()[3].point(lambda v: int(v * a)))
    canvas.alpha_composite(logo_layer)
    canvas.alpha_composite(lay)


def _star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.44
        pts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
    d.polygon(pts, fill=fill)


def draw_badge(canvas, text: str, *, y=None, fade=1.0):
    """Proof pill, top-right. Leading '*' characters are drawn as real stars."""
    if not text or fade <= 0:
        return
    y = y if y is not None else SAFE_TOP - int(122 * S1)
    stars = len(text) - len(text.lstrip("*"))
    label = text[stars:].lstrip()
    size = int(32 * S1)
    pad = int(24 * S1)
    star_w = int(size * 1.25) if stars else 0
    avail = BUFFER_W - 2 * SAFE_MARGIN - int(160 * S1) - stars * star_w
    while size > int(20 * S1):
        f = load_font(BARLOW_XB, size)
        if f.getlength(label) <= avail:
            break
        size -= 1
    f = load_font(BARLOW_XB, size)
    star_w = int(size * 1.25) if stars else 0
    tw = f.getlength(label)
    w = tw + pad * 2 + stars * star_w
    x = BUFFER_W - SAFE_MARGIN - w
    h = int(size * 1.85)
    lay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    a = int(238 * clamp01(fade))
    d.rounded_rectangle([x, y, x + w, y + h], radius=h // 2,
                        fill=(7, 20, 26, int(a * 0.90)),
                        outline=GOLD + (a,), width=max(2, int(2 * S1)))
    sx = x + pad
    for i in range(stars):
        _star(d, sx + star_w * (i + 0.42), y + h / 2, size * 0.46, GOLD + (a,))
    sx += stars * star_w
    asc, desc = f.getmetrics()
    d.text((sx, y + (h - asc - desc) / 2), label, font=f, fill=GOLD + (a,))
    canvas.alpha_composite(lay)


# --------------------------------------------------------------------------
# Frame compositor
# --------------------------------------------------------------------------
def render_frame(ad: Ad, scenes: list[Scene], t: float, total: float) -> Image.Image:
    sc = scenes[-1]
    for s in scenes:
        if s.start <= t < s.end:
            sc = s
            break
    lt = t - sc.start
    canvas = render_shot(sc.shot, lt, sc.dur)
    if sc.shot.reveal and lt < 0.92:
        canvas = reveal_wipe(canvas, dirty_for(sc.shot.key, sc.shot.grade),
                             ease_in_out(lt / 0.62))
    is_cta = sc is scenes[-1]
    wide = id(sc) in _WIDE_SCENES

    if wide:
        stops = [
            (0.00, 3, 10, 15, 235), (0.09, 3, 10, 15, 150), (0.18, 4, 12, 18, 20),
            (0.52, 4, 12, 18, 12), (0.62, 3, 11, 16, 60), (0.74, 3, 11, 16, 170),
            (1.00, 2, 9, 14, 245),
        ]
    else:
        stops = [
            (0.00, 3, 10, 15, 240), (0.10, 3, 10, 15, 165), (0.24, 4, 12, 18, 30),
            (0.46, 4, 12, 18, 55), (0.66, 3, 11, 16, 150), (0.80, 3, 11, 16, 210),
            (1.00, 2, 9, 14, 240),
        ]
    canvas = shade(canvas, stops)
    canvas = _vignette(canvas)

    if sc.mist:
        spray_mist(canvas, t, origin=(0.72, 0.46), count=120, life=1.4, power=1.15)
    droplets(canvas, t, count=9, speed=0.9)
    if sc.sparks:
        sparkles(canvas, t, count=6, progress=clamp01(lt / max(sc.dur * 0.5, 0.01)))
    p_in = lt / sc.dur if sc.dur else 0
    light_sweep(canvas, (p_in - 0.15) / 0.6, alpha=26)
    if ad.n in (1, 10) and sc is scenes[0]:
        streak(canvas, t, count=18, origin=(0.62, 0.34), alpha=30)

    if sc.kicker:
        draw_kicker(canvas, sc.kicker, SAFE_TOP, fade=ease_out(clamp01(lt / 0.22)))

    if is_cta:
        body_bottom = CTA_CAP_BOTTOM
    elif wide:
        body_bottom = int(SAFE_BOTTOM - 300 * S1)
    else:
        body_bottom = SAFE_BOTTOM
    anim_in = clamp01((lt - 0.06) / 0.34)
    draw_caption(
        canvas, sc.caption, body_bottom,
        size=int((100 if is_cta else 112) * S1),
        fade=ease_out(anim_in),
        rise=int((1 - ease_out(anim_in)) * 46 * S1),
    )
    if sc.sub:
        draw_sub(canvas, sc.sub, body_bottom + int(18 * S1), align="left",
                 fade=ease_out(clamp01((lt - 0.5) / 0.4)))

    # persistent brand chrome
    paste_logo(canvas, SAFE_MARGIN, SAFE_TOP - int(130 * S1), int(140 * S1), opacity=0.97)
    draw_badge(canvas, ad.badge, fade=clamp01((t - 0.25) / 0.4))

    if is_cta:
        draw_cta_panel(canvas, ad, lt, t / total)
    progress_bar(canvas, t / total, y=int(1572 * S1))
    return canvas


_vignette_cache: dict[tuple[int, int], Image.Image] = {}


def _vignette(canvas: Image.Image) -> Image.Image:
    v = _vignette_cache.get(canvas.size)
    if v is None:
        w, h = canvas.size
        yy, xx = np.mgrid[0:h, 0:w]
        nx = (xx - w / 2) / (w / 2)
        ny = (yy - h / 2) / (h / 2)
        r = np.sqrt(nx ** 2 * 0.85 + ny ** 2 * 0.62)
        a = np.clip((r - 0.55) / 0.85, 0, 1) ** 1.5 * 150
        arr = np.zeros((h, w, 4), dtype=np.uint8)
        arr[..., 3] = a.astype(np.uint8)
        v = Image.fromarray(arr, "RGBA").filter(ImageFilter.GaussianBlur(12))
        _vignette_cache[canvas.size] = v
    return Image.alpha_composite(canvas, v)


# --------------------------------------------------------------------------
# Audio
# --------------------------------------------------------------------------
def prepare_audio(ad: Ad, total: float, words: list[Word]) -> Path:
    bed = MUSIC_DIR / f"{ad.prog}-{ad.bpm}-{total:.2f}.wav"
    if not bed.exists():
        data = audio.music_bed(total, bpm=ad.bpm, prog=ad.prog, energy=1.1, seed=ad.n * 17)
        audio.write_wav(bed, data)

    cues = []
    if ad.n != 8:
        cues += [(_sfx("woosh"), total * 0.30, 0.30),
                 (_sfx("woosh"), total * 0.55, 0.26),
                 (_sfx("impact"), total * 0.79, 0.40),
                 (_sfx("ding"), total * 0.855, 0.18)]
    cues.append((_sfx("spray"), 0.02, 0.28))
    if ad.n in (1, 6):
        cues.append((_sfx("spray"), total * 0.40, 0.24))

    out = OUT / "audio" / "mix" / f"{ad.filename}.m4a"
    out.parent.mkdir(parents=True, exist_ok=True)
    audio.mixdown(FFMPEG, VO_DIR / f"{ad.vo}.mp3", bed, cues, out, total)
    return out


_SFX_CACHE: dict[str, Path] = {}


def _sfx(name: str) -> Path:
    if name in _SFX_CACHE:
        return _SFX_CACHE[name]
    p = OUT / "audio" / "sfx" / f"{name}.wav"
    if not p.exists():
        data = audio.SFX[name]()
        audio.write_wav(p, np.stack([data * 0.98, data]))
    _SFX_CACHE[name] = p
    return p


# --------------------------------------------------------------------------
# Captions / posters
# --------------------------------------------------------------------------
def write_srt(scenes: list[Scene], path: Path):
    def ts(sec: float) -> str:
        ms = int(round(sec * 1000))
        h, ms = divmod(ms, 3600000)
        m, ms = divmod(ms, 60000)
        s, ms = divmod(ms, 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    rows = []
    for i, s in enumerate(scenes, start=1):
        text = "\n".join(_plain(line) for line in s.caption).strip()
        if not text:
            continue
        rows.append(f"{i}\n{ts(s.start)} --> {ts(s.end)}\n{text}\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(rows), encoding="utf-8")


def _plain(s: str) -> str:
    return s.replace("[[", "").replace("]]", "").title()


# --------------------------------------------------------------------------
# Driver
# --------------------------------------------------------------------------
def render_ad(ad: Ad, *, preview_seconds: float | None = None, overwrite=True):
    vo_path = VO_DIR / f"{ad.vo}.mp3"
    words, vo_dur = vo_words(vo_path, ad.speed)
    total = round(vo_dur + 0.55, 2)
    scenes = build_timeline(ad, total)

    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    out_path = VIDEO_DIR / f"{ad.filename}.mp4"
    if out_path.exists() and not overwrite:
        return out_path

    duration = min(total, preview_seconds) if preview_seconds else total
    mix = prepare_audio(ad, total, words)

    parts = VIDEO_DIR / ".parts"
    parts.mkdir(parents=True, exist_ok=True)
    silent = parts / f"{ad.filename}.video.mp4"

    cmd = [
        FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{BUFFER_W}x{BUFFER_H}",
        "-r", str(FPS), "-i", "-",
        "-filter_complex",
        f"[0:v]scale={W}:{H}:flags=lanczos,format=yuv420p,setsar=1[v]",
        "-map", "[v]", "-an", "-t", f"{duration:.3f}",
        "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-maxrate", "5M",
        "-bufsize", "10M",
        "-profile:v", "high", "-level", "4.1",
        "-x264-params", "keyint=30:min-keyint=30:scenecut=0",
        "-pix_fmt", "yuv420p", "-colorspace", "bt709",
        str(silent),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n_frames = int(round(duration * FPS))
    try:
        for f in range(n_frames):
            frame = render_frame(ad, scenes, f / FPS, total).convert("RGB")
            proc.stdin.write(frame.tobytes())
            if f % 60 == 0:
                print(f"  [{ad.n:02d}] {ad.filename}: frame {f}/{n_frames}", flush=True)
    finally:
        proc.stdin.close()
        proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed for ad {ad.n}")

    subprocess.run(
        [FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(silent), "-i", str(mix),
         "-map", "0:v:0", "-map", "1:a:0", "-c", "copy",
         "-t", f"{duration:.3f}", "-shortest", "-movflags", "+faststart",
         "-metadata", f"title={ad.title} — Tool Guys Power Washing",
         "-metadata", f"comment={ad.notes}",
         str(out_path)],
        check=True,
    )

    POSTER_DIR.mkdir(parents=True, exist_ok=True)
    for suffix, p_t in (("", min(total * 0.92, total - 0.2)),
                        ("-hook", min(0.9, total * 0.12))):
        img = render_frame(ad, scenes, p_t, total).convert("RGB").resize((W, H), Image.LANCZOS)
        img.save(POSTER_DIR / f"{ad.filename}{suffix}.jpg", quality=90)
    write_srt(scenes, SRT_DIR / f"{ad.filename}.srt")
    return out_path
