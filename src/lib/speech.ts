// 영어 음성 재생.
// 1순위: 미리 만들어 넣은 음성파일(public/audio/*.wav) — 기기 TTS 없이도 모든 폰에서 재생됨.
// 2순위(파일이 없거나 실패): 브라우저 Web Speech API(TTS).
// slug()는 scripts/gen-voice.mjs 의 slug 와 반드시 동일해야 한다.

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

const AUDIO_BASE = `${import.meta.env.BASE_URL}audio/`;

let player: HTMLAudioElement | null = null;
function getPlayer(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = "auto";
  }
  return player;
}

// ── Web Speech(대체용) ─────────────────────────────
let cachedVoice: SpeechSynthesisVoice | null = null;
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  cachedVoice =
    voices.find((v) => v.lang === "en-US" && /female|samantha|zira/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  return cachedVoice;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

function webSpeak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  let tries = 0;
  const attempt = () => {
    if (!synth.getVoices().length && tries < 12) {
      tries += 1;
      window.setTimeout(attempt, 120);
      return;
    }
    synth.cancel();
    synth.resume();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.lang = "en-US";
    utter.rate = 0.8;
    utter.pitch = 1.15;
    utter.volume = 1;
    synth.speak(utter);
  };
  attempt();
}

// ── 공개 API ───────────────────────────────────────

// 음성파일을 재생하고, 없거나 실패하면 Web Speech로 대체.
export function speak(text: string): void {
  if (typeof window === "undefined") return;

  const a = getPlayer();
  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    webSpeak(text);
  };

  try {
    a.pause();
    a.muted = false;
    a.onerror = fallback; // 파일 없음(404)/디코딩 실패 → TTS
    a.src = `${AUDIO_BASE}${slug(text)}.wav`;
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === "function") p.catch(fallback);
  } catch {
    fallback();
  }
}

// 첫 사용자 제스처(START 탭)에서 오디오 재생과 음성엔진을 깨운다.
export function unlockSpeech(): void {
  if (typeof window === "undefined") return;
  // HTMLAudio 프라임(무음으로 한 번 재생 시도)
  try {
    const a = getPlayer();
    a.muted = true;
    a.src = `${AUDIO_BASE}one.wav`;
    const p = a.play();
    if (p && typeof p.then === "function") {
      p
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch(() => {});
    }
  } catch {
    // 무시
  }
  // Web Speech 대체 경로도 준비
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.resume();
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      window.speechSynthesis.speak(warm);
    } catch {
      // 무시
    }
  }
}

export function askForWord(word: string): void {
  speak(`Can you find the ${word}?`);
}
