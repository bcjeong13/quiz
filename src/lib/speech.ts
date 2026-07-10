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

export function speak(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything currently speaking

  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  utter.lang = "en-US";
  utter.rate = 0.8; // slow, kid-friendly
  utter.pitch = 1.15;
  synth.speak(utter);
}

export function askForWord(word: string): void {
  speak(`Can you find the ${word}?`);
}
