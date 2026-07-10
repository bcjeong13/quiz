// 영구 저장(localStorage) 진행도 + 파생 계산.
// 게임화 요소(알/펫 성장, 별, 레벨, 스티커 도감, 보물)의 단일 소스.

export interface Progress {
  totalCorrect: number; // 지금까지 푼 문제 수(누적) → 알/펫 성장
  stars: number; // 누적 별 → 플레이어 레벨
  words: string[]; // 스티커 도감에 등록된 단어
  treasures: string[]; // 보물상자로 얻은 보상 id(중복 제거)
}

// ── 펫(친구) 성장 단계 ──────────────────────────────
// 누적 정답 threshold 이상이면 해당 친구 획득. 그 전(0~9)은 '알' 상태.
export interface Pet {
  key: string;
  emoji: string;
  name: string;
  threshold: number;
  greeting: string; // 부화/등장·터치 시 영어 인사(TTS)
}
export const EGG_EMOJI = "🥚";
export const PETS: Pet[] = [
  { key: "chick", emoji: "🐥", name: "Chick", threshold: 10, greeting: "Hi! I am a chick! Nice to meet you!" },
  { key: "rabbit", emoji: "🐰", name: "Rabbit", threshold: 20, greeting: "Hello! I am a rabbit! Hop hop!" },
  { key: "panda", emoji: "🐼", name: "Panda", threshold: 40, greeting: "Hi! I am a panda!" },
  { key: "dino", emoji: "🦖", name: "Dino", threshold: 70, greeting: "Roar! I am a dino!" },
  { key: "unicorn", emoji: "🦄", name: "Unicorn", threshold: 100, greeting: "Hello! I am a unicorn!" },
];

// ── 플레이어 레벨(별 기준) ──────────────────────────
export interface Level {
  level: number;
  name: string;
  emoji: string;
  minStars: number;
}
export const LEVELS: Level[] = [
  { level: 1, name: "Beginner", emoji: "🌱", minStars: 0 },
  { level: 2, name: "Explorer", emoji: "🧭", minStars: 20 },
  { level: 3, name: "Adventurer", emoji: "🗺️", minStars: 50 },
  { level: 4, name: "English Hero", emoji: "🦸", minStars: 100 },
  { level: 5, name: "Word Master", emoji: "👑", minStars: 200 },
];

// ── 보물상자 보상 ───────────────────────────────────
export interface Treasure {
  id: string;
  emoji: string;
  name: string;
}
export const TREASURES: Treasure[] = [
  { id: "gold-star", emoji: "⭐", name: "Gold Star" },
  { id: "apple-sticker", emoji: "🍎", name: "Apple Sticker" },
  { id: "dog-sticker", emoji: "🐶", name: "Dog Sticker" },
  { id: "car-sticker", emoji: "🚗", name: "Car Sticker" },
  { id: "funny-hat", emoji: "🎩", name: "Funny Hat" },
  { id: "crown", emoji: "👑", name: "Crown" },
];

// ── 저장/로드 ───────────────────────────────────────
const KEY = "kidsEnglishQuizProgressV1";

export function emptyProgress(): Progress {
  return { totalCorrect: 0, stars: 0, words: [], treasures: [] };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      totalCorrect: p.totalCorrect ?? 0,
      stars: p.stars ?? 0,
      words: Array.isArray(p.words) ? p.words : [],
      treasures: Array.isArray(p.treasures) ? p.treasures : [],
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // 저장 실패는 무시(게임은 계속 진행)
  }
}

// ── 파생 계산 ───────────────────────────────────────

// 누적 정답 수에 해당하는 현재 펫(없으면 null = 알)
export function petForCount(n: number): Pet | null {
  let current: Pet | null = null;
  for (const pet of PETS) if (n >= pet.threshold) current = pet;
  return current;
}

// before → after 로 넘어가며 새로 부화/성장한 펫(없으면 null)
export function newlyUnlockedPet(before: number, after: number): Pet | null {
  for (const pet of PETS) {
    if (before < pet.threshold && after >= pet.threshold) return pet;
  }
  return null;
}

// 지금까지 획득한 펫 목록
export function unlockedPets(n: number): Pet[] {
  return PETS.filter((p) => n >= p.threshold);
}

// 다음 성장 목표까지의 진행도(알 게이지 "have/need")
export function petMeter(n: number): {
  emoji: string;
  have: number;
  need: number;
  maxed: boolean;
} {
  const current = petForCount(n);
  const prev = current ? current.threshold : 0;
  const next = PETS.find((p) => p.threshold > n);
  if (!next) {
    return { emoji: current?.emoji ?? EGG_EMOJI, have: 1, need: 1, maxed: true };
  }
  return {
    emoji: current ? current.emoji : EGG_EMOJI,
    have: n - prev,
    need: next.threshold - prev,
    maxed: false,
  };
}

// 별 수에 해당하는 레벨
export function levelForStars(stars: number): Level {
  let current = LEVELS[0];
  for (const lv of LEVELS) if (stars >= lv.minStars) current = lv;
  return current;
}

// before → after 로 넘어가며 레벨업 했으면 새 레벨(없으면 null)
export function newLevel(before: number, after: number): Level | null {
  const b = levelForStars(before).level;
  const a = levelForStars(after);
  return a.level > b ? a : null;
}

// 결정적 랜덤(Math.random 사용) — 보물 뽑기용
export function randomTreasure(): Treasure {
  return TREASURES[Math.floor(Math.random() * TREASURES.length)];
}
