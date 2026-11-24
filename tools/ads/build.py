"""CLI:  python -m tools.ads.build [--only 1,2] [--preview] [--stills]"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

from .ads import ADS, BY_ID
from .config import OUT
from .render import FFMPEG, _set_ffmpeg, build_timeline, render_ad, render_frame, vo_words
from .config import VIDEO_DIR


def ffmpeg_path() -> str:
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma separated ad numbers")
    ap.add_argument("--preview", type=float, default=0.0, help="render N seconds only")
    ap.add_argument("--stills", default="", help="comma separated seconds for still frames")
    args = ap.parse_args(argv)

    _set_ffmpeg(ffmpeg_path())
    ids = [int(x) for x in args.only.split(",") if x.strip()] or [a.n for a in ADS]
    OUT.mkdir(exist_ok=True)

    for n in ids:
        ad = BY_ID[n]
        if args.stills:
            words, vo_dur = vo_words(OUT / "audio" / "vo" / f"{ad.vo}.mp3", ad.speed)
            total = round(vo_dur + 0.55, 2)
            scenes = build_timeline(ad, total)
            stamp_dir = OUT / "stills"
            stamp_dir.mkdir(exist_ok=True)
            for ts in [float(x) for x in args.stills.split(",")]:
                t = min(total - 0.05, ts)
                img = render_frame(ad, scenes, t, total).convert("RGB")
                img.resize((1080, 1920), Image.LANCZOS).save(
                    stamp_dir / f"{ad.filename}-{ts:.1f}s.jpg", quality=88
                )
            print(f"[{n:02d}] stills done ({total:.2f}s total)")
            continue

        out = render_ad(ad, preview_seconds=args.preview or None)
        print(f"[{n:02d}] {ad.slug} -> {out.relative_to(OUT.parent)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
