import { petMeter } from "../lib/progress";

// 상단 표시용 작은 뱃지들. 글 못 읽는 아이도 이모지+숫자만으로 이해 가능.

export function StarBadge({ stars }: { stars: number }) {
  return (
    <span className="rounded-full bg-white/25 px-4 py-1 text-base font-black text-white backdrop-blur sm:text-lg">
      ⭐ {stars}
    </span>
  );
}

// 알/펫 성장 게이지 (예: 🐥 7/10)
export function PetBadge({ totalCorrect }: { totalCorrect: number }) {
  const m = petMeter(totalCorrect);
  const pct = m.maxed ? 100 : Math.round((m.have / m.need) * 100);
  return (
    <span className="flex items-center gap-2 rounded-full bg-white/25 px-3 py-1 backdrop-blur">
      <span className="text-xl leading-none">{m.emoji}</span>
      <span className="flex flex-col">
        <span className="text-xs font-black leading-none text-white">
          {m.maxed ? "MAX" : `${m.have}/${m.need}`}
        </span>
        <span className="mt-0.5 h-1.5 w-12 overflow-hidden rounded-full bg-white/40">
          <span
            className="block h-full rounded-full bg-yellow-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </span>
      </span>
    </span>
  );
}
