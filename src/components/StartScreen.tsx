import {
  EGG_EMOJI,
  levelForStars,
  petForCount,
  petMeter,
  type Progress,
} from "../lib/progress";

interface Props {
  onStart: () => void;
  bestScore: number | null;
  progress: Progress;
  onOpenFriends: () => void;
  onOpenStickers: () => void;
}

export default function StartScreen({
  onStart,
  bestScore,
  progress,
  onOpenFriends,
  onOpenStickers,
}: Props) {
  const pet = petForCount(progress.totalCorrect);
  const petEmoji = pet ? pet.emoji : EGG_EMOJI;
  const meter = petMeter(progress.totalCorrect);
  const level = levelForStars(progress.stars);
  const meterPct = meter.maxed ? 100 : Math.round((meter.have / meter.need) * 100);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-7 px-6 py-10 text-center">
      {/* 내 친구(성장 중인 펫) */}
      <div className="flex flex-col items-center gap-2">
        <div className="animate-floaty text-8xl sm:text-9xl">{petEmoji}</div>
        <div className="w-48 rounded-full bg-white/25 px-4 py-2 backdrop-blur">
          <div className="text-sm font-black text-white">
            {pet ? pet.name : "My Egg"} · {meter.maxed ? "MAX" : `${meter.have}/${meter.need}`}
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/40">
            <div
              className="h-full rounded-full bg-yellow-300"
              style={{ width: `${meterPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-md sm:text-6xl">
          영어 그림 퀴즈
        </h1>
        {/* 레벨 + 별 */}
        <div className="flex items-center justify-center gap-2 text-white">
          <span className="rounded-full bg-white/25 px-4 py-1 text-base font-black backdrop-blur">
            {level.emoji} Lv.{level.level} {level.name}
          </span>
          <span className="rounded-full bg-white/25 px-4 py-1 text-base font-black backdrop-blur">
            ⭐ {progress.stars}
          </span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="animate-pulse-big rounded-[2.5rem] bg-white px-16 py-8 text-5xl font-black text-pink-500 shadow-2xl transition-transform active:scale-95 sm:px-24 sm:py-10 sm:text-6xl"
      >
        ▶ 시작
      </button>

      {/* 컬렉션 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={onOpenFriends}
          className="rounded-3xl bg-white/90 px-6 py-4 text-xl font-black text-purple-600 shadow-lg transition-transform active:scale-95"
        >
          🐾 내 친구들
        </button>
        <button
          onClick={onOpenStickers}
          className="rounded-3xl bg-white/90 px-6 py-4 text-xl font-black text-purple-600 shadow-lg transition-transform active:scale-95"
        >
          📖 스티커 도감
        </button>
      </div>

      {bestScore !== null && (
        <p className="rounded-full bg-white/25 px-6 py-2 text-lg font-bold text-white backdrop-blur">
          🏆 최고 점수: {bestScore}%
        </p>
      )}
    </div>
  );
}
