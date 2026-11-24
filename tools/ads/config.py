"""Brand + output config for the PowerWashingOahu.com ad factory."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "work"
OUT = ROOT / "ads"
VO_DIR = OUT / "audio" / "vo"
MUSIC_DIR = OUT / "audio" / "music"
VIDEO_DIR = OUT / "videos"
POSTER_DIR = OUT / "posters"
SRT_DIR = OUT / "captions"

FONTS = Path(__file__).resolve().parent / "brand"   # fonts ship with the tool
PHOTO_REAL = WORK / "orig" / "photos"      # scraped from powerwashingoahu.com
PHOTO_GEN = WORK / "orig" / "public" / "gen"  # companion AI-rendered b-roll
LOGO = Path(__file__).resolve().parent / "brand" / "logo.webp"

# --- Format ---------------------------------------------------------------
W, H = 1080, 1920
FPS = 30
BUFFER_W, BUFFER_H = 1242, 2208   # render 1.15x then downsample = crisp downscale
S = BUFFER_W / W                  # buffer-pixels per output-pixel

# --- Brand palette (sampled from the Tool Guys logo + site theme) ---------
TEAL = (23, 160, 138)
MINT = (95, 211, 188)
GOLD = (245, 185, 63)
GOLD_DEEP = (232, 152, 24)
INK = (7, 14, 18)
NIGHT = (4, 18, 26)
DEEP = (5, 36, 53)
FOAM = (234, 252, 255)
WHITE = (255, 255, 255)

PHONE = "(808) 927-6202"
PHONE_RAW = "+18089276202"
DOMAIN = "POWERWASHINGOAHU.COM"
CITY_LINE = "ISLAND-WIDE O'AHU"

# Reels/Stories safe area (in BUFFER px): keep critical pixels inside this band.
# Meta's 9:16 overlay UI eats ~14% top and ~20% bottom of the frame.
SAFE_TOP = int(240 * S)
SAFE_BOTTOM = int(1468 * S)
SAFE_MARGIN = int(78 * S)


def font(name: str) -> str:
    return str(FONTS / name)
