// Text-to-speech via the Web Speech API. Prefers a US English voice and speaks
// slowly (rate 0.8) for young children.

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
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

// Voice list may load asynchronously; warm the cache when it becomes available.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

// 모바일(특히 iOS Safari)은 첫 사용자 제스처 안에서 speechSynthesis.speak()를
// 한 번 호출해줘야 이후 음성이 재생된다. START 탭에서 이 함수로 엔진을 깨운다.
export function unlockSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.getVoices(); // 음성 목록 로딩 유도
    synth.resume();
    // 소리 없이 엔진만 활성화(무음 워밍업)
    const warm = new SpeechSynthesisUtterance(" ");
    warm.volume = 0;
    synth.speak(warm);
  } catch {
    // 무시
  }
}

export function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  // 안드로이드 크롬은 로드 직후 getVoices()가 비어 있어 첫 음성이 씹힌다.
  // 음성 목록이 준비될 때까지 잠깐(최대 ~1.5초) 기다렸다가 말한다.
  let tries = 0;
  const attempt = () => {
    if (!synth.getVoices().length && tries < 12) {
      tries += 1;
      window.setTimeout(attempt, 120);
      return;
    }
    synth.cancel(); // 이전 음성 중지
    synth.resume(); // 일부 모바일의 일시정지 상태 방지

    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.lang = "en-US";
    utter.rate = 0.8; // 느리게, 아이용
    utter.pitch = 1.15;
    utter.volume = 1;
    synth.speak(utter);
  };
  attempt();
}

export function askForWord(word: string): void {
  speak(`Can you find the ${word}?`);
}
