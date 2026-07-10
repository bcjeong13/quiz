import { useEffect } from "react";
import { FINISH_MESSAGES, randomOf, TOTAL_QUESTIONS } from "../lib/game";
import { playFinish } from "../lib/sound";
import type { Treasure } from "../lib/progress";
import Confetti from "./Confetti";
import TreasureBox from "./TreasureBox";

interface Props {
  correct: number;
  wrong: number;
  starsEarned: number;
  bestScore: number | null;
  onCollectTreasure: (t: Treasure) => void;
  onPlayAgain: () => void;
}

export default function ResultScreen({
  correct,
  wrong,
  starsEarned,
  bestScore,
  onCollectTreasure,
  onPlayAgain,
}: Props) {
  const score = Math.round((correct / TOTAL_QUESTIONS) * 100);
  const message = randomOf(FINISH_MESSAGES);
  const isNewBest = bestScore !== null && score >= bestScore && score > 0;

  useEffect(() => {
    playFinish();
  }, []);

  const face = score >= 80 ? "🏆" : score >= 50 ? "🎉" : "🌈";

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center gap-6 overflow-hidden px-6 py-12 text-center">
      <Confetti />

      <div className="animate-floaty text-7xl sm:text-8xl">{face}</div>

      <h1 className="text-4xl font-black text-white drop-shadow sm:text-6xl">
        게임 끝!
      </h1>

      <div className="w-full max-w-md space-y-4 rounded-[2rem] bg-white/95 p-8 shadow-2xl">
        <div className="flex justify-around text-2xl font-extrabold sm:text-3xl">
          <div className="text-green-600">
            <div className="text-5xl">{correct}</div>
            정답
          </div>
          <div className="text-rose-500">
            <div className="text-5xl">{wrong}</div>
            오답
          </div>
          <div className="text-amber-500">
            <div className="text-5xl">+{starsEarned}</div>⭐ 별
          </div>
        </div>

        <div className="text-6xl font-black text-purple-600 sm:text-7xl">
          {score}%
        </div>

        <p className="text-2xl font-extrabold text-amber-500 sm:text-3xl">
          {message}
        </p>

        {isNewBest && (
          <p className="text-lg font-bold text-pink-500">🎊 새 최고 점수!</p>
        )}
        {!isNewBest && bestScore !== null && (
          <p className="text-base font-bold text-gray-400">최고: {bestScore}%</p>
        )}
      </div>

      {/* 보물상자 보상 */}
      <div className="flex min-h-[9rem] items-center justify-center">
        <TreasureBox onCollected={onCollectTreasure} />
      </div>

      <button
        onClick={onPlayAgain}
        className="animate-pulse-big rounded-[2.5rem] bg-white px-14 py-6 text-4xl font-black text-pink-500 shadow-2xl transition-transform active:scale-95 sm:text-5xl"
      >
        🔁 다시 하기
      </button>
    </div>
  );
}
