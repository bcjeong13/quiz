// Simple sound effects generated with the Web Audio API so we need no audio
// files. A short happy arpeggio for correct, a soft low buzz for wrong.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

// Browsers start the AudioContext suspended until a user gesture. Call this on
// the first tap (the START button) to unlock audio.
export function unlockAudio(): void {
  const c = getCtx();
  if (c && c.state === "suspended") void c.resume();
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gain: number,
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playCorrect(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  // C5 - E5 - G5 - C6 happy arpeggio
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(c, f, i * 0.09, 0.16, "triangle", 0.25));
}

export function playWrong(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  tone(c, 196, 0, 0.18, "square", 0.15); // G3
  tone(c, 155.56, 0.12, 0.22, "square", 0.15); // Eb3
}

export function playFinish(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  notes.forEach((f, i) => tone(c, f, i * 0.12, 0.22, "triangle", 0.22));
}

// 콤보 효과음 — 콤보가 높을수록 음이 올라가고 화려해진다.
export function playCombo(combo: number): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const base = 523.25 * Math.pow(2, Math.min(combo, 10) / 12); // 콤보만큼 음 상승
  const notes = [base, base * 1.26, base * 1.5];
  notes.forEach((f, i) => tone(c, f, i * 0.07, 0.14, "triangle", 0.22));
}

// 부화/성장 — 반짝이며 올라가는 마법 아르페지오
export function playHatch(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1318.51];
  notes.forEach((f, i) => tone(c, f, i * 0.08, 0.2, "triangle", 0.2));
}

// 레벨업 — 씩씩한 팡파르
export function playLevelUp(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  tone(c, 392, 0, 0.14, "square", 0.16); // G4
  tone(c, 523.25, 0.13, 0.14, "square", 0.16); // C5
  tone(c, 659.25, 0.26, 0.14, "square", 0.16); // E5
  tone(c, 783.99, 0.39, 0.3, "triangle", 0.22); // G5 (길게)
}

// 보물상자 열기 — 반짝 사운드
export function playTreasure(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const notes = [1046.5, 1318.51, 1567.98, 2093];
  notes.forEach((f, i) => tone(c, f, i * 0.06, 0.16, "sine", 0.18));
}

// 보너스 스테이지 진입 팡파르
export function playBonus(): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const notes = [659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
  notes.forEach((f, i) => tone(c, f, i * 0.1, 0.2, "triangle", 0.22));
}
