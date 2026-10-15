# Uso: python3 scripts/musica.py <salida.wav> [segundos]
# Pista ambiental propia (sin derechos de terceros): pads en acordes, sub grave y pulso suave a 96 bpm.
import sys, math, wave, struct
import numpy as np
out = sys.argv[1]; dur = float(sys.argv[2]) if len(sys.argv) > 2 else 72.0
sr = 44100; n = int(sr * dur); t = np.arange(n) / sr
bpm = 96; beat = 60 / bpm; bar = beat * 4
# Progresión: Am9 – Fmaj7 – Cmaj7 – G6, dos compases cada uno, en A2.
def hz(m): return 440 * 2 ** ((m - 69) / 12)
chords = [[45, 52, 55, 59, 64], [41, 48, 52, 57, 60], [48, 52, 55, 59, 62], [43, 47, 50, 55, 59]]
mix = np.zeros(n)
def pad(freq, start, length):
    i0, i1 = int(start * sr), min(n, int((start + length) * sr))
    if i1 <= i0: return
    tt = np.arange(i1 - i0) / sr
    env = np.minimum(1, tt / 1.6) * np.minimum(1, (length - tt) / 1.8)
    env = np.clip(env, 0, 1)
    det = [0.998, 1.0, 1.002]
    sig = sum(np.sin(2 * np.pi * freq * d * tt + np.sin(2 * np.pi * 0.11 * tt) * 0.3) for d in det) / 3
    sig += 0.35 * np.sign(np.sin(2 * np.pi * freq * 2 * tt)) * np.sin(2 * np.pi * 0.07 * tt + 1) ** 2 * 0.25
    mix[i0:i1] += sig * env * 0.16
total_bars = int(dur / bar) + 1
for b in range(total_bars):
    ch = chords[(b // 2) % 4]
    for m in ch: pad(hz(m), b * bar, bar * 1.05)
    # sub
    i0, i1 = int(b * bar * sr), min(n, int((b + 1) * bar * sr))
    tt = np.arange(i1 - i0) / sr
    mix[i0:i1] += np.sin(2 * np.pi * hz(ch[0] - 12) * tt) * 0.22 * np.minimum(1, tt / 0.4) * np.minimum(1, (bar - tt) / 0.6)
# pulso suave cada beat (clic filtrado), más presente a partir del compás 4
for k in range(int(dur / beat)):
    i0 = int(k * beat * sr); i1 = min(n, i0 + int(0.12 * sr))
    tt = np.arange(i1 - i0) / sr
    amp = 0.12 if k >= 16 else 0.05
    if k % 4 == 0: amp *= 1.6
    mix[i0:i1] += np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 40) * amp
# brillo: arpegio lento de octava alta cada compás desde el compás 8
for b in range(8, total_bars):
    ch = chords[(b // 2) % 4]
    for j, m in enumerate(ch[1:]):
        s = b * bar + j * beat
        i0, i1 = int(s * sr), min(n, int((s + 1.4) * sr))
        if i1 <= i0: continue
        tt = np.arange(i1 - i0) / sr
        mix[i0:i1] += np.sin(2 * np.pi * hz(m + 24) * tt) * np.exp(-tt * 2.2) * 0.05
# eco tempo-sincronizado + fades
delay = int(beat * 0.75 * sr)
echo = np.zeros(n); echo[delay:] = mix[:-delay] * 0.35; mix += echo
fade_in = np.minimum(1, t / 2.5); fade_out = np.clip((dur - t) / 4.0, 0, 1)
mix *= fade_in * fade_out
mix = np.tanh(mix * 1.4) * 0.85
# estéreo ligero
left = mix; right = np.roll(mix, int(0.004 * sr)) * 0.98
data = np.stack([left, right], axis=1)
data = (np.clip(data, -1, 1) * 32767).astype('<i2')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(data.tobytes())
print('ok', out, dur)
