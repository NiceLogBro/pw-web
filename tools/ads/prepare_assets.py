"""Bootstrap the image inputs for the ad factory.

Extracts the job photos that ship inside the uploaded site zip into
`work/orig/photos/` and copies the AI b-roll into `work/orig/public/gen/`.
Run once after a fresh clone:  python3 -m tools.ads.prepare_assets
"""
from __future__ import annotations

import base64
import re
import shutil
import zipfile
from pathlib import Path

from .config import PHOTO_GEN, PHOTO_REAL, ROOT, WORK

ZIP_GLOBS = ("rdy-pwr-wash *3*.zip", "rdy-pwr-wash *.zip")


def main() -> int:
    WORK.mkdir(exist_ok=True)
    zip_path = None
    for pat in ZIP_GLOBS:
        found = sorted(ROOT.glob(pat))
        if found:
            zip_path = found[-1]
            break
    if zip_path is None:
        raise SystemExit("no rdy-pwr-wash zip found in the repo root")

    PHOTO_REAL.mkdir(parents=True, exist_ok=True)
    PHOTO_GEN.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(zip_path) as z:
        # 1. the AI b-roll that lives in public/gen
        for name in z.namelist():
            if name.startswith("public/gen/") and not name.endswith("/"):
                with z.open(name) as src, open(PHOTO_GEN / Path(name).name, "wb") as dst:
                    shutil.copyfileobj(src, dst)

        # 2. the scraped job photos, base64-embedded in src/assets/images.ts
        with z.open("src/assets/images.ts") as fh:
            source = fh.read().decode("utf-8")
        for key, fmt, payload in re.findall(
            r'^  (\w+): "data:image/(\w+);base64,([^"]+)"', source, re.M
        ):
            ext = "jpg" if fmt in ("jpeg", "jpg") else fmt
            (PHOTO_REAL / f"{key}.{ext}").write_bytes(base64.b64decode(payload))

    print(f"photos -> {PHOTO_REAL}  ({len(list(PHOTO_REAL.iterdir()))} files)")
    print(f"b-roll -> {PHOTO_GEN}  ({len(list(PHOTO_GEN.iterdir()))} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
