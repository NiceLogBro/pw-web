"""Synthesised music beds + SFX, and the VO/music mixdown.

Everything here is generated from scratch with numpy so the ads are
royalty-free and can be re-tuned per creative.
"""
from __future__ import annotations

import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48000
NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7,
        "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(name: str) -> float:
    """'A3' -> 220.0"""
    pitch, octave = name[:-1], int(name[-1])
    midi = 12 * (octave + 1) + NOTE[pitch]
    return 440.0 * 2 ** ((midi - 69) / 12)


def _env(n: int, attack: float, decay: float, curve: float = 4.0) -> np.ndarray:
    a = max(1, int(attack * SR))
    t = np.arange(n) / SR
    e = np.exp(-np.maximum(0, t - attack) * (curve / max(decay, 1e-3)))
    if n > a:
        e[:a] *= np.linspace(0, 1, a)
    return e


def _lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


def _highpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    return x - _lowpass(x, cutoff)


def _pluck(f: float, dur: float, *, bright=1.0, detune=0.0) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, amp in enumerate([1.0, 0.5, 0.28, 0.16, 0.09, 0.05], start=1):
        if amp < 0.05 and bright < 0.7:
            continue
        out += amp * np.sin(2 * np.pi * f * k * (1 + detune * k) * t)
    return out * _env(n, 0.004, dur * 0.55)


def _bass(f: float, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2 * t)
    return out * _env(n, 0.008, dur * 0.7, curve=3.0)


def _pad(freqs, dur: float) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for d in (-0.004, 0.004):
            out += 0.16 * np.sin(2 * np.pi * f * (1 + d) * t)
    out = _lowpass(out, 1500)
    a = int(0.12 * SR)
    env = np.ones(n)
    if n > 2 * a:
        env[:a] = np.linspace(0, 1, a)
        env[-a:] = np.linspace(1, 0, a)
    return out * env


def _kick(dur=0.30) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 118 * np.exp(-t * 26) + 44
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    click = _highpass(np.random.default_rng(7).normal(0, 1, n), 2600) * np.exp(-t * 90)
    return (body * np.exp(-t * 9) + 0.25 * click)


def _clap(dur=0.24) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(11)
    noise = _highpass(_highpass(rng.normal(0, 1, n), 900), 1400)
    env = np.zeros(n)
    for off in (0.0, 0.011, 0.023):
        i = int(off * SR)
        env[i:] += np.exp(-np.maximum(0, t[: n - i] - off) * 26)
    env += 0.5 * np.exp(-t * 12)
    return noise * env / 2.2


def _hat(dur=0.07) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(23)
    return _highpass(rng.normal(0, 1, n), 7000) * np.exp(-t * 60)


def _add(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= buf.shape[1]:
        return
    m = min(len(sig), buf.shape[1] - i)
    l = gain * (1 - max(0.0, pan) * 0.55)
    r = gain * (1 + min(0.0, pan) * 0.55)
    buf[0, i:i + m] += sig[:m] * l
    buf[1, i:i + m] += sig[:m] * r


PROGS = {
    # (root bass note, pad voicing) per bar — A-minor family, feels uplifting
    "bold": [
        ["A2", ["A3", "C4", "E4"]],
        ["F2", ["F3", "A3", "C4"]],
        ["C3", ["C4", "E4", "G4"]],
        ["G2", ["G3", "B3", "D4"]],
    ],
    "drive": [
        ["D2", ["D4", "F4", "A4"]],
        ["A2", ["A3", "C4", "E4"]],
        ["B2", ["B3", "D4", "F4"]],
        ["G2", ["G3", "B3", "D4"]],
    ],
    "sunny": [
        ["C3", ["C4", "E4", "G4"]],
        ["G2", ["G3", "B3", "D4"]],
        ["A2", ["A3", "C4", "E4"]],
        ["F2", ["F3", "A3", "C4"]],
    ],
}


def music_bed(duration: float, *, bpm=112, prog="bold", energy=1.0, seed=0):
    rng = np.random.default_rng(seed)
    n = int(duration * SR)
    buf = np.zeros((2, n))
    beat = 60 / bpm
    bar = beat * 4
    chords = PROGS[prog]

    # --- pads + bass -----------------------------------------------------
    bar_i = 0
    t = 0.0
    while t < duration:
        root, voicing = chords[bar_i % len(chords)]
        _add(buf, _pad([hz(v) for v in voicing], bar * 1.02), t, 0.42)
        for b in range(4):
            if b in (0, 2) or energy > 1.05:
                _add(buf, _bass(hz(root), beat * 0.92), t + b * beat, 0.72)
        bar_i += 1
        t += bar

    # --- pluck arpeggio --------------------------------------------------
    arp_steps = [0, 2, 1, 3, 2, 0, 3, 1]
    t = 0.0
    step_i = 0
    while t < duration:
        root, voicing = chords[int(t // bar) % len(chords)]
        tones = [hz(v) * 2 for v in voicing]
        f = tones[arp_steps[step_i % len(arp_steps)] % len(tones)]
        gain = 0.30 if step_i % 2 == 0 else 0.18
        _add(buf, _pluck(f, beat * 1.6, detune=0.0012), t, gain,
             pan=(-0.35 if step_i % 2 else 0.35))
        t += beat / 2
        step_i += 1

    # --- drums -----------------------------------------------------------
    kick, clap, hat = _kick(), _clap(), _hat()
    t = 0.0
    while t < duration:
        _add(buf, kick, t, 0.85)
        if energy >= 0.9:
            _add(buf, kick, t + beat * 2, 0.55)
        if energy > 1.0 and t > bar:
            _add(buf, clap, t + beat * 1, 0.34)
            _add(buf, clap, t + beat * 3, 0.34)
        for i in range(4):
            _add(buf, hat, t + i * beat + beat * 0.5, 0.16 + 0.05 * (i == 2))
        t += bar

    # --- water texture ---------------------------------------------------
    noise = rng.normal(0, 1, n)
    water = _highpass(_lowpass(noise, 2600), 500)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * np.arange(n) / SR)
    buf[0] += water * lfo * 0.05
    buf[1] += np.roll(water, 240) * lfo * 0.05

    # --- tail fade, glue, gentle saturation, RMS normalise ---------------
    fade = int(0.35 * SR)
    buf[:, -fade:] *= np.linspace(1, 0, fade)
    buf[0] = _lowpass(buf[0], 12000)
    buf[1] = _lowpass(buf[1], 12000)
    fade_in = int(0.08 * SR)
    buf[:, :fade_in] *= np.linspace(0, 1, fade_in)
    # soft-clip the kick transients, then normalise to a bed level (-20 dBFS rms)
    buf = np.tanh(buf * 1.6) / 1.6
    rms = float(np.sqrt(np.mean(buf ** 2))) or 1.0
    buf *= 0.10 / rms
    return buf


def sfx_woosh(dur=0.55, *, up=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = np.random.default_rng(5).normal(0, 1, n)
    sweep = _lowpass(noise, 1800) * np.linspace(0, 1, n) ** (1.4 if up else 0.6)
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.6
    return sweep * env * 0.9


def sfx_spray(dur=0.9):
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.default_rng(13)
    nz = _highpass(rng.normal(0, 1, n), 900)
    flutter = 0.55 + 0.45 * np.sin(2 * np.pi * 9 * t) ** 2
    env = np.minimum(1, t / 0.06) * np.exp(-np.maximum(0, t - dur * 0.5) * 5)
    return nz * flutter * env * 0.55


def sfx_impact(dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 190 * np.exp(-t * 16) + 52
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
    click = _highpass(np.random.default_rng(3).normal(0, 1, n), 3000) * np.exp(-t * 60)
    return (body + 0.4 * click) * 0.95


def sfx_ding(dur=1.0, f=1568.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.0 * t)
           + 0.22 * np.sin(2 * np.pi * f * 2.76 * t))
    return out * np.exp(-t * 4.2) * 0.5


SFX = {
    "woosh": sfx_woosh,
    "spray": sfx_spray,
    "impact": sfx_impact,
    "ding": sfx_ding,
}


def write_wav(path: Path, data: np.ndarray, sr=SR):
    """data: (channels, n) float32 in [-1, 1]."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if data.ndim == 1:
        data = np.stack([data, data])
    d = np.clip(data, -1, 1).T
    pcm = (d * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(d.shape[1])
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def decode_rms(ffmpeg: str, path: Path, sr=SR) -> tuple[float, float]:
    """Return (rms, peak) of a file as normalised floats."""
    import io
    import subprocess
    import wave

    cmd = [ffmpeg, "-v", "error", "-i", str(path), "-f", "wav", "-ac", "1",
           "-ar", str(sr), "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    w = wave.open(io.BytesIO(raw))
    a = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32768.0
    return float(np.sqrt(np.mean(a ** 2)) or 1e-9), float(np.abs(a).max() or 1e-9)


def _loudnorm_stats(stderr: str) -> dict:
    import json
    import re

    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", stderr, re.S)
    if not m:
        return {}
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return {}


def mixdown(ffmpeg: str, vo: Path, music: Path, sfx_cues: list[tuple[Path, float, float]],
            out: Path, duration: float, *, music_gain=0.55, vo_target=0.155,
            target_lufs=-14.0):
    """Duck the bed under the VO, add SFX, then two-pass linear loudness
    normalisation so every ad lands at the same integrated loudness."""
    sfx_cues = [c for c in sfx_cues if c[2] > 0]
    inputs = ["-i", str(music), "-i", str(vo)]
    for p, _, _ in sfx_cues:
        inputs += ["-i", str(p)]

    vo_rms, _ = decode_rms(ffmpeg, vo)
    vo_gain = min(6.0, max(0.4, vo_target / vo_rms))

    def build(extra: str) -> str:
        f = [f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,"
             f"volume={music_gain}[mus]",
             f"[1:a]highpass=f=90,lowpass=f=12500,volume={vo_gain:.3f},"
             f"aformat=sample_rates=48000:channel_layouts=stereo[vo]",
             "[mus][vo]sidechaincompress=threshold=0.055:ratio=3.2:attack=6:release=340:"
             "makeup=1[duck]"]
        labels = ["[duck]", "[vo]"]
        for i, (p, at, g) in enumerate(sfx_cues):
            f.append(
                f"[{i + 2}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g},"
                f"adelay={int(at * 1000)}|{int(at * 1000)}[s{i}]"
            )
            labels.append(f"[s{i}]")
        f.append("".join(labels)
                 + f"amix=inputs={len(labels)}:normalize=0:duration=longest,"
                 f"atrim=0:{duration:.3f},alimiter=limit=0.95:level=false{extra}")
        return ";".join(f)

    # pass 1 — measure
    probe = subprocess.run(
        [ffmpeg, "-hide_banner", "-nostats", "-y", *inputs, "-filter_complex",
         build(f",loudnorm=I={target_lufs}:TP=-1.5:LRA=11:print_format=json"),
         "-f", "null", "-"],
        capture_output=True, text=True,
    )
    stats = _loudnorm_stats(probe.stderr)

    extra = f",loudnorm=I={target_lufs}:TP=-1.5:LRA=11"
    if stats.get("input_i") not in (None, "-inf", "inf"):
        extra += (
            f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}"
            f":measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}"
            f":offset={stats.get('target_offset', '0')}:linear=true"
        )
    extra += ",aresample=48000"

    fc = build(extra) + "[aout]"
    subprocess.run(
        [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *inputs,
         "-filter_complex", fc, "-map", "[aout]",
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(out)],
        check=True)
